import { useNavigation } from "@react-navigation/native";
import firebase from "firebase";
import moment, { Moment } from "moment";
import * as React from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Divider, Text, TextInput } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
import { SingleChange } from "react-native-paper-dates/lib/typescript/src/Date/Calendar";
import { InternalProjects } from "../../classes";
import { Button, Dropdown, Header } from "../../components";
import { useFlashMessage, useGlobalLoading } from "../../hooks";
import { InternalProject } from "../../types";

const InternalProjectsNewFormScreen: React.FC = () => {
  const [author, setAuthor] =
    React.useState<InternalProject["events"][number]["author"]>("");
  const [title, setTitle] = React.useState<InternalProject["title"]>("");
  const [description, setDescription] =
    React.useState<InternalProject["description"]>("");
  const [team, setTeam] = React.useState<InternalProject["team"]>({
    manager: "",
    others: "",
  });
  const [priority, setPriority] =
    React.useState<InternalProject["priority"]>("low");
  const [eta, setEta] = React.useState<Moment>();

  const [openSelectEta, setOpenSelectEta] = React.useState(false);

  const nav = useNavigation();
  const { execGlobalLoading } = useGlobalLoading();
  const msg = useFlashMessage();

  const validateInputs = React.useCallback((): string | null => {
    if (author.trim().length === 0) {
      return 'O campo "Seu nome" é obrigatório.';
    }
    if (title.trim().length === 0) {
      return 'O campo "Título" é obrigatório.';
    }
    if (description.trim().length === 0) {
      return 'O campo "Descrição" é obrigatório.';
    }
    if (team.manager.trim().length === 0) {
      return 'O campo "Responsável" é obrigatório.';
    }
    if (team.others.trim().length === 0) {
      return 'O campo "Equipe" é obrigatório.';
    }
    if (!eta) {
      return "Você precisa definir uma data prevista para conclusão.";
    }
    return null;
  }, [author, title, description, team, eta]);

  const onDismissEta = React.useCallback(() => {
    setOpenSelectEta(false);
  }, []);

  const onConfirmEta: SingleChange = React.useCallback((ev) => {
    setOpenSelectEta(false);
    setEta(moment(ev.date).endOf("day"));
  }, []);

  const onSubmit = React.useCallback(() => {
    const error = validateInputs();

    if (error) {
      msg.show({
        type: "warning",
        title: "Campo requerido",
        text: error,
      });
      return;
    }

    Alert.alert(
      `Novo projeto`,
      `Confirma a publicação do projeto "${title}"?`,
      [
        { style: "destructive", text: "Não, voltar" },
        {
          text: "Sim, publicar",
          onPress: () =>
            execGlobalLoading(async () => {
              try {
                const internalId = await InternalProjects.findNextId();
                const project: InternalProject = {
                  internalId,
                  title: title.trim(),
                  description: description.trim(),
                  team: {
                    manager: team.manager.trim(),
                    others: team.others.trim(),
                  },
                  priority,
                  eta: firebase.firestore.Timestamp.fromDate(eta!.toDate()),
                  events: [
                    {
                      type: "create",
                      timestamp: firebase.firestore.Timestamp.now(),
                      author: author.trim(),
                    },
                  ],
                };

                await InternalProjects.publish(project);

                msg.show({
                  type: "success",
                  title: "Projeto publicado",
                  text: `Projeto ${InternalProjects.formatId(
                    project
                  )} — "${title}" publicado com sucesso.`,
                });
              } catch (e) {
                msg.show({
                  type: "warning",
                  title: "Erro ao publicar projeto",
                  text: "Um erro inesperado ocorreu. Por favor, entre em contato com o administrador do aplicativo para mais informações.",
                });
              } finally {
                nav.navigate("internalProjectsHome");
              }
            }),
        },
      ]
    );
  }, [
    author,
    title,
    description,
    team,
    priority,
    eta,
    nav,
    msg,
    execGlobalLoading,
  ]);

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.view}>
            <View style={styles.formSection}>
              <Header title="Cabeçalho" />
              <TextInput
                mode="outlined"
                label="Seu nome"
                value={author}
                onChangeText={(val) => setAuthor(val)}
                style={styles.formField}
                autoFocus
              />
              <TextInput
                mode="outlined"
                label="Título"
                value={title}
                onChangeText={(val) => setTitle(val)}
                style={styles.formField}
              />
              <TextInput
                mode="outlined"
                label="Descrição"
                value={description}
                onChangeText={(val) => setDescription(val)}
                style={styles.formField}
              />
            </View>

            <View style={styles.formSection}>
              <Header title="Equipe" />
              <TextInput
                mode="outlined"
                label="Responsável"
                value={team.manager}
                onChangeText={(val) =>
                  setTeam((currTeam) => ({ ...currTeam, manager: val }))
                }
                style={styles.formField}
              />
              <TextInput
                mode="outlined"
                label="Equipe"
                value={team.others}
                onChangeText={(val) =>
                  setTeam((currTeam) => ({ ...currTeam, others: val }))
                }
                style={styles.formField}
              />
            </View>

            <View style={styles.formSection}>
              <Header title="Prioridade" />
              <Dropdown
                label="Prioridade"
                items={[
                  { value: "low", label: "Baixa" },
                  { value: "medium", label: "Média" },
                  { value: "high", label: "Alta" },
                ]}
                onValueChange={(val) => setPriority(val)}
                style={styles.formField}
              />
            </View>

            <View style={styles.formSection}>
              <Header title="Previsão" />
              <TextInput
                mode="outlined"
                label="Conclusão"
                value={
                  (eta &&
                    `${eta.format("DD/MM/YYYY")} (${eta
                      .clone()
                      .endOf("day")
                      .fromNow()})`) ||
                  "Selecione uma data..."
                }
                onChangeText={(val) => setDescription(val)}
                style={styles.formField}
                disabled
              />
              <Button
                label="Selecionar data"
                icon="calendar"
                onPress={() => setOpenSelectEta(true)}
              />
            </View>

            <View>
              <Button
                label="Enviar"
                icon="check-bold"
                onPress={onSubmit}
                style={styles.sendBtn}
                color="success"
              />
              <Divider />
              <Text style={styles.footer}>Nova A3 • Manutenção</Text>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <DatePickerModal
        locale="pt-BR"
        mode="single"
        visible={openSelectEta}
        onDismiss={onDismissEta}
        date={eta?.toDate()}
        onConfirm={onConfirmEta}
        validRange={{ startDate: moment().toDate() }}
        saveLabel="Concluir"
        label="Data estimada para conclusão"
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  view: {
    flexGrow: 1,
    padding: 20,
  },
  formSection: {
    marginBottom: 12,
  },
  formField: {
    marginBottom: 12,
  },
  sendBtn: {
    marginTop: 12,
    marginBottom: 16,
  },
  footer: {
    textAlign: "right",
    color: "#ccc",
    fontStyle: "italic",
    marginTop: 8,
  },
});

export default InternalProjectsNewFormScreen;
