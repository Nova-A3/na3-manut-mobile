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
    case "solutionStepAdded":
      return "PROGRESSO";
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
      return "PRIORIDADE REDEFINIDA";
    case "ticketEdited":
      return "OS EDITADA";
    case "poke":
      return "SETOR CUTUCADO";
    case "maintainerChanged":
      return "RESPONSÁVEL REDEFINIDO";
  }
};

export const translateTicketKey = (key: string) => {
  switch (key) {
    case "machine":
      return "Máquina";
    case "description":
      return "Descrição do problema";
    case "line":
      return "Interrupções • Linha";
    case "equipment":
      return "Interrupções • Máquina";
    case "team":
      return "Equipe responsável";
    case "maintenanceType":
      return "Tipo de manutenção";
    case "cause":
      return "Tipo de causa";
    default:
      return key;
  }
};

export const translateProjectKey = (key: string) => {
  switch (key) {
    case "title":
      return "Título";
    case "description":
      return "Descrição";
    case "teamManager":
      return "Equipe – Responsável";
    case "teamOthers":
      return "Equipe – Manutentor(es)";
    case "priority":
      return "Prioridade";
    case "eta":
      return "Previsão de conclusão";
    default:
      return key;
  }
};

export const translateAccountType = (
  accType: "operator" | "maintenance" | "viewOnly"
) => {
  switch (accType) {
    case "operator":
      return "Operador";
    case "maintenance":
      return "Manutenção";
    case "viewOnly":
      return "Visualizador";
  }
};
