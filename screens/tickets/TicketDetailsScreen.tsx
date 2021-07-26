import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import * as React from "react";
import { Alert, StyleSheet, View } from "react-native";
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
  HeaderButton,
  TicketDetailsButton,
  TicketDetailsSummary,
} from "../../components";
import Database from "../../db";
import { default as Firebase } from "../../firebase";
import {
  useDepartment,
  useFlashMessage,
  useGlobalLoading,
  useTickets,
} from "../../hooks";
import {
  AllTicketsStackParamList,
  TicketPriority,
  TicketStatus,
} from "../../types";
import { getTicketStatusStyles, translatePriority } from "../../utils";

type TicketDetailsScreenRouteProp = RouteProp<
  AllTicketsStackParamList,
  "ticketDetails"
>;

const TicketDetailsScreen: React.FC = () => {
  const nav = useNavigation();
  const {
    params: { ticket },
  } = useRoute<TicketDetailsScreenRouteProp>();

  const department = useDepartment()!;
  const [_, setGlobalLoading] = useGlobalLoading();
  const { loadTickets } = useTickets();
  const msg = useFlashMessage();

  const [showFormModal, setShowFormModal] = React.useState(false);
  const [ticketPriority, setTicketPriority] =
    React.useState<TicketPriority>("low");
  const [ticketSolution, setTicketSolution] = React.useState("");

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
        setShowFormModal(true);
        break;
      case "accept_solution":
        onAcceptTicketSolution();
    }
  };

  const onAcceptTicketSolution = async () => {
    setGlobalLoading(true);

    const { error } = await Firebase.Firestore.acceptTicketSolution(ticket);

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

      await loadTickets();
      nav.goBack();
    }

    setGlobalLoading(false);
  };

  const onTransmitTicketSolution = async (solution: string) => {
    setGlobalLoading(true);

    const { error } = await Firebase.Firestore.transmitTicketSolution(ticket, {
      solution,
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
        title: "OS solucionada",
        text: `OS nº ${ticket.id} solucionada com sucesso!`,
      });

      setShowFormModal(false);
      await loadTickets();
      nav.goBack();
    }

    setGlobalLoading(false);
  };

  const onConfirmTicket = async (priority: TicketPriority) => {
    setGlobalLoading(true);

    const { error } = await Firebase.Firestore.confirmTicket(ticket, {
      priority,
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
        title: "OS aceita",
        text: `OS nº ${ticket.id} aceita com sucesso!`,
      });

      setShowFormModal(false);
      await loadTickets();
      nav.goBack();
    }

    setGlobalLoading(false);
  };

  React.useLayoutEffect(() => {
    nav.setOptions({
      headerRight: () => (
        <HeaderButton
          title="Enviar"
          icon="document-text-outline"
          onPress={() =>
            Alert.alert(`Solução OS #${ticket.id}`, ticket.solution)
          }
          disabled={!ticket.solution}
        />
      ),
    });
  });

  return (
    <>
      <View>
        <View
          style={{
            ...styles.header,
            backgroundColor: department.isMaintenance()
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
          <Headline style={styles.title}>{ticket.description}</Headline>
        </View>

        <TicketDetailsButton
          departmentType={department.type}
          ticketStatus={ticket.status}
          onPress={onDetailsBtnPress}
        />

        <View style={styles.body}>
          <TicketDetailsSummary data={ticket} />
        </View>
      </View>

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

      {Firebase.Firestore.checkTicketUrgency(ticket, department) ? (
        ticket.status === "pending" ? (
          <FormModal
            title="Definir prioridade"
            show={showFormModal}
            onDismiss={() => setShowFormModal(false)}
            footer={
              <Button
                label="Confirmar OS"
                onPress={() => onConfirmTicket(ticketPriority)}
                icon="arrow-right"
                iconRight
              />
            }
          >
            <Dropdown
              label="Definir prioridade"
              items={[
                { value: "low", label: translatePriority("low") },
                { value: "medium", label: translatePriority("medium") },
                { value: "high", label: translatePriority("high") },
              ]}
              onValueChange={(val) => setTicketPriority(val as TicketPriority)}
            />
          </FormModal>
        ) : ticket.status === "solving" ? (
          <FormModal
            title="Descrição da solução"
            show={showFormModal}
            onDismiss={() => setShowFormModal(false)}
            footer={
              <Button
                label="Transmitir Solução"
                onPress={() => onTransmitTicketSolution(ticketSolution)}
                icon="arrow-right"
                iconRight
              />
            }
          >
            <TextInput
              mode="outlined"
              multiline
              numberOfLines={3}
              label="Descrição da solução"
              value={ticketSolution}
              onChangeText={setTicketSolution}
            />
          </FormModal>
        ) : null
      ) : null}
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
  body: {
    padding: 20,
  },
  interruptionsSection: {
    flexDirection: "row",
    marginTop: 16,
  },
  interruptionsItem: {
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ccc",
    paddingVertical: 12,
  },
  interruptionsText: {
    color: "white",
  },
  interruptionsTextBold: {
    color: "white",
    fontWeight: "bold",
  },
  statusContainer: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "white",
    width: "100%",
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

const currStage = (status: TicketStatus) => {
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
