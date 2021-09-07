import { Na3App, Na3AppId } from "./Na3App";
import { Na3Person } from "./Na3Person";

export type Na3DptType = "shop-floor" | "factory-adm" | "office";

export type Na3DptIdMap = {
  "shop-floor":
    | "kit-automatico"
    | "flexografia-papel"
    | "flexografia-plastico"
    | "extrusao"
    | "corte-solda-luva"
    | "corte-solda-saco"
    | "reciclagem"
    | "dobra"
    | "off-set"
    | "corte"
    | "super-kit"
    | "kit-manual"
    | "ekoplasto";
  "factory-adm": "manutencao" | "qualidade" | "administrativo";
  office: "diretoria" | "desenvolvimento";
};

export type Na3DptId<T extends Na3DptType = Na3DptType> = Na3DptIdMap[T];

export type Na3DptLocationMap = {
  "shop-floor": "factory";
  "factory-adm": "factory";
  office: "office";
};

export type Na3DptLocation = Na3DptLocationMap[keyof Na3DptLocationMap];

export interface Na3DptMachine {
  id: string;
  number: number;
  name: string;
  issues: string[];
}

export type Na3Dpt<T extends Na3DptType = Na3DptType> = {
  type: T;
  id: Na3DptIdMap[T];
  name: string;
  displayName: string;
  location: T extends "office" ? "office" : "factory";
  people: Na3Person[];
  apps: Partial<Record<Na3AppId, Na3App>>;
  style: {
    colors: {
      background: string;
      text: "light" | "dark";
    };
  };
} & (T extends "shop-floor"
  ? {
      twoLetterId: string;
      machines: {
        [id: string]: Na3DptMachine;
      };
    }
  : {});
