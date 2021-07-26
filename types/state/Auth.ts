import { Department } from "../db/Department";

export type AuthState = {
  department: Department | null | undefined;
};

export type AuthActionSetDepartment = {
  type: "SET_DEPARTMENT";
  payload: { department: Department | null };
};

export type AuthAction = AuthActionSetDepartment;
