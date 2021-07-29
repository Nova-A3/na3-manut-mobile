import { Ticket } from "../db/Ticket";

export type DataState = {
  tickets: Ticket[];
  loading: boolean;
  didFirstLoad: boolean;
  filters: {
    departments: string[];
    problems: string[];
    teams: string[];
    maintenanceTypes: string[];
    causes: string[];
  };
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

export type DataActionToggleFilter = {
  type: "TOGGLE_FILTER";
  payload: { filterKey: keyof DataState["filters"]; filterValue: string };
};

export type DataAction =
  | DataActionSetTickets
  | DataActionSetLoading
  | DataActionRegisterFirstLoad
  | DataActionToggleFilter;
