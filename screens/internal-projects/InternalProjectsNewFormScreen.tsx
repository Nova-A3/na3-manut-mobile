import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
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
import {
  InternalProject,
  InternalProjectChanges,
  InternalProjectEvent,
  InternalProjectsStackParamList,
} from "../../types";

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

  const route =
    useRoute<
      RouteProp<InternalProjectsStackParamList, "internalProjectsNewForm">
    >();
  const nav =
    useNavigation<
      NavigationProp<InternalProjectsStackParamList, "internalProjectsNewForm">
    >();
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

  const getChanges = React.useCallback(() => {
    if (!route.params.editing) {
      return;
    }

    const { project: currProject } = route.params;
    const changes: Partial<InternalProjectChanges> = {};

    if (title.trim() !== currProject.title.trim()) {
      changes.title = { old: currProject.title.trim(), new: title.trim() };
    }
    if (description.trim() !== currProject.description.trim()) {
      changes.description = {
        old: currProject.description.trim(),
        new: description.trim(),
      };
    }
    if (team.manager.trim() !== currProject.team.manager.trim()) {
      changes.teamManager = {
        old: currProject.team.manager,
        new: team.manager.trim(),
      };
    }
    if (team.others.trim() !== currProject.team.others.trim()) {
      changes.teamOthers = {
        old: currProject.team.others,
        new: team.others.trim(),
      };
    }
    if (priority !== currProject.priority) {
      changes.priority = {
        old: currProject.priority,
        new: priority,
      };
    }
    if (!(eta && eta.isSame(moment(currProject.eta.toDate()), "date"))) {
      changes.eta = {
        old: currProject.eta,
        new: firebase.firestore.Timestamp.fromDate(eta!.toDate()),
      };
    }

    if (Object.keys(changes).length === 0) {
      return;
    } else {
      return changes;
    }
  }, [title, description, team, priority, eta]);

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
      route.params.editing
        ? `Editar ${InternalProjects.formatId(route.params.project)}`
        : "Novo projeto",
      route.params.editing
        ? `Confirma a edição do projeto ${InternalProjects.formatId(
            route.params.project
          )}?`
        : `Confirma a publicação do projeto "${title}"?`,
      [
        { style: "cancel", text: "Não, voltar" },
        {
          style: "destructive",
          text: route.params.editing ? "Sim, editar" : "Sim, publicar",
          onPress: () =>
            execGlobalLoading(async () => {
              if (!route.params.editing) {
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
              } else {
                const changes = getChanges();
                if (!changes) {
                  return msg.show({
                    type: "warning",
                    title: "Erro ao editar projeto",
                    text: "Não foram encontradas alterações na configuração do projeto.",
                  });
                }

                try {
                  const { project: prevProject } = route.params;
                  const event: InternalProjectEvent = {
                    type: "edit",
                    timestamp: firebase.firestore.Timestamp.now(),
                    author: author.trim(),
                    changes,
                  };

                  await InternalProjects.edit(prevProject.id, changes);

                  await InternalProjects.pushEvent(prevProject.id, event);

                  msg.show({
                    type: "success",
                    title: "Projeto editado",
                    text: `Projeto ${InternalProjects.formatId(
                      prevProject
                    )} editado com sucesso.`,
                  });
                } catch (e) {
                  console.error(e);
                  msg.show({
                    type: "warning",
                    title: "Erro ao editar projeto",
                    text: "Um erro inesperado ocorreu. Por favor, entre em contato com o administrador do aplicativo para mais informações.",
                  });
                } finally {
                  nav.navigate("internalProjectsHome");
                }
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

  React.useEffect(() => {
    if (route.params.editing && route.params.project) {
      const { project } = route.params;
      nav.setOptions({ title: "Editar" });
      setAuthor(project.events[0]!.author);
      setTitle(project.title);
      setDescription(project.description);
      setTeam(project.team);
      setPriority(project.priority);
      setEta(moment(project.eta.toDate()));
    }
  }, [route]);

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
                label="Autor"
                value={author}
                onChangeText={(val) => setAuthor(val)}
                style={styles.formField}
                autoFocus={!route.params.editing}
                disabled={route.params.editing}
                autoCompleteType="off"
              />
              <TextInput
                mode="outlined"
                label="Título"
                value={title}
                onChangeText={(val) => setTitle(val)}
                style={styles.formField}
                autoCompleteType="off"
              />
              <TextInput
                mode="outlined"
                label="Descrição"
                value={description}
                onChangeText={(val) => setDescription(val)}
                style={styles.formField}
                autoCompleteType="off"
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
                autoCompleteType="off"
              />
              <TextInput
                mode="outlined"
                label="Equipe"
                value={team.others}
                onChangeText={(val) =>
                  setTeam((currTeam) => ({ ...currTeam, others: val }))
                }
                style={styles.formField}
                autoCompleteType="off"
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
                value={priority}
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
                label={eta ? "Alterar data" : "Selecionar data"}
                icon="calendar"
                onPress={() => setOpenSelectEta(true)}
              />
            </View>

            <View>
              <Button
                label={route.params.editing ? "Editar" : "Enviar"}
                icon="check-bold"
                onPress={onSubmit}
                style={styles.sendBtn}
                color="success"
              />
              <Divider />
              <Text style={styles.footer}>
                {route.params.editing
                  ? `Editando projeto: ${InternalProjects.formatId(
                      route.params.project
                    )}`
                  : "Manutenção • Novo projeto"}
              </Text>
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
