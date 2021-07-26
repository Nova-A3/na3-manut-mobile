import { DataState } from "./Data";
import { AuthState } from "./Auth";
import { UIState } from "./UI";

export type RootState = {
  auth: AuthState;
  ui: UIState;
  data: DataState;
};
