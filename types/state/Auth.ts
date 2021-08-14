import { Department } from "../db/Department";

export type AuthState = {
  department: Department | null | undefined;
  isSwapping: boolean;
};

export type AuthActionSetDepartment = {
  type: "SET_DEPARTMENT";
  payload: { department: Department | null };
};

export type AuthActionSetSwapping = {
  type: "SET_SWAPPING";
  payload: { swapping: boolean };
};

export type AuthAction = AuthActionSetDepartment | AuthActionSetSwapping;
