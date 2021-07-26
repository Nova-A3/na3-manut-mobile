import { AuthActionSetDepartment } from "../../types";

export const setDepartment = (
  department: AuthActionSetDepartment["payload"]["department"]
): AuthActionSetDepartment => {
  return {
    type: "SET_DEPARTMENT",
    payload: { department },
  };
};
