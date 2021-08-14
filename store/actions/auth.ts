import { AuthActionSetDepartment, AuthActionSetSwapping } from "../../types";

export const setDepartment = (
  department: AuthActionSetDepartment["payload"]["department"]
): AuthActionSetDepartment => {
  return {
    type: "SET_DEPARTMENT",
    payload: { department },
  };
};

export const setSwapping = (
  swapping: AuthActionSetSwapping["payload"]["swapping"]
): AuthActionSetSwapping => {
  return {
    type: "SET_SWAPPING",
    payload: { swapping },
  };
};
