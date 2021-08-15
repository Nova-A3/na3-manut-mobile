import { useDispatch } from "react-redux";
import { InternalProjects } from "../classes";
import {
  registerDataFirstLoad,
  setDataLoading,
  setProjects,
} from "../store/actions";
import useFlashMessage from "./useFlashMessage";
import useStateSlice from "./useStateSlice";

const useProjects = () => {
  const { projects, loading, didFirstLoad } = useStateSlice("data");
  const dispatch = useDispatch();
  const msg = useFlashMessage();

  const loadProjects = async () => {
    dispatch(setDataLoading(true));

    try {
      const projects = await InternalProjects.fetchAll();
      dispatch(setProjects(projects));
    } catch (e) {
      msg.show({
        type: "warning",
        title: "Não foi possível carregar os projetos internos",
        text: "Um erro inesperado ocorreu. Contacte o administrador do aplicativo.",
      });
    }

    if (!didFirstLoad) {
      dispatch(registerDataFirstLoad());
    }
    dispatch(setDataLoading(false));
  };

  return {
    projects,
    loadProjects,
    loading,
  };
};

export default useProjects;
