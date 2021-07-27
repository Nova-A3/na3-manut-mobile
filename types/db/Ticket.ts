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

  status: "pending" | "solving" | "solved" | "closed" | "refused";
  priority?: "low" | "medium" | "high" | null;

  solution?: string | null;
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
      | "solutionTransmitted"
      | "solutionAccepted"
      | "ticketClosed"
      | "solutionRefused"
      | "ticketReopened"
      | "priorityChanged"
      | "ticketEdited";
    timestamp: string;
    device: {
      name: string | null;
      model: string | null;
      os: { name: string | null; version: string | null };
    };

    payload: {
      priority?: Ticket["priority"];
      solution?: Ticket["solution"];
      refusalReason?: Ticket["refusalReason"];
    } | null;
  }[];
};
