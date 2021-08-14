import { AuthAction, AuthState } from "../../types";

const initialState: AuthState = {
  department: undefined,
  isSwapping: false,
};

const authReducer = (state = initialState, action: AuthAction) => {
  switch (action.type) {
    case "SET_DEPARTMENT":
      return { ...state, department: action.payload.department };
    case "SET_SWAPPING":
      return { ...state, isSwapping: action.payload.swapping };
    default:
      return state;
  }
};

export default authReducer;
