export type TicketEditedEventChanges = {
  machine?: { old: string; new: string };
  description?: { old: string; new: string };
  interruptions?: {
    line?: { old: boolean; new: boolean };
    equipment?: { old: boolean; new: boolean };
  };
  team?: { old: string; new: string };
  maintenanceType?: { old: string; new: string };
  cause?: { old: string; new: string };
};

export type Ticket = {
  id: string;
  username: string;

  dpt: string;
  machine: string;
  description: string;
  interruptions: {
    line: boolean;
    equipment: boolean;
  };
  team: string;
  maintenanceType: string;
  cause: string;
  additionalInfo?: string;

  status: "pending" | "solving" | "solved" | "closed" | "refused";
  priority?: "low" | "medium" | "high" | null;

  assignedMaintainer?: string;

  solution?: string | null;
  solutionSteps?: string[];
  refusalReason?: string | null;

  createdAt: string;
  acceptedAt?: string | null;
  solvedAt?: string | null;
  closedAt?: string | null;
  reopenedAt?: string;

  events: {
    id: string;
    type:
      | "ticketCreated"
      | "ticketConfirmed"
      | "solutionStepAdded"
      | "solutionTransmitted"
      | "solutionAccepted"
      | "ticketClosed"
      | "solutionRefused"
      | "ticketReopened"
      | "priorityChanged"
      | "ticketEdited"
      | "poke"
      | "maintainerChanged";
    timestamp: string;
    device: {
      name: string | null;
      model: string | null;
      os: { name: string | null; version: string | null };
    };

    payload: {
      priority?: Ticket["priority"];
      assignedMaintainer?: Ticket["assignedMaintainer"];
      solution?: Ticket["solution"];
      refusalReason?: Ticket["refusalReason"];
      changes?: TicketEditedEventChanges;
      poke?: { from: string; to: string };
      solutionStep?: {
        type:
          | "step"
          | "solutionTransmitted"
          | "solutionAccepted"
          | "solutionRefused";
        content?: string;
      };
    } | null;
  }[];
};

export type TicketStatsItem<T extends string | number> = {
  data: T | string;
  pos: number | string;
  best: T | string;
};

export type TicketStats = {
  // Tempo até 1a Confirmação
  timeToFirstConfirmation: TicketStatsItem<string>;
  // Tempo até 1a Solução
  timeToFirstSolution: TicketStatsItem<string>;
  // Tempo até 1a Resposta do Solicitante
  timeToFirstAnswerToSolution: TicketStatsItem<string>;
  // Tempo até Encerramento
  timeToClosure: TicketStatsItem<string>;
  // Qtd de Soluções Recusadas
  solutionsRefused: TicketStatsItem<number>;
  // Qtd de Cutucadas
  pokes: TicketStatsItem<number>;
};
