import { DataAction, DataState } from "../../types";

const initialState: DataState = {
  tickets: [],
  loading: false,
  didFirstLoad: false,
};

const dataReducer = (state = initialState, action: DataAction) => {
  switch (action.type) {
    case "SET_TICKETS":
      return {
        ...state,
        tickets: action.payload.tickets ? action.payload.tickets : [],
      };
    case "SET_DATA_LOADING":
      return {
        ...state,
        loading: action.payload.loadingValue,
      };
    case "REGISTER_DATA_FIRST_LOAD":
      return {
        ...state,
        didFirstLoad: true,
      };
    default:
      return state;
  }
};

export default dataReducer;
