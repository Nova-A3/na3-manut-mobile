import { useDispatch } from "react-redux";
import { globalLoadingOff, globalLoadingOn } from "../store/actions";
import useStateSlice from "./useStateSlice";

const useGlobalLoading = () => {
  const { isGlobalLoading } = useStateSlice("ui");

  const dispatch = useDispatch();

  const setGlobalLoading = (value: boolean, text?: string): void => {
    if (value) {
      dispatch(globalLoadingOn(text));
    } else {
      dispatch(globalLoadingOff());
    }
  };

  async function execGlobalLoading<T>(cb: () => T | Promise<T>): Promise<T> {
    setGlobalLoading(true);
    try {
      return await cb();
    } finally {
      setGlobalLoading(false);
    }
  }

  return { isGlobalLoading, setGlobalLoading, execGlobalLoading };
};

export default useGlobalLoading;
