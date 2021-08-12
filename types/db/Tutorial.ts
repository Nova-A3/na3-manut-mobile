import firebase from "firebase";
import { Department } from "./Department";

export type TutorialView = {
  deviceId: string;
  department: string;
  timestamp: firebase.firestore.Timestamp;
};

export type Tutorial = {
  title: string;
  targets: Department["type"][];
  url: string;
  thumbnail: string;
  durationMs: number;
  views: TutorialView[];
};

export type FsTutorial = Tutorial & { id: string };

export type DeviceTutorial = FsTutorial & {
  watched: boolean;
};
