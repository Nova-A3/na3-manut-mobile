import Constants from "expo-constants";
import * as React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Text, TextInput, Title } from "react-native-paper";
import { Button } from "../components";
import { COLORS } from "../constants";
import Firebase from "../firebase";
import { useFlashMessage, useGlobalLoading } from "../hooks";

const SignInScreen: React.FC = () => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { isGlobalLoading, execGlobalLoading } = useGlobalLoading();
  const msg = useFlashMessage();

  const onSignIn = async () => {
    await execGlobalLoading(async () => {
      const { error } = await Firebase.Auth.signIn({ username, password });

      if (error) {
        if (username.trim().toLowerCase() === "flexografia") {
          return msg.show({
            type: "danger",
            title: "Usuário redefinido",
            text: 'O login "flexografia" foi dividido em "flexografia-papel" e "flexografia-plastico". Por favor, tente novamente usando o mesmo padrão de senha.',
          });
        }

        msg.show({
          type: "danger",
          title: error.title,
          text: error.description,
        });
      }
    });
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior="position"
          style={styles.container}
          keyboardVerticalOffset={-100}
        >
          <View style={styles.view}>
            <View style={styles.titleContainer}>
              <Title style={styles.title}>Manutenção</Title>
            </View>

            <TextInput
              mode="outlined"
              label="Login"
              value={username}
              onChangeText={(val) => setUsername(val)}
              left={<TextInput.Icon name="account" />}
              style={styles.formField}
              disabled={isGlobalLoading}
            />
            <TextInput
              secureTextEntry
              mode="outlined"
              label="Senha"
              value={password}
              onChangeText={(val) => setPassword(val)}
              left={<TextInput.Icon name="lock" />}
              style={styles.formField}
              disabled={isGlobalLoading}
            />

            <View style={styles.btnContainer}>
              <Button
                label={isGlobalLoading ? "Entrando..." : "Entrar"}
                icon={isGlobalLoading ? undefined : "arrow-right"}
                onPress={onSignIn}
                iconRight
                disabled={isGlobalLoading}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      <View style={styles.version}>
        <Text style={styles.versionText}>V{Constants.manifest?.version}</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  view: {
    flexGrow: 1,
  },
  titleContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    marginBottom: 18,
  },
  title: {
    textAlign: "center",
  },
  formField: {
    marginBottom: 12,
  },
  btnContainer: {
    marginTop: 36,
  },
  version: {
    position: "absolute",
    bottom: 40,
    right: 30,
  },
  versionText: {
    fontStyle: "italic",
    color: COLORS.SYSTEM.GRAY,
  },
});

export default SignInScreen;
