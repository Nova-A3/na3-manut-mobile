import Db from "../../db";
import { DataAction, DataState } from "../../types";

const initialState: DataState = {
  tickets: [],
  dptIssues: [],
  loading: false,
  didFirstLoad: false,
  filters: {
    departments: Db.getDepartments()
      .filter((d) => d.isOperator())
      .map((d) => d.username),
    problems: [],
    teams: ["mecanica", "eletrica", "predial"],
    maintenanceTypes: ["preventiva", "corretiva", "preditiva"],
    causes: ["mecanica", "eletrica", "machineAdjustment"],
  },
};

const dataReducer = (state = initialState, action: DataAction) => {
  switch (action.type) {
    case "SET_TICKETS":
      return {
        ...state,
        tickets: action.payload.tickets ? action.payload.tickets : [],
      };
    case "SET_DPT_ISSUES":
      return {
        ...state,
        dptIssues: action.payload.issues ? action.payload.issues : [],
      };
    case "SET_DATA_LOADING":
      return {
        ...state,
        loading: action.payload.loadingValue,
      };
    case "REGISTER_DATA_FIRST_LOAD":
      return {
        ...state,
        didFirstLoad: action.payload.value,
      };
    case "TOGGLE_FILTER":
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.filterKey]: state.filters[
            action.payload.filterKey
          ].includes(action.payload.filterValue)
            ? state.filters[action.payload.filterKey].filter(
                (f) => f !== action.payload.filterValue
              )
            : [
                ...state.filters[action.payload.filterKey],
                action.payload.filterValue,
              ],
        },
      };
    default:
      return state;
  }
};

export default dataReducer;
