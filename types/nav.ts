import { RouteProp } from "@react-navigation/native";
import { Ticket } from "./db/Ticket";

export type AccountStackParamList = {
  accountHome: undefined;
};

export type AllTicketsStackParamList = {
  allTicketsHome: undefined;
  filterTickets: undefined;
  ticketDetails: { ticket: Ticket };
  ticketTimeline: TicketDependantRoute;
  ticketStats: TicketDependantRoute;
  ticketEdit: TicketDependantRoute;
  reportsHome: undefined;
};

export type NewTicketStackParamList = {
  newTicketHome: undefined;
  newTicketForm: undefined;
};

export type SignInStackParamList = {
  signInHome: undefined;
};

export type UrgentTicketsStackParamList = {
  urgentTicketsHome: undefined;
  ticketDetails: { ticket: Ticket };
  ticketTimeline: TicketDependantRoute;
  ticketStats: TicketDependantRoute;
  ticketEdit: TicketDependantRoute;
};

export type TicketDependantRoute = RouteProp<
  AllTicketsStackParamList,
  "ticketDetails"
>;

export type StatsStackParamList = {
  statsHome: undefined;
};
