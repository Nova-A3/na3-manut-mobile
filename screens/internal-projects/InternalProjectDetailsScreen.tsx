import { FontAwesome, Ionicons } from "@expo/vector-icons";
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import firebase from "firebase";
import moment from "moment";
import * as React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Divider,
  Headline,
  Subheading,
  Text,
  TextInput,
} from "react-native-paper";
import { InternalProjects } from "../../classes";
import {
  Button,
  FormModal,
  HeaderOverflowMenu,
  ProjectDetailsTimeRemaining,
} from "../../components";
import { useDepartment, useFlashMessage, useGlobalLoading } from "../../hooks";
import { InternalProject, InternalProjectsStackParamList } from "../../types";
import { translatePriority } from "../../utils";

const InternalProjectDetailsScreen: React.FC = () => {
  const department = useDepartment()!;
  const {
    params: { project },
  } =
    useRoute<
      RouteProp<InternalProjectsStackParamList, "internalProjectDetails">
    >();
  const nav =
    useNavigation<
      NavigationProp<InternalProjectsStackParamList, "internalProjectDetails">
    >();

  const [status, setStatus] = React.useState("");
  const [deliverMessage, setDeliverMessage] = React.useState("");
  const [author, setAuthor] = React.useState(project.team.manager);
  const [showStatusModal, setShowStatusModal] = React.useState(false);
  const [showDeliverModal, setShowDeliverModal] = React.useState(false);

  const { execGlobalLoading } = useGlobalLoading();
  const msg = useFlashMessage();

  const [statusBg, statusFg] = React.useMemo(
    () => InternalProjects.statusColor(project),
    [project]
  );

  const onNavigateToTimeline = React.useCallback(() => {
    nav.navigate("internalProjectTimeline", { project });
  }, [nav]);

  const onShareProjectStatus = React.useCallback(() => {
    if (status.trim().length === 0) {
      msg.show({
        type: "warning",
        title: "Campo requerido",
        text: 'O campo "Status do projeto" é obrigatório.',
      });
      return;
    }
    if (author.trim().length === 0) {
      msg.show({
        type: "warning",
        title: "Campo requerido",
        text: 'O campo "Autor" é obrigatório.',
      });
      return;
    }

    setShowStatusModal(false);

    execGlobalLoading(async () => {
      try {
        const event: InternalProject["events"][number] = {
          type: "status",
          timestamp: firebase.firestore.Timestamp.now(),
          author: author.trim(),
          message: status.trim(),
        };

        await InternalProjects.pushEvent(project.id, event);

        msg.show({
          type: "success",
          title: "Status compartilhado",
          text: `Novo status do projeto ${InternalProjects.formatId(
            project
          )} compartilhado com sucesso.`,
        });
      } catch (e) {
        msg.show({
          type: "warning",
          title: "Erro ao compartilhar status",
          text: "Um erro inesperado ocorreu. Por favor, entre em contato com o administrador do aplicativo para mais informações.",
        });
      } finally {
        nav.navigate("internalProjectsHome");
      }
    });
  }, [status, author, msg, nav]);

  const onDeliverProject = React.useCallback(() => {
    if (author.trim().length === 0) {
      msg.show({
        type: "warning",
        title: "Campo requerido",
        text: 'O campo "Autor" é obrigatório.',
      });
      return;
    }

    setShowDeliverModal(false);

    execGlobalLoading(async () => {
      try {
        const event: InternalProject["events"][number] = {
          type: "complete",
          timestamp: firebase.firestore.Timestamp.now(),
          author: author.trim(),
          message: deliverMessage.trim(),
        };

        await InternalProjects.pushEvent(project.id, event);

        msg.show({
          type: "success",
          title: "Projeto entregue",
          text: `Projeto ${InternalProjects.formatId(
            project
          )} entregue com sucesso.`,
        });
      } catch (e) {
        msg.show({
          type: "warning",
          title: "Erro ao entregar projeto",
          text: "Um erro inesperado ocorreu. Por favor, entre em contato com o administrador do aplicativo para mais informações.",
        });
      } finally {
        nav.navigate("internalProjectsHome");
      }
    });
  }, [author, deliverMessage, msg, nav]);

  React.useLayoutEffect(() => {
    nav.setOptions({
      headerRight: () => (
        <HeaderOverflowMenu
          items={[
            {
              title: "Histórico",
              onPress: onNavigateToTimeline,
            },
            {
              title: "Editar projeto",
              onPress: () => {
                nav.navigate("internalProjectsNewForm", {
                  editing: true,
                  project,
                });
              },
              disabled:
                !department.isMaintenance() ||
                InternalProjects.projectStatus(project) === "finished",
            },
          ]}
        />
      ),
    });
  }, [nav, department, project]);

  return (
    <>
      <View style={styles.screen}>
        <View style={{ ...styles.header, backgroundColor: statusBg }}>
          <Headline style={{ ...styles.title, color: statusFg }}>
            {project.title}
          </Headline>
          <Subheading style={{ ...styles.description, color: statusFg }}>
            {project.description}
          </Subheading>
        </View>

        <View style={styles.body}>
          <ScrollView style={styles.content}>
            <View style={styles.infoContainer}>
              <View style={styles.infoIcon}>
                <Ionicons
                  name={InternalProjects.statusSelect(project, {
                    late: "time",
                    finished: "time",
                    running: "time-outline",
                  })}
                  size={18}
                  color={InternalProjects.statusSelect(project, {
                    late: InternalProjects.COLORS.STATUS.LATE,
                    finished: InternalProjects.COLORS.STATUS.FINISHED,
                    running: "#333",
                  })}
                />
              </View>
              <ProjectDetailsTimeRemaining
                eta={moment(project.eta.toDate())}
                styles={{
                  default: styles.infoValue,
                  onTime: styles.timeRemainingOnTime,
                  late: styles.timeRemainingLate,
                  finished: styles.timeRemainingFinished,
                }}
                text={{
                  late: "ENTREGA EM ATRASO",
                  onTime: (remainingMs) =>
                    `Entrega em: ${InternalProjects.humanizedDurationMs(
                      remainingMs
                    )}`,
                  finished: "PROJETO ENTREGUE",
                }}
                projectIsFinished={
                  InternalProjects.projectStatus(project) === "finished"
                }
              />
            </View>

            <Divider style={styles.divider} />

            <View style={styles.infoContainer}>
              <View style={styles.infoIcon}>
                <FontAwesome
                  name="circle"
                  size={18}
                  color={
                    {
                      low: InternalProjects.COLORS.STATUS.LATE,
                      medium: InternalProjects.COLORS.STATUS.RUNNING,
                      high: InternalProjects.COLORS.STATUS.FINISHED,
                    }[project.priority]
                  }
                />
              </View>
              <Subheading style={styles.infoValue}>
                Prioridade:{" "}
                <Text style={styles.infoValueBold}>
                  {translatePriority(project.priority)}
                </Text>
              </Subheading>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.infoContainer}>
              <View style={styles.infoIcon}>
                <Ionicons name="people-circle-outline" size={18} color="#333" />
              </View>
              <Subheading style={[styles.infoValue, styles.infoValueBold]}>
                Equipe
              </Subheading>
            </View>
            <View style={styles.infoContainer}>
              <View style={styles.infoIcon} />
              <Subheading style={styles.infoValue}>
                • Responsável: {project.team.manager}
              </Subheading>
            </View>
            <View style={styles.infoContainer}>
              <View style={styles.infoIcon} />
              <Subheading style={styles.infoValue}>
                • Manutentor(es): {project.team.others}
              </Subheading>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.infoContainer}>
              <View style={styles.infoIcon}>
                <Ionicons name="git-merge-outline" size={18} color="#333" />
              </View>
              <Subheading style={[styles.infoValue, styles.infoValueBold]}>
                Último evento
              </Subheading>
            </View>
            <View style={styles.infoContainer}>
              <View style={styles.infoIcon} />
              <Subheading style={styles.infoValue}>
                {InternalProjects.translateEvent(
                  project.events[project.events.length - 1]!
                )}
                {project.events[project.events.length - 1]!.type !== "edit" && (
                  <>
                    {" "}
                    <Text style={[styles.infoValue, { fontStyle: "italic" }]}>
                      (por {project.events[project.events.length - 1]!.author})
                    </Text>
                  </>
                )}
              </Subheading>
            </View>
            <View style={styles.infoContainer}>
              <View style={styles.infoIcon} />
              <View style={styles.lastEventTimestampContainer}>
                <Ionicons name="calendar-outline" size={18} color="#999" />
                <Subheading
                  style={[styles.infoValue, styles.lastEventTimestamp]}
                >
                  {moment(
                    project.events[
                      project.events.length - 1
                    ]!.timestamp.toDate()
                  ).format("DD/MM HH:mm")}
                </Subheading>
              </View>
            </View>
          </ScrollView>

          {department.isMaintenance() &&
            InternalProjects.projectStatus(project) !== "finished" && (
              <View style={styles.btnsContainer}>
                <Button
                  label="Informar Status"
                  icon="check"
                  onPress={() => setShowStatusModal(true)}
                  style={styles.firstBtn}
                />
                <Button
                  label="Entregar Projeto"
                  icon="check-all"
                  onPress={() => setShowDeliverModal(true)}
                  color="success"
                />
              </View>
            )}
        </View>
      </View>

      <FormModal
        title="Informar status"
        show={showStatusModal}
        onDismiss={() => setShowStatusModal(false)}
        footer={
          <Button
            label="Informar status"
            onPress={onShareProjectStatus}
            icon="arrow-right"
            iconRight
          />
        }
      >
        <View style={{ marginBottom: 7 }}>
          <TextInput
            mode="outlined"
            multiline
            numberOfLines={3}
            label="Status do projeto"
            defaultValue={status}
            onChangeText={(val) => setStatus(val)}
            autoCompleteType="off"
            autoFocus
          />
        </View>
        <TextInput
          mode="outlined"
          multiline
          numberOfLines={2}
          label="Autor"
          defaultValue={author}
          onChangeText={(val) => setAuthor(val)}
          autoCompleteType="off"
        />
      </FormModal>

      <FormModal
        title="Entregar projeto"
        show={showDeliverModal}
        onDismiss={() => setShowDeliverModal(false)}
        footer={
          <Button
            label="Entregar projeto"
            onPress={onDeliverProject}
            color="success"
            icon="arrow-right"
            iconRight
          />
        }
      >
        <View style={{ marginBottom: 7 }}>
          <TextInput
            mode="outlined"
            multiline
            numberOfLines={3}
            label="Comentários (opcional)"
            defaultValue={deliverMessage}
            onChangeText={(val) => setDeliverMessage(val)}
            autoCompleteType="off"
            autoFocus
          />
        </View>
        <TextInput
          mode="outlined"
          multiline
          numberOfLines={2}
          label="Autor"
          defaultValue={author}
          onChangeText={(val) => setAuthor(val)}
          autoCompleteType="off"
        />
      </FormModal>
    </>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    justifyContent: "flex-end",
    padding: 20,
    paddingTop: 60,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  title: {
    lineHeight: 26,
  },
  description: {
    fontStyle: "italic",
    lineHeight: 20,
    marginTop: 3,
  },
  body: {
    flex: 1,
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
    paddingRight: 20,
  },
  infoIcon: {
    width: 18,
    alignItems: "center",
  },
  infoValue: {
    margin: 0,
    marginLeft: 8,
    alignItems: "center",
  },
  infoValueBold: {
    fontWeight: "600",
  },
  timeRemainingOnTime: {
    color: "#333",
    fontStyle: "italic",
  },
  timeRemainingLate: {
    color: InternalProjects.COLORS.STATUS.LATE,
    fontWeight: "bold",
  },
  timeRemainingFinished: {
    color: InternalProjects.COLORS.STATUS.FINISHED,
    fontWeight: "bold",
  },
  lastEventTimestampContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 20,
  },
  lastEventTimestamp: {
    fontStyle: "italic",
    color: "#999",
    fontSize: 14,
    marginLeft: 6,
  },
  btnsContainer: {
    backgroundColor: "white",
    padding: 20,
  },
  firstBtn: {
    marginBottom: 14,
  },
  divider: {
    marginVertical: 12,
    backgroundColor: "#333",
  },
});

export default InternalProjectDetailsScreen;
