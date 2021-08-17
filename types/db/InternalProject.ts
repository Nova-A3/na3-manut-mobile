import firebase from "firebase";

export type InternalProjectChanges = Partial<{
  title: { old: InternalProject["title"]; new: InternalProject["title"] };
  description: {
    old: InternalProject["description"];
    new: InternalProject["description"];
  };
  teamManager: {
    old: InternalProject["team"]["manager"];
    new: InternalProject["team"]["manager"];
  };
  teamOthers: {
    old: InternalProject["team"]["others"];
    new: InternalProject["team"]["others"];
  };
  priority: {
    old: InternalProject["priority"];
    new: InternalProject["priority"];
  };
  eta: { old: InternalProject["eta"]; new: InternalProject["eta"] };
}>;

export type InternalProjectChange<T> = { old: T; new: T } | null;

export type InternalProjectEvent = {
  timestamp: firebase.firestore.Timestamp;
  author: string;
} & (
  | { type: "create" }
  | { type: "complete"; message?: string }
  | { type: "status"; message: string }
  | { type: "edit"; changes: InternalProjectChanges }
);

export type InternalProject = {
  internalId: number;
  title: string;
  description: string;
  team: {
    manager: string;
    others: string;
  };
  priority: "low" | "medium" | "high";
  eta: firebase.firestore.Timestamp;
  events: InternalProjectEvent[];
};

export type FsInternalProject = { id: string } & InternalProject;
