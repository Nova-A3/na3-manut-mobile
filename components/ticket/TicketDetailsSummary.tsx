import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Caption, Divider } from "react-native-paper";
import { Ticket } from "../../types";
import { idToName } from "../../utils";

type TicketDetailsSummaryProps = {
  data: Ticket;
};

const TicketDetailsSummary: React.FC<TicketDetailsSummaryProps> = ({
  data: { dpt, machine, team, maintenanceType, cause, interruptions },
}) => {
  return (
    <View style={styles.card}>
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
    paddingHorizontal: 15,
    paddingVertical: 15,
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
});

export default TicketDetailsSummary;
