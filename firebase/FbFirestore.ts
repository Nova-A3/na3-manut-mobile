import * as Notifications from "expo-notifications";
import firebase from "firebase/app";
import "firebase/firestore";
import store from "../store";
import { setDataLoading, setTickets } from "../store/actions";
import { Department, Ticket } from "../types";
import { sendNotification, timestamp, translatePriority } from "../utils";

class FbFirestore {
  async getTickets(department: Department): Promise<Ticket[]> {
    const collection = firebase.firestore().collection("tickets");

    const query = department.isMaintenance()
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
    const ticket: Ticket = {
      ...data,
      id,
      createdAt: timestamp(),
      status: "pending",
    };

    await firebase.firestore().collection("tickets").doc(id).set(ticket);

    await sendNotification({
      to: await this.getPushTokens("manutencao"),
      title: `[AÇÃO NECESSÁRIA] Nova OS – nº ${ticket.id}`,
      body: `Acesse o app para aceitar: "${ticket.description}".`,
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

      await sendNotification({
        to: await this.getPushTokens(ticket.username),
        title: `OS #${ticket.id}`,
        body: `A OS foi reconhecida pela Manutenção e já está sendo resolvida. Prioridade definida: ${translatePriority(
          data.priority
        )}.`,
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
    data: { solution: Exclude<Ticket["solution"], undefined> }
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

      await sendNotification({
        to: await this.getPushTokens(ticket.username),
        title: `[AÇÃO NECESSÁRIA] OS #${ticket.id} solucionada`,
        body: `Acesse o app para aceitar a solução: "${data.solution}".`,
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

      await sendNotification({
        to: await this.getPushTokens("manutencao"),
        title: `OS #${ticket.id}`,
        body: `OS encerrada pelo solicitante (${ticket.dpt}).`,
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

  checkTicketUrgency(ticket: Ticket, department: Department) {
    if (department.isMaintenance()) {
      return ["pending", "solving"].includes(ticket.status);
    } else {
      return ticket.status === "solved";
    }
  }

  async getPushTokens(username: string): Promise<string[]> {
    const doc = await firebase
      .firestore()
      .collection("push-tokens")
      .doc(username)
      .get();

    if (!doc.exists) {
      return [];
    }

    return doc.data()!.tokens;
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
