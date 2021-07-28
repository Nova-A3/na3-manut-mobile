import { Department as IDepartment } from "../types";

class Department implements IDepartment {
  type: IDepartment["type"];
  username: IDepartment["username"];
  displayName: IDepartment["displayName"];
  color: IDepartment["color"];
  machines: IDepartment["machines"];

  constructor({
    type,
    username,
    displayName,
    color,
    machines,
  }: Pick<
    IDepartment,
    "type" | "username" | "displayName" | "color" | "machines"
  >) {
    this.type = type;
    this.username = username.trim().toLowerCase();
    this.displayName = displayName.trim().toUpperCase();
    this.color = color;
    this.machines = machines;
  }

  get email(): IDepartment["email"] {
    return `manut-${this.username}@novaa3-app.com.br`;
  }

  isOperator(): boolean {
    return this.type === "operator";
  }

  isMaintenance(): boolean {
    return this.type === "maintenance";
  }

  isViewOnly(): boolean {
    return this.type === "viewOnly";
  }

  getMachineNames(): string[] {
    if (!this.machines) {
      return [];
    }

    const machineNames: string[] = [];
    for (let i = 0; i < this.machines; i++) {
      machineNames.push(`Máquina ${i + 1}`);
    }

    return machineNames;
  }
}

export class Db {
  private static departments = [
    new Department({
      type: "operator",
      username: "kit-automatico",
      displayName: "KIT AUTOMÁTICO",
      color: "#C377E0",
      machines: 7,
    }),
    new Department({
      type: "operator",
      username: "flexografia",
      displayName: "FLEXOGRAFIA",
      color: "#0579BF",
      machines: 4,
    }),
    new Department({
      type: "operator",
      username: "extrusao",
      displayName: "EXTRUSÃO",
      color: "#08C2E0",
      machines: 4,
    }),
    new Department({
      type: "operator",
      username: "corte-solda-luva",
      displayName: "CORTE & SOLDA (LUVA)",
      color: "#51E898",
      machines: 4,
    }),
    new Department({
      type: "operator",
      username: "corte-solda-saco",
      displayName: "CORTE & SOLDA (SACO)",
      color: "#FF78CB",
      machines: 4,
    }),
    new Department({
      type: "operator",
      username: "reciclagem",
      displayName: "RECICLAGEM",
      color: "#D5573B",
      machines: 1,
    }),
    new Department({
      type: "operator",
      username: "dobra",
      displayName: "DOBRA",
      color: "#885053",
      machines: 7,
    }),
    new Department({
      type: "operator",
      username: "off-set",
      displayName: "OFF-SET",
      color: "#C6ECAE",
      machines: 4,
    }),
    new Department({
      type: "operator",
      username: "corte",
      displayName: "CORTE",
      color: "#04E762",
      machines: 1,
    }),
    new Department({
      type: "operator",
      username: "super-kit",
      displayName: "SUPER KIT",
      color: "#F5B700",
      machines: 2,
    }),

    new Department({
      type: "maintenance",
      username: "manutencao",
      displayName: "MANUTENÇÃO",
      color: "#333",
    }),

    new Department({
      type: "viewOnly",
      username: "gsantos",
      displayName: "GLADSTONE J DOS SANTOS JR",
      color: "#333",
    }),
  ];

  static getDepartments() {
    return Db.departments;
  }

  static getDepartment(usernameOrEmail: string) {
    return Db.getDepartments().filter(
      (d) =>
        d[usernameOrEmail.includes("@") ? "email" : "username"] ===
        usernameOrEmail
    )[0];
  }
}

export default Db;
