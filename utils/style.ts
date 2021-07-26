import { PlatformColor } from "react-native";
import { TicketStatus } from "../types";

export type ColorType = "primary" | "secondary" | "success" | "danger";

export const systemColor = (
  colorType?: ColorType
): ReturnType<typeof PlatformColor> => {
  if (!colorType) {
    return PlatformColor("systemBlue");
  }

  switch (colorType) {
    case "primary":
      return PlatformColor("systemBlue");
    case "secondary":
      return PlatformColor("systemGray");
    case "success":
      return PlatformColor("systemGreen");
    case "danger":
      return PlatformColor("systemRed");
  }
};

export const getTicketStatusStyles = (
  status: TicketStatus
): { text: string; bgColor: string; color: string } => {
  switch (status) {
    case "pending":
      return { text: "Pendente", bgColor: "#F2D602", color: "black" };
    case "solving":
      return { text: "Resolvendo", bgColor: "#FF9E1A", color: "black" };
    case "solved":
      return { text: "Solucionada", bgColor: "#51E898", color: "black" };
    case "closed":
      return { text: "Encerrada", bgColor: "#60BE4E", color: "black" };
    case "refused":
      return { text: "Recusada", bgColor: "#EB5A46", color: "black" };
  }
};

export const idToName = (id: string) => {
  return {
    mecanica: "Mecânica",
    eletrica: "Elétrica",
    predial: "Predial",
    preventiva: "Preventiva",
    corretiva: "Corretiva",
    preditiva: "Preditiva",
    operacional: "Operacional",
  }[id];
};
