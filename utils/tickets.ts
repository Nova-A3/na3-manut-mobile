import { Ticket, TicketEditedEventChanges } from "../types";

export const getTicketChanges = (
  edited: Pick<
    Ticket,
    | "id"
    | "username"
    | "dpt"
    | "machine"
    | "description"
    | "interruptions"
    | "team"
    | "maintenanceType"
    | "cause"
  >,
  original: Ticket
) => {
  const changes: TicketEditedEventChanges = {};

  if (edited.machine !== original.machine) {
    changes.machine = {
      old: original.machine,
      new: edited.machine,
    };
  }
  if (edited.description !== original.description) {
    changes.description = {
      old: original.description,
      new: edited.description,
    };
  }
  if (
    edited.interruptions.line !== original.interruptions.line ||
    edited.interruptions.equipment !== original.interruptions.equipment
  ) {
    changes.interruptions = {};
    if (edited.interruptions.line !== original.interruptions.line) {
      changes.interruptions.line = {
        old: original.interruptions.line,
        new: edited.interruptions.line,
      };
    }
    if (edited.interruptions.equipment !== original.interruptions.equipment) {
      changes.interruptions.equipment = {
        old: original.interruptions.equipment,
        new: edited.interruptions.equipment,
      };
    }
  }
  if (edited.machine !== original.machine) {
    changes.machine = {
      old: original.machine,
      new: edited.machine,
    };
  }
  if (edited.team !== original.team) {
    changes.team = {
      old: original.team,
      new: edited.team,
    };
  }
  if (edited.maintenanceType !== original.maintenanceType) {
    changes.maintenanceType = {
      old: original.maintenanceType,
      new: edited.maintenanceType,
    };
  }
  if (edited.cause !== original.cause) {
    changes.cause = {
      old: original.cause,
      new: edited.cause,
    };
  }

  return changes;
};
