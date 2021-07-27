import { Ticket } from "../types";

export const translatePriority = (priority: Ticket["priority"]): string => {
  switch (priority) {
    case "low":
      return "BAIXA";
    case "medium":
      return "MÉDIA";
    case "high":
      return "ALTA";
    default:
      return "Indefinida";
  }
};

export const translateEventType = (
  eventType: Ticket["events"][0]["type"]
): string => {
  switch (eventType) {
    case "ticketCreated":
      return "OS CRIADA";
    case "ticketConfirmed":
      return "OS CONFIRMADA";
    case "solutionTransmitted":
      return "SOLUÇÃO TRANSMITIDA";
    case "solutionAccepted":
      return "SOLUÇÃO ACEITA";
    case "ticketClosed":
      return "OS ENCERRADA";
    case "solutionRefused":
      return "SOLUÇÃO RECUSADA";
    case "ticketReopened":
      return "OS REABERTA";
    case "priorityChanged":
      return "PRIORIDADE ALTERADA";
    case "ticketEdited":
      return "OS EDITADA";
  }
};
