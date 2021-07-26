import { Ticket } from "../db/Ticket";

export type DataState = {
  tickets: Ticket[];
  loading: boolean;
  didFirstLoad: boolean;
};

export type DataActionSetTickets = {
  type: "SET_TICKETS";
  payload: { tickets?: Ticket[] };
};

export type DataActionSetLoading = {
  type: "SET_DATA_LOADING";
  payload: { loadingValue: boolean };
};

export type DataActionRegisterFirstLoad = {
  type: "REGISTER_DATA_FIRST_LOAD";
};

export type DataAction =
  | DataActionSetTickets
  | DataActionSetLoading
  | DataActionRegisterFirstLoad;
