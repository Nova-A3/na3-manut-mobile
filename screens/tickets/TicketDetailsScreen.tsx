import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import moment from "moment-timezone";
import * as React from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import {
  Badge,
  Headline,
  Subheading,
  Text,
  TextInput,
} from "react-native-paper";
import {
  Button,
  Dropdown,
  FormModal,
  HeaderOverflowMenu,
  TicketDetailsButton,
  TicketDetailsSummary,
} from "../../components";
import Database, { Db } from "../../db";
import { default as Firebase } from "../../firebase";
import {
  useDepartment,
  useFlashMessage,
  useGlobalLoading,
  useTickets,
} from "../../hooks";
import { AllTicketsStackParamList, Ticket } from "../../types";
import {
  ColorType,
  getTicketStatusStyles,
  translatePriority,
} from "../../utils";

type TicketDetailsScreenRouteProp = RouteProp<
  AllTicketsStackParamList,
  "ticketDetails"
>;

const TicketDetailsScreen: React.FC = () => {
  const nav = useNavigation();
  const {
    params: {
      ticket: { id: ticketId },
    },
  } = useRoute<TicketDetailsScreenRouteProp>();
  const { tickets } = useTickets((t) => t.id === ticketId);
  const ticket = tickets[0]!;

  const department = useDepartment()!;
  const { execGlobalLoading } = useGlobalLoading();
  const msg = useFlashMessage();

  const [formModalId, setFormModalId] = React.useState<Exclude<
    Parameters<React.ComponentProps<typeof TicketDetailsButton>["onPress"]>[0],
    "accept_solution"
  > | null>(null);
  const [ticketPriority, setTicketPriority] =
    React.useState<Exclude<Ticket["priority"], undefined | null>>("low");
  const [assignedMaintainer, setAssignedMaintainer] = React.useState(
    ticket.assignedMaintainer || ""
  );
  const [ticketSolutionStatus, setTicketSolutionStatus] = React.useState("");
  const [ticketSolution, setTicketSolution] = React.useState("");
  const [refusalReason, setRefusalReason] = React.useState("");

  const statusStyles = getTicketStatusStyles(ticket.status);

  const onDetailsBtnPress = (
    btnId: Parameters<
      React.ComponentProps<typeof TicketDetailsButton>["onPress"]
    >[0]
  ) => {
    switch (btnId) {
      case "confirm_ticket":
      case "send_solution":
      case "decline_solution":
      case "share_status":
        setFormModalId(btnId);
        break;
      case "accept_solution":
        onAcceptTicketSolution();
    }
  };

  const onConfirmTicket = async (
    priority: Exclude<Ticket["priority"], undefined | null>,
    assignedMaintainer: string
  ) => {
    if (assignedMaintainer.trim().length !== 0) {
      setFormModalId(null);
    }

    await execGlobalLoading(async () => {
      const { error } = await Firebase.Firestore.confirmTicket(ticket, {
        priority,
        assignedMaintainer,
      });

      if (error) {
        msg.show({
          type: "warning",
          title: error.title,
          text: error.description,
        });
        setFormModalId("confirm_ticket");
      } else {
        msg.show({
          type: "success",
          title: "OS aceita",
          text: `OS nº ${ticket.id} aceita com sucesso!`,
        });

        nav.goBack();
      }
    });
  };

  const onShareTicketSolutionStatus = async (
    solutionStatus: string,
    assignedMaintainer: string
  ) => {
    if (
      assignedMaintainer.trim().length !== 0 &&
      solutionStatus.trim().length
    ) {
      setFormModalId(null);
    }

    await execGlobalLoading(async () => {
      const { error } = await Firebase.Firestore.shareTicketSolutionStatus(
        ticket,
        { solutionStatus, assignedMaintainer }
      );

      if (error) {
        msg.show({
          type: "warning",
          title: error.title,
          text: error.description,
        });
        setFormModalId("share_status");
      } else {
        msg.show({
          type: "success",
          title: "Status compartilhado",
          text: `OS nº ${ticket.id} – Status da solução compartilhado com sucesso!`,
        });

        nav.goBack();
      }
    });
  };

  const onTransmitTicketSolution = async (
    solution: string,
    assignedMaintainer: string
  ) => {
    if (assignedMaintainer.trim().length !== 0 && solution.trim().length) {
      setFormModalId(null);
    }

    await execGlobalLoading(async () => {
      const { error } = await Firebase.Firestore.transmitTicketSolution(
        ticket,
        { solution, assignedMaintainer }
      );

      if (error) {
        msg.show({
          type: "warning",
          title: error.title,
          text: error.description,
        });
        setFormModalId("send_solution");
      } else {
        msg.show({
          type: "success",
          title: "OS solucionada",
          text: `OS nº ${ticket.id} solucionada com sucesso!`,
        });

        nav.goBack();
      }
    });
  };

  const onAcceptTicketSolution = () => {
    setFormModalId(null);

    Alert.alert("Encerrar OS?", "Esta ação não pode ser desfeita.", [
      {
        style: "default",
        text: "Encerrar OS",
        onPress: () =>
          execGlobalLoading(async () => {
            const { error } = await Firebase.Firestore.acceptTicketSolution(
              ticket
            );

            if (error) {
              msg.show({
                type: "warning",
                title: error.title,
                text: error.description,
              });
            } else {
              msg.show({
                type: "success",
                title: "OS encerrada",
                text: `OS nº ${ticket.id} encerrada com sucesso!`,
              });

              nav.goBack();
            }
          }),
      },
      { style: "cancel", text: "Cancelar" },
    ]);
  };

  const onRefuseTicketSolution = async (
    reason: Exclude<Ticket["refusalReason"], undefined | null>
  ) => {
    setFormModalId(null);

    await execGlobalLoading(async () => {
      const { error } = await Firebase.Firestore.refuseTicketSolution(ticket, {
        refusalReason: reason,
      });

      if (error) {
        msg.show({
          type: "warning",
          title: error.title,
          text: error.description,
        });
        setFormModalId("decline_solution");
      } else {
        msg.show({
          type: "success",
          title: "Solução recusada",
          text: `Solução recusada – a Manutenção revisará a OS nº ${ticket.id}.`,
        });

        nav.goBack();
      }
    });
  };

  const onPoke = () => {
    execGlobalLoading(async () => {
      const pokeTarget = (
        ["pending", "solving"].includes(ticket.status)
          ? Db.getDepartment("manutencao")
          : Db.getDepartment(ticket.username)
      )!;

      const { error } = await Firebase.Firestore.pokeDepartment({
        from: department,
        to: pokeTarget,
        ticket,
      });

      if (error) {
        msg.show({
          type: "warning",
          title: error.title,
          text: error.description,
        });
      } else {
        msg.show({
          type: "success",
          title: "Setor notificado",
          text: `Você cutucou o setor "${pokeTarget.displayName}".`,
        });
      }
    });
  };

  const checkPokeAvailability = (): boolean => {
    if (
      moment().diff(
        moment(ticket.events[ticket.events.length - 1]!.timestamp),
        "days"
      ) < 1
    ) {
      return false;
    }

    switch (department.type) {
      case "viewOnly":
        return ticket.status !== "closed";
      case "maintenance":
        return ticket.status === "solved";
      case "operator":
        return ["pending", "solving"].includes(ticket.status);
    }
  };

  React.useLayoutEffect(() => {
    nav.setOptions({
      headerRight: () => (
        <HeaderOverflowMenu
          buttons={
            ticket.status === "closed"
              ? undefined
              : [
                  {
                    title: "Cutucar",
                    iconName: "alert-circle-outline",
                    onPress: onPoke,
                    disabled: !checkPokeAvailability(),
                  },
                ]
          }
          items={[
            {
              title: "Histórico",
              onPress: () => {
                nav.navigate("ticketTimeline", { ticket });
              },
            },
            {
              title: "Estatísticas",
              onPress: () => nav.navigate("ticketStats", { ticket }),
            },
            {
              title: "Ver solução",
              onPress: () => {
                Alert.alert(
                  `Solução OS #${ticket.id}`,
                  ticket.solution
                    ? ticket.solution
                    : "Nenhuma solução disponível"
                );
              },
            },
            {
              title: "Editar OS",
              onPress: () => nav.navigate("ticketEdit", { ticket }),
              disabled:
                department.type !== "operator" || ticket.status === "closed",
            },
          ]}
        />
      ),
    });
  });

  let formModal: {
    title: string;
    children: React.ReactNode;
    footerBtn: { label: string; onPress: () => void; color?: ColorType };
  } | null = null;
  switch (formModalId) {
    case "confirm_ticket":
      formModal = {
        title: "Confirmar OS",
        children: (
          <>
            <View style={{ marginBottom: 7 }}>
              <Dropdown
                label="Prioridade"
                items={[
                  { value: "low", label: translatePriority("low") },
                  { value: "medium", label: translatePriority("medium") },
                  { value: "high", label: translatePriority("high") },
                ]}
                onValueChange={(val) =>
                  setTicketPriority(
                    val as Exclude<Ticket["priority"], undefined | null>
                  )
                }
              />
            </View>
            <TextInput
              mode="outlined"
              multiline
              numberOfLines={2}
              label="Manutentor(es)"
              value={assignedMaintainer}
              onChangeText={(val) => setAssignedMaintainer(val)}
            />
          </>
        ),
        footerBtn: {
          label: "Confirmar OS",
          onPress: () => onConfirmTicket(ticketPriority, assignedMaintainer),
        },
      };
      break;
    case "share_status":
      formModal = {
        title: "Informar status",
        children: (
          <>
            <View style={{ marginBottom: 7 }}>
              <TextInput
                mode="outlined"
                multiline
                numberOfLines={3}
                label="Status da solução"
                value={ticketSolutionStatus}
                onChangeText={(val) => setTicketSolutionStatus(val)}
              />
            </View>
            <TextInput
              mode="outlined"
              multiline
              numberOfLines={2}
              label="Responsável"
              value={assignedMaintainer}
              onChangeText={(val) => setAssignedMaintainer(val)}
            />
          </>
        ),
        footerBtn: {
          label: "Enviar status",
          onPress: () =>
            onShareTicketSolutionStatus(
              ticketSolutionStatus,
              assignedMaintainer
            ),
        },
      };
      break;
    case "send_solution":
      formModal = {
        title: "Descrição da solução",
        children: (
          <>
            <View style={{ marginBottom: 7 }}>
              <TextInput
                mode="outlined"
                multiline
                numberOfLines={3}
                label="Descrição da solução"
                value={ticketSolution}
                onChangeText={(val) => setTicketSolution(val)}
              />
            </View>
            <TextInput
              mode="outlined"
              multiline
              numberOfLines={2}
              label="Responsável"
              value={assignedMaintainer}
              onChangeText={(val) => setAssignedMaintainer(val)}
            />
          </>
        ),
        footerBtn: {
          label: "Transmitir Solução",
          onPress: () =>
            onTransmitTicketSolution(ticketSolution, assignedMaintainer),
        },
      };
      break;
    case "decline_solution":
      formModal = {
        title: "Motivo da recusa",
        children: (
          <TextInput
            mode="outlined"
            multiline
            numberOfLines={3}
            label="Motivo"
            value={refusalReason}
            onChangeText={(val) => setRefusalReason(val)}
          />
        ),
        footerBtn: {
          label: "Recusar Solução",
          onPress: () => onRefuseTicketSolution(refusalReason),
          color: "danger",
        },
      };
      break;
  }

  return (
    <>
      <View style={{ height: "100%" }}>
        <View
          style={{
            ...styles.header,
            backgroundColor:
              department.isMaintenance() || department.isViewOnly()
                ? Database.getDepartment(ticket.username)!.color
                : department.color,
          }}
        >
          <Badge
            style={[
              styles.statusBadge,
              {
                backgroundColor: statusStyles.bgColor,
                color: statusStyles.color,
              },
            ]}
          >
            {statusStyles.text}
          </Badge>
          <Headline
            style={[
              styles.title,
              ticket.username === "off-set" ? { color: "#333" } : undefined,
            ]}
          >
            {ticket.description}
          </Headline>
        </View>

        <View
          style={{
            flexGrow: 1,
            justifyContent: "space-between",
          }}
        >
          {!department.isViewOnly() && (
            <TicketDetailsButton
              departmentType={department.type}
              ticketStatus={ticket.status}
              onPress={onDetailsBtnPress}
            />
          )}
          <ScrollView style={styles.content}>
            <TicketDetailsSummary data={ticket} />
          </ScrollView>

          <View style={styles.statusContainer}>
            <View style={styles.currStage}>
              <Text>Estágio atual:</Text>
              <Subheading style={styles.currStageText}>
                {currStage(ticket.status)}
              </Subheading>
            </View>
            <View style={styles.stepsContainer}>
              <View
                style={[styles.step, styles.stepRightRounded, styles.stepDone]}
              />
              <View
                style={[
                  styles.step,
                  styles.stepLeftRounded,
                  styles.stepRightRounded,
                  ticket.status === "pending"
                    ? styles.stepCurrent
                    : styles.stepDone,
                ]}
              />
              <View
                style={[
                  styles.step,
                  styles.stepLeftRounded,
                  styles.stepRightRounded,
                  ticket.status === "solving"
                    ? styles.stepCurrent
                    : ["solved", "closed"].includes(ticket.status)
                    ? styles.stepDone
                    : null,
                ]}
              />
              <View
                style={[
                  styles.step,
                  styles.stepLeftRounded,
                  ticket.status === "solved"
                    ? styles.stepCurrent
                    : ticket.status === "closed"
                    ? styles.stepDone
                    : null,
                ]}
              />
            </View>
          </View>
        </View>
      </View>

      {formModal && (
        <FormModal
          title={formModal.title}
          show={!!formModalId}
          onDismiss={() => setFormModalId(null)}
          footer={
            <Button {...formModal.footerBtn} icon="arrow-right" iconRight />
          }
        >
          {formModal.children}
        </FormModal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    justifyContent: "flex-end",
    padding: 20,
    paddingTop: 60,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  title: {
    color: "white",
    lineHeight: 26,
  },
  content: {
    flexGrow: 1,
    padding: 20,
  },
  statusContainer: {
    backgroundColor: "white",
  },
  currStage: {
    padding: 20,
  },
  currStageText: {
    fontWeight: "bold",
  },
  stepsContainer: {
    height: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  step: {
    width: "24.25%",
  },
  stepDone: {
    backgroundColor: "#51E898",
  },
  stepCurrent: {
    backgroundColor: "#60BE4E",
  },
  stepLeftRounded: {
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
  },
  stepRightRounded: {
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
});

const currStage = (status: Ticket["status"]) => {
  switch (status) {
    case "pending":
      return "AGUARDANDO MANUTENÇÃO";
    case "solving":
      return "AGUARDANDO SOLUÇÃO";
    case "solved":
      return "AGUARDANDO ACEITE DA SOLUÇÃO";
    case "closed":
      return "OS ENCERRADA";
    case "refused":
      return "OS RECUSADA";
  }
};

export default TicketDetailsScreen;
