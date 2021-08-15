import firebase from "firebase";
import moment from "moment";
import { FsInternalProject, InternalProject } from "../types";
import { fsCollectionId } from "../utils";

export default class InternalProjects {
  static COLORS = {
    STATUS: {
      RUNNING: "#F2D602",
      FINISHED: "#60BE4E",
      LATE: "#EB5A46",
    },
  };

  private static getCollection = () =>
    firebase.firestore().collection(fsCollectionId("manut-projects"));

  static fetchAll = async (): Promise<FsInternalProject[]> => {
    const projectsSnapshot = await InternalProjects.getCollection().get();
    const projects = projectsSnapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as InternalProject),
    }));

    const projectsByStatus: Record<
      ReturnType<typeof InternalProjects["projectStatus"]>,
      FsInternalProject[]
    > = {
      running: [],
      finished: [],
      late: [],
    };

    projects.forEach((p) => {
      projectsByStatus[InternalProjects.projectStatus(p)].push(p);
    });

    Object.entries(projectsByStatus).forEach(([status, projects]) => {
      projects.sort((pA, pB) =>
        moment(
          (["running", "late"].includes(status)
            ? pA
            : pB
          ).events[0]!.timestamp.toDate()
        ).diff(
          (["running", "late"].includes(status)
            ? pB
            : pA
          ).events[0]!.timestamp.toDate()
        )
      );
    });

    return [
      ...projectsByStatus.late,
      ...projectsByStatus.running,
      ...projectsByStatus.finished,
    ];
  };

  static findNextId = async (): Promise<InternalProject["internalId"]> => {
    const allProjectsSnapshot = await InternalProjects.getCollection().get();
    const sortedIds = allProjectsSnapshot.docs
      .map((doc) => (doc.data() as InternalProject).internalId)
      .sort((idA, idB) => idB - idA);

    if (!sortedIds[0]) {
      return 1;
    } else {
      return sortedIds[0] + 1;
    }
  };

  static publish = async (project: InternalProject) => {
    await InternalProjects.getCollection().add(project);
  };

  static pushEvent = async (
    projectId: string,
    event: InternalProject["events"][number]
  ) => {
    await InternalProjects.getCollection()
      .doc(projectId)
      .update({
        events: firebase.firestore.FieldValue.arrayUnion(event),
      });
  };

  static formatId = (project: InternalProject) => {
    return `PR-${project.internalId.toString().padStart(4, "0")}`;
  };

  static projectStatus = (project: InternalProject) => {
    if (project.events.map((ev) => ev.type).includes("complete")) {
      return "finished";
    } else if (moment(project.eta.toDate()).diff(moment()) < 0) {
      return "late";
    } else {
      return "running";
    }
  };

  static statusSelect = <T extends any>(
    project: InternalProject,
    select: Record<ReturnType<typeof InternalProjects["projectStatus"]>, T>
  ) => {
    return select[InternalProjects.projectStatus(project)];
  };

  static statusColor = (project: InternalProject): [string, string] => {
    const statusColors: Record<
      ReturnType<typeof InternalProjects["projectStatus"]>,
      string
    > = {
      running: InternalProjects.COLORS.STATUS.RUNNING,
      finished: InternalProjects.COLORS.STATUS.FINISHED,
      late: InternalProjects.COLORS.STATUS.LATE,
    };

    const projectStatus = InternalProjects.projectStatus(project);

    return [
      statusColors[projectStatus],
      projectStatus === "running" ? "#333" : "#eee",
    ];
  };

  static getEvents = (
    project: InternalProject,
    eventType: InternalProject["events"][0]["type"]
  ) => {
    return project.events.filter((ev) => ev.type === eventType);
  };

  static translateEvent = (event: InternalProject["events"][0]) => {
    let text: string;
    switch (event.type) {
      case "create":
        text = "Projeto criado";
        break;
      case "complete":
        text =
          "Projeto entregue" + (event.message ? `: "${event.message}"` : "");
        break;
      case "status":
        text = event.message;
    }

    return text;
  };

  static humanizeTimestamp = (timestamp: firebase.firestore.Timestamp) => {
    return moment(timestamp.toDate()).fromNow();
  };

  static formatTimestamp = (
    timestamp: firebase.firestore.Timestamp,
    formatString: string
  ) => {
    return moment(timestamp.toDate()).format(formatString);
  };

  static humanizedTimeDiffBetweenEvents = (
    eventA: InternalProject["events"][0],
    eventB: InternalProject["events"][0]
  ) => {
    const durationMs = moment.duration(
      moment(eventB.timestamp.toDate()).diff(eventA.timestamp.toDate(), "ms"),
      "ms"
    );

    return `${durationMs.days() > 0 ? `${durationMs.days()}d` : ""}${
      durationMs.days() > 0 || durationMs.hours() > 0
        ? `${durationMs.hours()}h`
        : ""
    }${durationMs.minutes()}m`;
  };

  static humanizedTimeToEta = (project: InternalProject) => {
    const durationMs = moment.duration(
      moment(project.eta.toDate()).diff(
        project.events[0]!.timestamp.toDate(),
        "ms"
      ),
      "ms"
    );

    return `${durationMs.days() > 0 ? `${durationMs.days()}d` : ""}${
      durationMs.days() > 0 || durationMs.hours() > 0
        ? `${durationMs.hours()}h`
        : ""
    }${durationMs.minutes()}m${durationMs.seconds()}s`;
  };

  static humanizedDurationMs = (durationMs: number) => {
    const momentDuration = moment.duration(durationMs, "ms");

    return `${momentDuration.days() > 0 ? `${momentDuration.days()}d` : ""}${
      momentDuration.days() > 0 || momentDuration.hours() > 0
        ? `${momentDuration.hours()}h`
        : ""
    }${momentDuration.minutes()}m${momentDuration.seconds()}s`;
  };
}
