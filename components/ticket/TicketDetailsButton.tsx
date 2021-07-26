import * as React from "react";
import { StyleSheet } from "react-native";
import { Department, Ticket } from "../../types";
import Button from "../ui/Button";

type TicketDetailsButtonProps = {
  departmentType: Department["type"];
  ticketStatus: Ticket["status"];
  onPress: (
    btnId:
      | "confirm_ticket"
      | "send_solution"
      | "accept_solution"
      | "decline_solution"
  ) => void;
};

const TicketDetailsButton: React.FC<TicketDetailsButtonProps> = ({
  departmentType,
  ticketStatus,
  onPress,
}) => {
  let buttons: {
    id: Parameters<typeof onPress>[0];
    label: React.ComponentProps<typeof Button>["label"];
    icon: React.ComponentProps<typeof Button>["icon"];
    color?: React.ComponentProps<typeof Button>["color"];
  }[] = [];

  if (departmentType === "maintenance") {
    if (ticketStatus === "pending") {
      buttons = [
        { id: "confirm_ticket", label: "Confirmar OS", icon: "thumb-up" },
      ];
    } else if (ticketStatus === "solving") {
      buttons = [
        { id: "send_solution", label: "Transmitir Solução", icon: "check" },
      ];
    }
  } else if (ticketStatus === "solved") {
    buttons = [
      { id: "accept_solution", label: "Aceitar Solução", icon: "handshake" },
      {
        id: "decline_solution",
        label: "Recusar Solução",
        icon: "thumb-down",
        color: "danger",
      },
    ];
  }

  return (
    <>
      {buttons.map((btn, idx) => (
        <Button
          key={`${idx}-${btn.label}`}
          label={btn.label}
          icon={btn.icon}
          color={btn.color ? btn.color : "success"}
          onPress={() => onPress(btn.id)}
          style={styles.button}
        />
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    margin: 20,
    marginBottom: 0,
  },
});

export default TicketDetailsButton;
