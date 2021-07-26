export type TicketStatus =
  | "pending"
  | "solving"
  | "solved"
  | "closed"
  | "refused";

export type TicketPriority = "low" | "medium" | "high";

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

  status: TicketStatus;
  priority?: TicketPriority;

  solution?: string;

  createdAt: string;
  acceptedAt?: string;
  solvedAt?: string;
  closedAt?: string;
};
