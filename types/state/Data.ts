import { FsInternalProject } from "../db/InternalProject";
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

  projects: FsInternalProject[];
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

export interface DataActionFilterControl {
  type: "FILTER_ON" | "FILTER_OFF" | "TOGGLE_FILTER";
  payload: { filterKey: keyof DataState["filters"]; filterValue: string };
}

export interface DataActionToggleFilter extends DataActionFilterControl {
  type: "TOGGLE_FILTER";
}

export interface DataActionFilterOn extends DataActionFilterControl {
  type: "FILTER_ON";
}

export interface DataActionFilterOff extends DataActionFilterControl {
  type: "FILTER_OFF";
}

export type DataActionSetProjects = {
  type: "SET_PROJECTS";
  payload: { projects?: FsInternalProject[] };
};

export type DataAction =
  | DataActionSetTickets
  | DataActionSetDptIssues
  | DataActionSetLoading
  | DataActionRegisterFirstLoad
  | DataActionToggleFilter
  | DataActionFilterOn
  | DataActionFilterOff
  | DataActionSetProjects;
