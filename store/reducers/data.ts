import {
  DataAction,
  DataActionFilterOff,
  DataActionFilterOn,
  DataActionToggleFilter,
  DataState,
} from "../../types";

const initialState: DataState = {
  tickets: [],
  dptIssues: [],
  loading: false,
  didFirstLoad: false,
  filters: {
    departments: [],
    problems: [],
    teams: ["mecanica", "eletrica", "predial"],
    maintenanceTypes: ["preventiva", "corretiva", "preditiva"],
    causes: ["mecanica", "eletrica", "machineAdjustment"],
  },
  projects: [],
};

const handleFilterOn = (
  state: DataState,
  {
    payload: { filterKey, filterValue },
  }: DataActionFilterOn | DataActionToggleFilter
) => {
  if (state.filters[filterKey].includes(filterValue)) return state;

  return {
    ...state,
    filters: {
      ...state.filters,
      [filterKey]: [...state.filters[filterKey], filterValue],
    },
  };
};

const handleFilterOff = (
  state: DataState,
  {
    payload: { filterKey, filterValue },
  }: DataActionFilterOff | DataActionToggleFilter
) => {
  if (!state.filters[filterKey].includes(filterValue)) return state;

  return {
    ...state,
    filters: {
      ...state.filters,
      [filterKey]: state.filters[filterKey].filter((f) => f !== filterValue),
    },
  };
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
    case "SET_FILTER":
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.filterKey]: action.payload.filterValue,
        },
      };
    case "TOGGLE_FILTER":
      if (
        state.filters[action.payload.filterKey].includes(
          action.payload.filterValue
        )
      ) {
        return handleFilterOff(state, action);
      } else {
        return handleFilterOn(state, action);
      }
    case "FILTER_ON":
      return handleFilterOn(state, action);
    case "FILTER_OFF":
      return handleFilterOff(state, action);
    case "SET_PROJECTS":
      return {
        ...state,
        projects: action.payload.projects ? action.payload.projects : [],
      };
    default:
      return state;
  }
};

export default dataReducer;
