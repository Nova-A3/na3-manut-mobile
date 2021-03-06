import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import firebase from "firebase/app";
import "firebase/auth";
import { Alert, Platform } from "react-native";
import Database from "../db";
import { Department } from "../types";
import { fsCollectionId } from "../utils";
import { Na3Dpt } from "./../types/Na3/Na3Dpt";
import FbFirestore from "./FbFirestore";

type AuthCredentials = { username: string; password: string };

class FbAuth {
  async signIn(credentials: AuthCredentials): Promise<{
    user: firebase.auth.UserCredential | null;
    error: { title: string; description: string } | null;
  }> {
    const { username, password } = this.fixAuthCreds(credentials);

    const email = Database.getDepartment(username)?.email;

    if (!email) {
      return {
        error: {
          title: "Login inexistente",
          description: `O login "${username}" não existe na base de dados.`,
        },
        user: null,
      };
    }

    try {
      const user = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);

      await this.storePushToken(username);

      return { user, error: null };
    } catch (e) {
      const error = e as { code: string };
      switch (error.code) {
        case "auth/wrong-password":
          return {
            error: {
              title: "Senha inválida",
              description: "Verifique se você digitou a senha corretamente.",
            },
            user: null,
          };
        case "auth/network-request-failed":
          return {
            error: {
              title: "Sem conexão",
              description: "Verifique se você está conectado à Internet.",
            },
            user: null,
          };
        default:
          return {
            error: {
              title: "Algo deu errado",
              description: `Um erro inesperado ocorreu. Por favor, entre em contato com o administrador do aplicativo para mais informações. Código do erro: ${error.code}`,
            },
            user: null,
          };
      }
    }
  }

  async signOut(department: Department): Promise<void> {
    const currPushToken = (await Notifications.getExpoPushTokenAsync()).data;

    const dptDoc = firebase
      .firestore()
      .collection(fsCollectionId("departments"))
      .doc(department.original.id);

    let update: Na3Dpt = { ...department.original };

    if (department.isPerson) {
      const currPerson = department.original.people.find(
        (p) => p.id === department.username
      )!;

      update = {
        ...update,
        people: [
          ...update.people.filter((p) => p.id !== currPerson.id),
          {
            ...currPerson,
            apps: {
              ...currPerson.apps,
              manut: {
                ...currPerson.apps.manut!,
                pushTokens: currPerson.apps.manut!.pushTokens.filter(
                  (tk) => tk !== currPushToken
                ),
              },
            },
          },
        ],
      };
    } else {
      update = {
        ...update,
        apps: {
          ...update.apps,
          manut: {
            ...update.apps.manut!,
            pushTokens: update.apps.manut!.pushTokens.filter(
              (tk) => tk !== currPushToken
            ),
          },
        },
      };
    }

    await dptDoc.update(update);

    const userPushTokens = (
      await firebase
        .firestore()
        .collection(fsCollectionId("push-tokens"))
        .doc(department.username)
        .get()
    ).data()?.tokens as string[] | null;
    if (userPushTokens) {
      const currPushToken = (await Notifications.getExpoPushTokenAsync()).data;
      await firebase
        .firestore()
        .collection(fsCollectionId("push-tokens"))
        .doc(department.username)
        .update({
          tokens: userPushTokens.filter((pT) => pT !== currPushToken),
        });
    }

    FbFirestore.unregisterSnapshotListeners();

    await firebase.auth().signOut();
  }

  private fixAuthCreds({
    username,
    password,
  }: AuthCredentials): AuthCredentials {
    return {
      username: username.trim().toLowerCase(),
      password: password.trim(),
    };
  }

  async storePushToken(username: string): Promise<void> {
    if (Constants.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        Alert.alert(
          "Notificações",
          "ATENÇÃO: A aceitação do recebimento de notificações é OBRIGATÓRIA."
        );
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;

      const dpt = Database.getDepartment(username);

      if (dpt) {
        const dptDoc = firebase
          .firestore()
          .collection(fsCollectionId("departments"))
          .doc(dpt.original.id);

        let update: Na3Dpt = { ...dpt.original };

        if (dpt.isPerson) {
          const currPerson = dpt.original.people.find(
            (p) => p.id === dpt.username
          )!;

          update = {
            ...update,
            people: [
              ...update.people.filter((p) => p.id !== currPerson.id),
              {
                ...currPerson,
                apps: {
                  ...currPerson.apps,
                  manut: {
                    ...currPerson.apps.manut!,
                    pushTokens: [
                      ...currPerson.apps.manut!.pushTokens.filter(
                        (tk) => tk !== token
                      ),
                      token,
                    ],
                  },
                },
              },
            ],
          };
        } else {
          update = {
            ...update,
            apps: {
              ...update.apps,
              manut: {
                ...update.apps.manut!,
                pushTokens: [
                  ...update.apps.manut!.pushTokens.filter((tk) => tk !== token),
                  token,
                ],
              },
            },
          };
        }

        await dptDoc.update(update);
      }

      const docsWithToken = await firebase
        .firestore()
        .collection(fsCollectionId("push-tokens"))
        .where("tokens", "array-contains", token)
        .get();

      if (docsWithToken.size > 0) {
        docsWithToken.forEach((doc) => {
          doc.ref.update({
            tokens: doc.data().tokens.filter((t: string) => t !== token),
          });
        });
      }

      const doc = await firebase
        .firestore()
        .collection(fsCollectionId("push-tokens"))
        .doc(username)
        .get();

      if (doc.exists) {
        const storedTokens = doc.data()!.tokens;
        if (storedTokens && storedTokens.includes(token)) {
          return;
        }

        await doc.ref.update({
          tokens: storedTokens ? [...storedTokens, token] : [token],
        });
      } else {
        await doc.ref.set({
          tokens: [token],
        });
      }
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
  }
}

export default FbAuth;
