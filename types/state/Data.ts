import { Ticket } from "../db/Ticket";

export type DataState = {
  tickets: Ticket[];
  dptIssues: string[];
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

export type DataActionSetDptIssues = {
  type: "SET_DPT_ISSUES";
  payload: { issues?: string[] };
};

export type DataActionSetLoading = {
  type: "SET_DATA_LOADING";
  payload: { loadingValue: boolean };
};

export type DataActionRegisterFirstLoad = {
  type: "REGISTER_DATA_FIRST_LOAD";
  payload: { value: boolean };
};

export type DataActionToggleFilter = {
  type: "TOGGLE_FILTER";
  payload: { filterKey: keyof DataState["filters"]; filterValue: string };
};

export type DataAction =
  | DataActionSetTickets
  | DataActionSetDptIssues
  | DataActionSetLoading
  | DataActionRegisterFirstLoad
  | DataActionToggleFilter;
