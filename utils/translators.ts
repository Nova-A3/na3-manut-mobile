import { TicketPriority } from "../types";

export const translatePriority = (
  priority: Exclude<TicketPriority, undefined>
) => {
  switch (priority) {
    case "low":
      return "BAIXA";
    case "medium":
      return "MÉDIA";
    case "high":
      return "ALTA";
  }
};
