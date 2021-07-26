export type Department = {
  type: "maintenance" | "operator";
  username: string;
  displayName: string;
  email: string;
  color: string;
  machines?: number;

  isMaintenance: () => boolean;
  getMachineNames: () => string[];
};
