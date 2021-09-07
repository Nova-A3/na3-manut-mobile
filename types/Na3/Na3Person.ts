import { Na3App, Na3AppId } from "./Na3App";
import { Na3DptId } from "./Na3Dpt";

export type Na3Person = {
  department: Na3DptId;
  id: Lowercase<string>;
  name: string;
  displayName: string;
  apps: Partial<Record<Na3AppId, Na3App>>;
};
