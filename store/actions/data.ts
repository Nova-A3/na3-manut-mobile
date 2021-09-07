import {
  DataActionFilterOff,
  DataActionFilterOn,
  DataActionRegisterFirstLoad,
  DataActionSetDptIssues,
  DataActionSetFilter,
  DataActionSetLoading,
  DataActionSetProjects,
  DataActionSetTickets,
  DataActionToggleFilter,
  DataState,
} from "../../types";

export const setTickets = (
  tickets: DataActionSetTickets["payload"]["tickets"]
): DataActionSetTickets => {
  return {
    type: "SET_TICKETS",
    payload: { tickets },
  };
};

export const setDptIssues = (
  issues: DataActionSetDptIssues["payload"]["issues"]
): DataActionSetDptIssues => {
  return {
    type: "SET_DPT_ISSUES",
    payload: { issues },
  };
};

export const setDataLoading = (
  loadingValue: DataActionSetLoading["payload"]["loadingValue"]
): DataActionSetLoading => {
  return {
    type: "SET_DATA_LOADING",
    payload: { loadingValue },
  };
};

export const registerDataFirstLoad = (
  value = true
): DataActionRegisterFirstLoad => {
  return {
    type: "REGISTER_DATA_FIRST_LOAD",
    payload: { value },
  };
};

export const setFilter = (
  filterKey: keyof DataState["filters"],
  filterValue: string[]
): DataActionSetFilter => {
  return {
    type: "SET_FILTER",
    payload: { filterKey, filterValue },
  };
};

export const toggleFilter = (
  filterKey: keyof DataState["filters"],
  filterValue: string
): DataActionToggleFilter => {
  return {
    type: "TOGGLE_FILTER",
    payload: { filterKey, filterValue },
  };
};

export const filterOn = (
  filterKey: keyof DataState["filters"],
  filterValue: string
): DataActionFilterOn => {
  return {
    type: "FILTER_ON",
    payload: { filterKey, filterValue },
  };
};

export const filterOff = (
  filterKey: keyof DataState["filters"],
  filterValue: string
): DataActionFilterOff => {
  return {
    type: "FILTER_OFF",
    payload: { filterKey, filterValue },
  };
};

export const setProjects = (
  projects: DataActionSetProjects["payload"]["projects"]
): DataActionSetProjects => {
  return {
    type: "SET_PROJECTS",
    payload: { projects },
  };
};
