export type Department = {
  type: "maintenance" | "operator" | "viewOnly";
  username: string;
  displayName: string;
  email: string;
  color: string;
  machines?: number;

  swappableWith?: string | string[];

  isOperator: () => boolean;
  isMaintenance: () => boolean;
  isViewOnly: () => boolean;

  getMachineNames: () => string[];
};
