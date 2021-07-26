import { AuthAction, AuthState } from "../../types";

const initialState: AuthState = {
  department: undefined,
};

const authReducer = (state = initialState, action: AuthAction) => {
  switch (action.type) {
    case "SET_DEPARTMENT":
      return { ...state, department: action.payload.department };
    default:
      return state;
  }
};

export default authReducer;
