import { Ticket } from "./db/Ticket";

export type AccountStackParamList = {
  accountHome: undefined;
};

export type AllTicketsStackParamList = {
  allTicketsHome: undefined;
  ticketDetails: {
    ticket: Ticket;
  };
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
  ticketDetails: {
    ticket: Ticket;
  };
};
