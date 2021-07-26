import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import firebase from "firebase/app";
import "firebase/auth";
import { Alert, Platform } from "react-native";
import Database from "../db";

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
      if (e.code === "auth/wrong-password") {
        return {
          error: {
            title: "Senha inválida",
            description: "Verifique se você digitou a senha corretamente.",
          },
          user: null,
        };
      } else {
        return {
          error: {
            title: "Algo deu errado",
            description: `Um erro inesperado ocorreu. Por favor, entre em contato com o administrador do aplicativo para mais informações. Código do erro: ${e.code}`,
          },
          user: null,
        };
      }
    }
  }

  async signOut(): Promise<void> {
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

      const docsWithToken = await firebase
        .firestore()
        .collection("push-tokens")
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
        .collection("push-tokens")
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
