import { FontAwesome } from "@expo/vector-icons";
import * as React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Caption, Divider } from "react-native-paper";
import { COLORS } from "../../constants";
import { Ticket } from "../../types";
import { idToName, translatePriority } from "../../utils";

type TicketDetailsSummaryProps = {
  data: Ticket;
};

const TicketDetailsSummary: React.FC<TicketDetailsSummaryProps> = ({
  data: { dpt, machine, team, maintenanceType, cause, interruptions, priority },
}) => {
  return (
    <View style={styles.card}>
      {priority && (
        <>
          <View style={styles.summaryItem}>
            <Caption style={styles.itemKey}>Prioridade: </Caption>
            <View style={styles.priority}>
              <View style={styles.priorityIcon}>
                <FontAwesome
                  name="circle"
                  size={16}
                  color={
                    {
                      low: COLORS.TICKET_STATUS.REFUSED,
                      medium: COLORS.TICKET_STATUS.PENDING,
                      high: COLORS.TICKET_STATUS.CLOSED,
                    }[priority]
                  }
                />
              </View>
              <Text style={styles.priorityText}>
                {translatePriority(priority)}
              </Text>
            </View>
          </View>

          <Divider style={styles.divider} />
        </>
      )}

      <View style={styles.summaryItem}>
        <Caption style={styles.itemKey}>Setor: </Caption>
        <Text>{dpt}</Text>
      </View>
      <View style={[styles.summaryItem, styles.middleItem]}>
        <Caption style={styles.itemKey}>Máquina: </Caption>
        <Text>{machine}</Text>
      </View>

      <Divider style={styles.divider} />

      <View style={styles.summaryItem}>
        <Caption style={styles.itemKey}>Equipe responsável: </Caption>
        <Text>{idToName(team)}</Text>
      </View>
      <View style={[styles.summaryItem, styles.middleItem]}>
        <Caption style={styles.itemKey}>Tipo de manutenção: </Caption>
        <Text>{idToName(maintenanceType)}</Text>
      </View>
      <View style={styles.summaryItem}>
        <Caption style={styles.itemKey}>Tipo de causa: </Caption>
        <Text>{idToName(cause)}</Text>
      </View>

      <Divider style={styles.divider} />

      <View style={styles.summaryItem}>
        <Caption style={styles.itemKey}>Parou linha: </Caption>
        <Text>{interruptions.line ? "SIM" : "NÃO"}</Text>
      </View>
      <View style={[styles.summaryItem, styles.middleItem]}>
        <Caption style={styles.itemKey}>Parou máquina: </Caption>
        <Text>{interruptions.equipment ? "SIM" : "NÃO"}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "white",
  },
  summaryItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemKey: {
    width: "45%",
    fontWeight: "bold",
  },
  middleItem: {
    marginVertical: 4,
  },
  divider: {
    marginVertical: 10,
    backgroundColor: "#333",
  },
  priority: {
    flexDirection: "row",
    alignItems: "center",
  },
  priorityIcon: {
    marginRight: 5,
  },
  priorityText: {
    paddingTop: Platform.OS === "ios" ? 2 : 0,
  },
});

export default TicketDetailsSummary;
