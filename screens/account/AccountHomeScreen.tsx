import { useNavigation } from "@react-navigation/native";
import * as MailComposer from "expo-mail-composer";
import * as Notifications from "expo-notifications";
import * as React from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Switch, Text, TextInput } from "react-native-paper";
import { useDispatch } from "react-redux";
import {
  Button,
  Header,
  HeaderButton,
  MultipleHeaderButtons,
  ScreenContainer,
} from "../../components";
import { COLORS } from "../../constants";
import Db from "../../db";
import Firebase, { Fb } from "../../firebase";
import { useDepartment, useFlashMessage, useGlobalLoading } from "../../hooks";
import { registerDataFirstLoad, setSwapping } from "../../store/actions";
import { translateAccountType } from "../../utils";

const AccountHomeScreen: React.FC = () => {
  const user = useDepartment();
  const nav = useNavigation();
  const { execGlobalLoading } = useGlobalLoading();
  const msg = useFlashMessage();
  const [notificationsStatus, setNotificationsStatus] =
    React.useState<boolean>();
  const dispatch = useDispatch();

  const onContact = () => {
    MailComposer.composeAsync({
      recipients: ["msantos@novaa3.com.br"],
      subject: `[App: MANUTENÇÃO] `,
    });
  };

  const onSignOut = () => {
    Alert.alert("Sair?", "Tem certeza que deseja sair?", [
      {
        style: "destructive",
        text: "Sim, sair",
        onPress: async () => {
          await execGlobalLoading(async () => {
            await Firebase.Auth.signOut(user!);
          });

          dispatch(registerDataFirstLoad(false));

          msg.show({
            type: "warning",
            title: "Desconectado",
            text: "Você saiu.",
          });
        },
      },
      { style: "default", text: "Não, ficar" },
    ]);
  };

  const onToggleNotifications = async () => {
    if (notificationsStatus) {
      setNotificationsStatus(false);
    } else {
      setNotificationsStatus(true);
    }

    const tokens = (
      await Fb.Fs.collection("push-tokens").doc(user?.username).get()
    ).data()!.tokens as string[];
    const userToken = (await Notifications.getExpoPushTokenAsync()).data;

    if (tokens.includes(userToken)) {
      await Fb.Fs.collection("push-tokens")
        .doc(user?.username)
        .update({ tokens: tokens.filter((t) => t !== userToken) });
    } else {
      await Fb.Fs.collection("push-tokens")
        .doc(user?.username)
        .update({ tokens: [...tokens, userToken] });
    }
  };

  const onSwapAccounts = (swapUsernames: string | string[]) => {
    if (typeof swapUsernames === "string") {
      swapUsernames = [swapUsernames];
    }
    const swapAccs = swapUsernames.map((user) => Db.getDepartment(user)!);

    Alert.alert("Alternar contas", `Tem certeza que deseja trocar de conta?`, [
      ...swapAccs.map((acc) => ({
        style: (swapAccs.length === 1 ? "destructive" : "default") as
          | "destructive"
          | "default",
        text: `Trocar para ${acc.displayName}`,
        onPress: () =>
          execGlobalLoading(async () => {
            dispatch(setSwapping(true));
            await Firebase.Auth.signOut(user!);
            dispatch(registerDataFirstLoad(false));
            dispatch(setSwapping(false));
            await Firebase.Auth.signIn({
              username: acc.username,
              password: `manut-${acc.username}`,
            });

            msg.show({
              type: "success",
              title: "Conta alternada",
              text: `Você mudou para: ${acc.displayName}`,
            });
          }),
      })),
      { style: "cancel", text: "Não, ficar" },
    ]);
  };

  React.useLayoutEffect(() => {
    nav.setOptions({
      headerLeft: () => (
        <HeaderButton
          left
          title="Ajuda"
          icon="school-outline"
          onPress={() => nav.navigate("accountHelp")}
        />
      ),
      headerRight: () => (
        <MultipleHeaderButtons
          items={[
            user!.swappableWith
              ? {
                  title: "Alternar contas",
                  iconName: "swap-horizontal-outline",
                  onPress: () => onSwapAccounts(user!.swappableWith!),
                  color: COLORS.SYSTEM.BLUE,
                }
              : undefined,
            {
              title: "Sair",
              iconName: "log-out-outline",
              onPress: onSignOut,
              color: COLORS.SYSTEM.RED,
            },
          ]}
        />
      ),
    });
  }, [nav]);

  React.useEffect(() => {
    Fb.Fs.collection("push-tokens")
      .doc(user?.username)
      .onSnapshot(async (snapshot) => {
        setNotificationsStatus(
          snapshot
            .data()
            ?.tokens.includes(
              (await Notifications.getExpoPushTokenAsync()).data
            )
        );
      });
  }, []);

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <ScrollView>
          <TextInput
            mode="outlined"
            label="Logado como"
            value={user?.displayName}
            disabled
            style={styles.accountInfo}
          />
          <TextInput
            mode="outlined"
            label="Tipo de conta"
            value={translateAccountType(user!.type).toUpperCase()}
            disabled
          />

          {user?.isViewOnly() && (
            <View style={styles.notificationsContainer}>
              <Header title="Configurar notificações" />
              <View style={styles.notificationsSwitch}>
                <Text>Ativar/Desativar</Text>
                <Switch
                  value={notificationsStatus}
                  onValueChange={onToggleNotifications}
                  disabled={notificationsStatus === undefined}
                />
              </View>
            </View>
          )}
        </ScrollView>

        <View>
          <Button
            label="Falar com o Desenvolvedor"
            color="primary"
            onPress={onContact}
            style={styles.devBtn}
          />
          <Button label="Sair" color="danger" onPress={onSignOut} />
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  accountInfo: {
    marginBottom: 12,
  },
  devBtn: {
    marginBottom: 15,
  },
  notificationsContainer: {
    marginTop: 20,
  },
  notificationsSwitch: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 6,
  },
});

export default AccountHomeScreen;
