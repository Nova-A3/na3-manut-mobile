import { FontAwesome } from "@expo/vector-icons";
import * as React from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Subheading, Text } from "react-native-paper";
import { Divider } from "react-navigation-header-buttons";
import { COLORS } from "../../constants";
import Db from "../../db";
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
  const payloadAlert = () => {
    if (payload) {
      switch (Object.keys(payload)[0]) {
        case "priority":
          return {
            title:
              type === "ticketConfirmed"
                ? "Prioridade definida"
                : "Nova prioridade",
            message: translatePriority(payload.priority),
          };
        case "solutionStep":
          return {
            title: "Progresso da solução",
            message: payload.solutionStep?.content,
          };
        case "solution":
          return {
            title: "Solução transmitida",
            message: payload.solution,
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
