import firebase from "firebase";

export type InternalProjectEvent = {
  timestamp: firebase.firestore.Timestamp;
  author: string;
} & (
  | {
      type: "create";
    }
  | {
      type: "complete";
      message?: string;
    }
  | { type: "status"; message: string }
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
