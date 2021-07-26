import {
  DataActionRegisterFirstLoad,
  DataActionSetLoading,
  DataActionSetTickets,
} from "../../types";

export const setTickets = (
  tickets: DataActionSetTickets["payload"]["tickets"]
): DataActionSetTickets => {
  return {
    type: "SET_TICKETS",
    payload: { tickets },
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

export const registerDataFirstLoad = (): DataActionRegisterFirstLoad => {
  return {
    type: "REGISTER_DATA_FIRST_LOAD",
  };
};
