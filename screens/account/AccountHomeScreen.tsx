import { useNavigation } from "@react-navigation/native";
import * as MailComposer from "expo-mail-composer";
import * as React from "react";
import { Alert, StyleSheet, View } from "react-native";
import { TextInput } from "react-native-paper";
import { Button, HeaderButton, ScreenContainer } from "../../components";
import Firebase from "../../firebase";
import { useDepartment, useFlashMessage, useGlobalLoading } from "../../hooks";

const AccountHomeScreen: React.FC = () => {
  const user = useDepartment();
  const nav = useNavigation();
  const { execGlobalLoading } = useGlobalLoading();
  const msg = useFlashMessage();

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
            await Firebase.Auth.signOut();
          });

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

  const displayAccountType = () => {
    switch (user!.type) {
      case "operator":
        return "OPERADOR";
      case "maintenance":
        return "MANUTENÇÃO";
      case "viewOnly":
        return "VISUALIZADOR";
    }
  };

  React.useLayoutEffect(() => {
    nav.setOptions({
      headerRight: () => (
        <HeaderButton
          title="Sair"
          icon="log-out-outline"
          onPress={onSignOut}
          color="danger"
        />
      ),
    });
  }, [nav]);

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View>
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
            value={displayAccountType()}
            disabled
          />
        </View>

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
});

export default AccountHomeScreen;
