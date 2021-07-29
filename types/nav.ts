import { RouteProp } from "@react-navigation/native";
import { Ticket } from "./db/Ticket";
import { DataState } from "./state/Data";

export type AccountStackParamList = {
  accountHome: undefined;
};

export type AllTicketsStackParamList = {
  allTicketsHome: undefined;
  filterTickets: undefined;
  filterSelect: {
    key: keyof DataState["filters"];
    items: { label: string; value: string }[];
  };
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
