import { FontAwesome } from "@expo/vector-icons";
import * as React from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Subheading, Text } from "react-native-paper";
import { Divider } from "react-navigation-header-buttons";
import { COLORS } from "../../constants";
import { Ticket } from "../../types";
import {
  formatDeviceInfo,
  formatTimestamp,
  translateEventType,
  translatePriority,
} from "../../utils";
import IoniconsIconButton from "../ui/IoniconsIconButton";

type TicketTimelineItemProps = {
  data: Ticket["events"][0];
};

const TicketTimelineItem: React.FC<TicketTimelineItemProps> = ({
  data: { type, timestamp, device, payload },
}) => {
  let payloadAlert: { title: string; message: string } | undefined = undefined;

  if (payload) {
    if (payload.priority) {
      payloadAlert = {
        title: "Prioridade definida",
        message: translatePriority(payload.priority),
      };
    } else if (payload.solution) {
      payloadAlert = {
        title: "Solução transmitida",
        message: payload.solution,
      };
    } else if (payload.refusalReason) {
      payloadAlert = {
        title: "Motivo da recusa",
        message: payload.refusalReason,
      };
    }
  }

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
                  type === "ticketClosed"
                    ? COLORS.SYSTEM.GREEN
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
          {payloadAlert && (
            <IoniconsIconButton
              icon="document-text-outline"
              onPress={() =>
                Alert.alert(payloadAlert!.title, payloadAlert!.message)
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
