import * as React from "react";
import { useDispatch } from "react-redux";
import Firebase from "../firebase";
import {
  registerDataFirstLoad,
  setDataLoading,
  setTickets,
} from "../store/actions";
import { Ticket } from "../types";
import useDepartment from "./useDepartment";
import useFlashMessage from "./useFlashMessage";
import useStateSlice from "./useStateSlice";

const useTickets = (
  filterStatus?: Ticket["status"] | ((ticket: Ticket) => boolean)
) => {
  const { tickets, loading, didFirstLoad } = useStateSlice("data");
  const department = useDepartment()!;
  const dispatch = useDispatch();
  const msg = useFlashMessage();

  const loadTickets = React.useCallback(async () => {
    dispatch(setDataLoading(true));

    try {
      const tickets = await Firebase.Firestore.getTickets(department);
      dispatch(setTickets(tickets));
    } catch (e) {
      msg.show({
        type: "warning",
        title: "Não foi possível carregar suas OS",
        text: "Um erro inesperado ocorreu. Contacte o administrador do aplicativo.",
      });
    }

    if (!didFirstLoad) {
      dispatch(registerDataFirstLoad());
    }
    dispatch(setDataLoading(false));
  }, []);

  return {
    tickets: filterStatus
      ? typeof filterStatus === "string"
        ? tickets.filter((ticket) => ticket.status === filterStatus)
        : tickets.filter(filterStatus)
      : tickets,
    loadTickets,
    loading,
  };
};

export default useTickets;
