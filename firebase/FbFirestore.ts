import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import firebase from "firebase/app";
import "firebase/firestore";
import uuid from "react-native-uuid";
import Db from "../db";
import store from "../store";
import { setDataLoading, setTickets } from "../store/actions";
import { Department, Ticket } from "../types";
import {
  getTicketChanges,
  sendNotification,
  timestamp,
  translatePriority,
} from "../utils";
class FbFirestore {
  collection(collectionId: "tickets" | "push-tokens") {
    return firebase.firestore().collection(collectionId);
  }

  async getTicketById(ticketId: Ticket["id"]): Promise<Ticket> {
    const doc = await this.collection("tickets").doc(ticketId).get();
    return doc.data() as Ticket;
  }

  async getTickets(department: Department): Promise<Ticket[]> {
    const collection = firebase.firestore().collection("tickets");

    const query =
      department.isMaintenance() || department.isViewOnly()
        ? await collection.get()
        : await collection.where("username", "==", department.username).get();

    const tickets = query.docs.map((doc) => ({ ...doc.data() } as Ticket));

    const urgentTickets: Ticket[] = [];
    const nonUrgentTickets: Ticket[] = [];

    tickets.forEach((ticket) => {
      if (this.checkTicketUrgency(ticket, department)) {
        urgentTickets.push(ticket);
      } else {
        nonUrgentTickets.push(ticket);
      }
    });

    urgentTickets.sort((a, b) => +b.id - +a.id);
    nonUrgentTickets.sort((a, b) => +b.id - +a.id);

    Notifications.setBadgeCountAsync(urgentTickets.length);

    return [...urgentTickets, ...nonUrgentTickets];
  }

  async getNextTicketId() {
    const query = await firebase.firestore().collection("tickets").get();
    return (query.size + 1).toString().padStart(4, "0");
  }

  async postTicket(
    id: Ticket["id"],
    data: Pick<
      Ticket,
      | "username"
      | "dpt"
      | "machine"
      | "description"
      | "interruptions"
      | "team"
      | "maintenanceType"
      | "cause"
    >
  ) {
    const event = this.buildTicketEvent("ticketCreated");
    const ticket: Ticket = {
      ...data,
      id,
      createdAt: event.timestamp,
      status: "pending",
      events: [event],
    };

    await firebase.firestore().collection("tickets").doc(id).set(ticket);

    sendNotification({
      to: await this.getPushTokens("manutencao"),
      title: `[AÇÃO NECESSÁRIA] Nova OS – nº ${ticket.id}`,
      body: `Acesse o app para aceitar: "${ticket.description}"`,
    });
    sendNotification({
      to: await this.getPushTokens(
        Db.getDepartments()
          .filter((d) => d.isViewOnly())
          .map((d) => d.username)
      ),
      title: `Nova OS – nº ${ticket.id} (${ticket.dpt})`,
      body: ticket.description,
    });
  }

  async confirmTicket(
    ticket: Ticket,
    data: { priority: Exclude<Ticket["priority"], undefined> }
  ): Promise<{ error: { title: string; description: string } | null }> {
    try {
      await firebase.firestore().collection("tickets").doc(ticket.id).update({
        acceptedAt: timestamp(),
        status: "solving",
        priority: data.priority,
      });

      await this.pushTicketEvents(ticket.id, {
        type: "ticketConfirmed",
        payload: { priority: data.priority },
      });

      sendNotification({
        to: await this.getPushTokens(ticket.username),
        title: `OS #${ticket.id}`,
        body: `A OS está sendo resolvida: prioridade ${translatePriority(
          data.priority
        )}`,
      });
      sendNotification({
        to: await this.getPushTokens(
          Db.getDepartments()
            .filter((d) => d.isViewOnly())
            .map((d) => d.username)
        ),
        title: `OS #${ticket.id} (${ticket.dpt})`,
        body: `Confirmada pela Manutenção: prioridade ${translatePriority(
          data.priority
        )}`,
      });

      return { error: null };
    } catch (e) {
      return {
        error: {
          title: "Erro ao aceitar a OS",
          description:
            "Um erro inesperado ocorreu. Por favor, entre em contato com o administrador do aplicativo para mais informações.",
        },
      };
    }
  }

  async transmitTicketSolution(
    ticket: Ticket,
    data: { solution: Exclude<Ticket["solution"], undefined | null> }
  ): Promise<{ error: { title: string; description: string } | null }> {
    if (!data.solution.trim()) {
      return {
        error: {
          title: "Campo requerido",
          description: 'O campo "Descrição da solução" é obrigatório.',
        },
      };
    }

    try {
      await firebase.firestore().collection("tickets").doc(ticket.id).update({
        solvedAt: timestamp(),
        status: "solved",
        solution: data.solution,
      });

      await this.pushTicketEvents(ticket.id, {
        type: "solutionTransmitted",
        payload: { solution: data.solution },
      });

      sendNotification({
        to: await this.getPushTokens(ticket.username),
        title: `[AÇÃO NECESSÁRIA] OS #${ticket.id} solucionada`,
        body: `Acesse o app para aceitar a solução: "${data.solution}"`,
      });
      sendNotification({
        to: await this.getPushTokens(
          Db.getDepartments()
            .filter((d) => d.isViewOnly())
            .map((d) => d.username)
        ),
        title: `OS #${ticket.id} (${ticket.dpt})`,
        body: `Nova solução disponível: "${data.solution}"`,
      });

      return { error: null };
    } catch (e) {
      return {
        error: {
          title: "Erro ao solucionar a OS",
          description:
            "Um erro inesperado ocorreu. Por favor, entre em contato com o administrador do aplicativo para mais informações.",
        },
      };
    }
  }

  async acceptTicketSolution(
    ticket: Ticket
  ): Promise<{ error: { title: string; description: string } | null }> {
    try {
      await firebase.firestore().collection("tickets").doc(ticket.id).update({
        closedAt: timestamp(),
        status: "closed",
      });

      await this.pushTicketEvents(ticket.id, [
        { type: "solutionAccepted" },
        { type: "ticketClosed" },
      ]);

      sendNotification({
        to: await this.getPushTokens("manutencao"),
        title: `OS #${ticket.id}`,
        body: `OS encerrada pelo solicitante (${ticket.dpt})`,
      });
      sendNotification({
        to: await this.getPushTokens(
          Db.getDepartments()
            .filter((d) => d.isViewOnly())
            .map((d) => d.username)
        ),
        title: `OS #${ticket.id} (${ticket.dpt})`,
        body: `Encerrada pelo solicitante`,
      });

      return { error: null };
    } catch (e) {
      return {
        error: {
          title: "Erro ao encerrar a OS",
          description:
            "Um erro inesperado ocorreu. Por favor, entre em contato com o administrador do aplicativo para mais informações.",
        },
      };
    }
  }

  async refuseTicketSolution(
    ticket: Ticket,
    data: { refusalReason: Exclude<Ticket["refusalReason"], undefined | null> }
  ): Promise<{ error: { title: string; description: string } | null }> {
    try {
      await firebase.firestore().collection("tickets").doc(ticket.id).update({
        status: "pending",
        refusalReason: data.refusalReason,
        acceptedAt: null,
        solvedAt: null,
        reopenedAt: timestamp(),
        priority: null,
        solution: null,
      });

      await this.pushTicketEvents(ticket.id, [
        {
          type: "solutionRefused",
          payload: { refusalReason: data.refusalReason },
        },
        { type: "ticketReopened" },
      ]);

      sendNotification({
        to: await this.getPushTokens("manutencao"),
        title: `[AÇÃO NECESSÁRIA] OS #${ticket.id}`,
        body: `Solução recusada pelo solicitante (${ticket.dpt})`,
      });
      sendNotification({
        to: await this.getPushTokens(
          Db.getDepartments()
            .filter((d) => d.isViewOnly())
            .map((d) => d.username)
        ),
        title: `OS #${ticket.id} (${ticket.dpt})`,
        body: `Solução recusada pelo solicitante; OS retornando para a Manutenção`,
      });

      return { error: null };
    } catch (e) {
      return {
        error: {
          title: "Erro ao recusar a solução da OS",
          description:
            "Um erro inesperado ocorreu. Por favor, entre em contato com o administrador do aplicativo para mais informações.",
        },
      };
    }
  }

  async editTicketPriority(
    ticketId: Ticket["id"],
    data: { priority: Exclude<Ticket["priority"], undefined | null> }
  ): Promise<{ error: { title: string; description: string } | null }> {
    try {
      const ticket = await firebase
        .firestore()
        .collection("tickets")
        .doc(ticketId)
        .get();

      await ticket.ref.update({ priority: data.priority });

      await this.pushTicketEvents(ticketId, {
        type: "priorityChanged",
        payload: { priority: data.priority },
      });

      sendNotification({
        to: await this.getPushTokens(ticket.data()!.username),
        title: `OS #${ticketId}`,
        body: `Prioridade da OS redefinida: ${translatePriority(
          ticket.data()!.priority
        )} -> ${translatePriority(data.priority)}`,
      });
      sendNotification({
        to: await this.getPushTokens(
          Db.getDepartments()
            .filter((d) => d.isViewOnly())
            .map((d) => d.username)
        ),
        title: `OS #${ticketId} (${ticket.data()!.dpt})`,
        body: `Prioridade redefinida pela Manutenção:  ${translatePriority(
          ticket.data()!.priority
        )} -> ${translatePriority(data.priority)}`,
      });

      return { error: null };
    } catch (e) {
      return {
        error: {
          title: "Erro ao redefinir prioridade",
          description:
            "Um erro inesperado ocorreu. Por favor, entre em contato com o administrador do aplicativo para mais informações.",
        },
      };
    }
  }

  async editTicket(
    editedTicket: Pick<
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
    >
  ): Promise<{ error: { title: string; description: string } | null }> {
    try {
      const ticketDoc = await firebase
        .firestore()
        .collection("tickets")
        .doc(editedTicket.id)
        .get();
      const ticketData = ticketDoc.data() as Ticket;

      const changes = getTicketChanges(editedTicket, ticketData);

      await ticketDoc.ref.update(editedTicket);

      await this.pushTicketEvents(ticketData.id, {
        type: "ticketEdited",
        payload: { changes },
      });

      sendNotification({
        to: await this.getPushTokens("manutencao"),
        title: `OS #${ticketData.id}`,
        body: `ATENÇÃO: OS editada pelo solicitante (${ticketData.dpt})}`,
      });
      sendNotification({
        to: await this.getPushTokens(
          Db.getDepartments()
            .filter((d) => d.isViewOnly())
            .map((d) => d.username)
        ),
        title: `OS #${ticketData.id} (${ticketData.dpt})`,
        body: `OS editada pelo solicitante`,
      });

      return { error: null };
    } catch (e) {
      return {
        error: {
          title: "Erro ao editar OS",
          description:
            "Um erro inesperado ocorreu. Por favor, entre em contato com o administrador do aplicativo para mais informações.",
        },
      };
    }
  }

  async pokeDepartment(config: {
    from: Department;
    to: Department;
    ticket: Ticket;
  }): Promise<{ error: { title: string; description: string } | null }> {
    try {
      await this.pushTicketEvents(config.ticket.id, {
        type: "poke",
        payload: {
          poke: { from: config.from.username, to: config.to.username },
        },
      });

      sendNotification({
        to: await this.getPushTokens(config.to.username),
        title: `[!] OS #${config.ticket.id}`,
        body: `O ${config.from.isViewOnly() ? "usuário" : "setor"} "${
          config.from.displayName
        }" cutucou você – agilize sua parte da OS`,
      });
      sendNotification({
        to: await this.getPushTokens(
          Db.getDepartments()
            .filter(
              (d) => d.isViewOnly() && d.username !== config.from.username
            )
            .map((d) => d.username)
        ),
        title: `OS #${config.ticket.id} (${config.ticket.dpt})`,
        body: `O ${config.from.isViewOnly() ? "usuário" : "setor"} "${
          config.from.displayName
        }" cutucou "${config.to.displayName}"`,
      });

      return { error: null };
    } catch (e) {
      return {
        error: {
          title: `Erro ao notificar "${config.to.displayName}"`,
          description:
            "Um erro inesperado ocorreu. Por favor, entre em contato com o administrador do aplicativo para mais informações.",
        },
      };
    }
  }

  buildTicketEvent<T extends Ticket["events"][0]["type"]>(
    type: T,
    payload?: Ticket["events"][0]["payload"]
  ): Ticket["events"][0] {
    return {
      id: uuid.v4() as string,
      type,
      timestamp: timestamp(),
      device: {
        name: Device.deviceName,
        model: Device.modelName,
        os: { name: Device.osName, version: Device.osVersion },
      },
      payload: payload ? payload : null,
    };
  }

  async pushTicketEvents(
    ticketId: Ticket["id"],
    events:
      | {
          type: Ticket["events"][0]["type"];
          payload?: Ticket["events"][0]["payload"];
        }
      | {
          type: Ticket["events"][0]["type"];
          payload?: Ticket["events"][0]["payload"];
        }[]
  ) {
    if (!Array.isArray(events)) {
      events = [events];
    }

    const newEvents = events.map((e) =>
      this.buildTicketEvent(e.type, e.payload)
    );
    const registeredEvents = (
      await this.collection("tickets").doc(ticketId).get()
    ).data()!.events as Ticket["events"] | undefined | null;

    await this.collection("tickets")
      .doc(ticketId)
      .update({
        events: registeredEvents
          ? [...registeredEvents, ...newEvents]
          : newEvents,
      });
  }

  checkTicketUrgency(ticket: Ticket, department: Department) {
    if (department.isMaintenance()) {
      return ["pending", "solving"].includes(ticket.status);
    } else if (department.isOperator()) {
      return ticket.status === "solved";
    } else {
      return ["pending", "solving", "solved"].includes(ticket.status);
    }
  }

  async getPushTokens(
    usernamesOrGetter:
      | string
      | string[]
      | (() => string | string[] | Promise<string | string[]>)
  ): Promise<string[]> {
    let usernames: string[] = [];
    if (typeof usernamesOrGetter === "string") {
      usernames = [usernamesOrGetter];
    } else if (Array.isArray(usernamesOrGetter)) {
      usernames = [...usernamesOrGetter];
    } else {
      const getterRes = await usernamesOrGetter();
      if (typeof getterRes === "string") {
        usernames = [getterRes];
      } else {
        usernames = getterRes;
      }
    }

    const docs = await Promise.all(
      usernames.map((uname) =>
        firebase.firestore().collection("push-tokens").doc(uname).get()
      )
    );

    let pushTokens: string[] = [];
    docs.forEach((doc) => {
      if (doc.exists) {
        pushTokens = [...pushTokens, ...doc.data()!.tokens];
      }
    });

    return pushTokens;
  }

  registerRefreshTicketsListener(department: Department) {
    const collection = firebase.firestore().collection("tickets");

    const query = department.isMaintenance()
      ? collection
      : collection.where("username", "==", department.username);

    query.onSnapshot(async (_) => {
      store.dispatch(setDataLoading(true));
      const tickets = await this.getTickets(department);
      store.dispatch(setTickets(tickets));
      store.dispatch(setDataLoading(false));
    });
  }
}

export default FbFirestore;
