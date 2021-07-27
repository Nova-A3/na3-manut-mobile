import { FontAwesome } from "@expo/vector-icons";
import * as React from "react";
import { StyleSheet, View } from "react-native";
import { Caption } from "react-native-paper";
import { Ticket } from "../../types";
import { getTicketStatusStyles } from "../../utils";

type TicketCardStatusProps = {
  status: Ticket["status"];
};

const TicketCardStatus: React.FC<TicketCardStatusProps> = ({ status }) => {
  const { text, bgColor } = getTicketStatusStyles(status);

  return (
    <View style={styles.container}>
      <FontAwesome name="circle" size={18} color={bgColor} />
      <Caption style={styles.text}>{text}</Caption>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    marginLeft: 6,
  },
});

export default TicketCardStatus;
