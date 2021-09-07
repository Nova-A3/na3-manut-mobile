import { Department as IDepartment, Na3Dpt, Na3DptMachine } from "../types";

class Department implements IDepartment {
  type: IDepartment["type"];
  username: IDepartment["username"];
  displayName: IDepartment["displayName"];
  color: IDepartment["color"];
  machines: IDepartment["machines"];
  isPerson: IDepartment["isPerson"];
  swappableWith?: IDepartment["swappableWith"];

  constructor(
    readonly original: Na3Dpt,
    {
      type,
      username,
      displayName,
      color,
      machines,
      isPerson,
      swappableWith,
    }: Pick<
      IDepartment,
      | "type"
      | "username"
      | "displayName"
      | "color"
      | "machines"
      | "isPerson"
      | "swappableWith"
    >
  ) {
    this.type = type;
    this.username = username.trim().toLowerCase();
    this.displayName = displayName.trim().toUpperCase();
    this.color = color;
    this.machines = machines;
    this.isPerson = isPerson;
    this.swappableWith = swappableWith;
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
    if (!("machines" in this.original)) {
      return [];
    } else {
      const { machines } = this.original;
      return Object.values(machines)
        .sort((a, b) => a.number - b.number)
        .map((machineData) => `${machineData.name} (${machineData.id})`);
    }
  }

  getMachines(): Na3DptMachine[] {
    if (!("machines" in this.original)) {
      return [];
    } else {
      return Object.values(this.original.machines).sort(
        (a, b) => a.number - b.number
      );
    }
  }
}

export class Db {
  private static departments: Department[] = [];

  static setDepartments(dpts: Na3Dpt[]) {
    function getDptSwappableWith(
      dptId: typeof dpts[number]["id"]
    ): string | string[] | undefined {
      switch (dptId) {
        case "extrusao":
          return "reciclagem";
        case "reciclagem":
          return "extrusao";
        case "corte-solda-luva":
          return ["corte-solda-saco", "super-kit"];
        case "corte-solda-saco":
          return ["corte-solda-luva", "super-kit"];
        case "super-kit":
          return ["corte-solda-saco", "corte-solda-luva"];
        case "flexografia-plastico":
          return "flexografia-papel";
        case "flexografia-papel":
          return "flexografia-plastico";
        default:
          return undefined;
      }
    }

    const manutDpts = dpts.filter(
      (dpt) =>
        Object.keys(dpt.apps).includes("manut") &&
        (dpt.type === "shop-floor" || dpt.id === "manutencao")
    );

    const appDpts = manutDpts.map(
      (dpt) =>
        new Department(dpt, {
          type:
            dpt.type === "shop-floor"
              ? "operator"
              : dpt.id === "manutencao"
              ? "maintenance"
              : "viewOnly",
          username: dpt.id,
          displayName: dpt.displayName,
          color: dpt.style.colors.background,
          swappableWith: getDptSwappableWith(dpt.id),
        })
    );

    const appUsers = dpts
      .filter(
        (dpt) =>
          Object.keys(dpt.apps).includes("manut") && dpt.people.length > 0
      )
      .map(
        (dpt) =>
          [
            dpt,
            dpt.people.filter((person) =>
              Object.keys(person.apps).includes("manut")
            ),
          ] as [Na3Dpt, Na3Dpt["people"]]
      )
      .map(([dpt, people]) =>
        people.map(
          (person) =>
            new Department(dpt, {
              type: "viewOnly",
              username: person.id,
              displayName: person.displayName,
              color: dpt.style.colors.background,
              isPerson: true,
            })
        )
      )
      .flat();

    Db.departments = [...appDpts, ...appUsers];
  }

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
