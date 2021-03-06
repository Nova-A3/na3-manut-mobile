import { FontAwesome } from "@expo/vector-icons";
import * as React from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Subheading, Text } from "react-native-paper";
import { Divider } from "react-navigation-header-buttons";
import { COLORS } from "../../constants";
import Db from "../../db";
import { useDepartment } from "../../hooks";
import { Ticket } from "../../types";
import {
  formatDeviceInfo,
  formatTimestamp,
  idToName,
  translateEventType,
  translatePriority,
  translateTicketKey,
} from "../../utils";
import IoniconsIconButton from "../ui/IoniconsIconButton";

type TicketTimelineItemProps = {
  data: Ticket["events"][0];
};

const TicketTimelineItem: React.FC<TicketTimelineItemProps> = ({
  data: { type, timestamp, device, payload },
}) => {
  const dpt = useDepartment()!;

  const payloadAlert = () => {
    if (payload) {
      if (type === "ticketConfirmed") {
        return {
          title: "OS confirmada",
          message: `Prioridade: ${translatePriority(payload.priority)}${
            payload.assignedMaintainer
              ? `\nManutentor: ${payload.assignedMaintainer}`
              : ""
          }`,
        };
      }

      switch (Object.keys(payload)[0]) {
        case "priority":
          return {
            title: "Nova prioridade",
            message: translatePriority(payload.priority),
          };
        case "solutionStep":
          return {
            title: "Progresso da solução",
            message: `${payload.solutionStep?.content}${
              payload.solutionStep?.who ? ` (${payload.solutionStep.who})` : ""
            }`,
          };
        case "solution":
          return {
            title: "Solução transmitida",
            message:
              typeof payload.solution === "string"
                ? payload.solution
                : `${payload.solution?.content}${
                    payload.solution?.who ? ` (${payload.solution.who})` : ""
                  }`,
          };
        case "refusalReason":
          return {
            title: "Motivo da recusa",
            message: payload.refusalReason,
          };
        case "changes":
          return {
            title: "Alterações na OS",
            message: Object.entries(payload.changes!)
              .map(([key, val]) => {
                if (key === "interruptions") {
                  return Object.entries(payload.changes!.interruptions!)
                    .map(
                      ([key, val]) =>
                        `${translateTicketKey(key)}: ${
                          val.old === true ? "SIM" : "NÃO"
                        } -> ${val.new === true ? "SIM" : "NÃO"}`
                    )
                    .join("\n");
                }
                if (dpt.username === "ekoplasto" && key === "machine") {
                  return `${translateTicketKey(key)}: ${
                    // @ts-ignore
                    dpt.getMachineNames()[+val.old - 1]
                    // @ts-ignore
                  } -> ${dpt.getMachineNames()[+val.new - 1]}`;
                }
                return `${translateTicketKey(key)}: ${idToName(
                  // @ts-ignore
                  val.old
                  // @ts-ignore
                )} -> ${idToName(val.new)}`;
              })
              .join("\n"),
          };
        case "poke":
          return {
            title: "Cutucada",
            message: `${Db.getDepartment(payload.poke!.from)!.displayName} -> ${
              Db.getDepartment(payload.poke!.to)!.displayName
            }`,
          };
        case "assignedMaintainer":
          return {
            title: "Novo responsável",
            message: payload.assignedMaintainer,
          };
        default:
          return;
      }
    }
    return;
  };

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <View>
          <View style={styles.titleContainer}>
            <View style={styles.circle}>
              <FontAwesome
                name="circle"
                size={22}
                color={
                  type === "ticketCreated"
                    ? COLORS.SYSTEM.BLUE
                    : type === "ticketClosed"
                    ? COLORS.SYSTEM.GREEN
                    : type === "solutionRefused"
                    ? COLORS.SYSTEM.RED
                    : type === "solutionStepAdded"
                    ? COLORS.SYSTEM.CYAN
                    : COLORS.SYSTEM.GRAY
                }
              />
            </View>
            <Subheading style={styles.title}>
              {translateEventType(type)}
            </Subheading>
          </View>

          <Text style={styles.timestamp}>
            {formatTimestamp(timestamp, "DD/MM/YY HH:mm:ss")}
          </Text>
        </View>

        <View style={styles.btnRow}>
          {payloadAlert() && (
            <IoniconsIconButton
              icon="document-text-outline"
              onPress={() =>
                Alert.alert(payloadAlert()!.title, payloadAlert()!.message!)
              }
              style={{ marginRight: 0 }}
            />
          )}

          <IoniconsIconButton
            icon="phone-portrait-outline"
            onPress={() =>
              Alert.alert("Dispositivo de origem", formatDeviceInfo(device))
            }
            style={{ marginRight: 0 }}
          />
        </View>
      </View>

      <Divider style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 15,
  },
  body: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
  },
  circle: {
    width: 30,
  },
  timestamp: {
    fontStyle: "italic",
    marginLeft: 30,
  },
  btnRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  divider: {
    backgroundColor: "#bbb",
    marginLeft: 30,
    marginTop: 10,
  },
});

export default TicketTimelineItem;
