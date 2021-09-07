import { Na3Dpt } from "../Na3/Na3Dpt";

export type Department = {
  original: Na3Dpt;
  type: "maintenance" | "operator" | "viewOnly";
  username: string;
  displayName: string;
  email: string;
  color: string;
  machines?: number;
  isPerson?: boolean;

  swappableWith?: string | string[];

  isOperator: () => boolean;
  isMaintenance: () => boolean;
  isViewOnly: () => boolean;

  getMachineNames: () => string[];
};
