import { useDispatch } from "react-redux";
import { globalLoadingOff, globalLoadingOn } from "../store/actions";
import useStateSlice from "./useStateSlice";

const useGlobalLoading = (): [
  boolean,
  (value: boolean, text?: string) => void
] => {
  const { isGlobalLoading } = useStateSlice("ui");
  const dispatch = useDispatch();

  const setGlobalLoading = (value: boolean, text?: string): void => {
    if (value) {
      dispatch(globalLoadingOn(text));
    } else {
      dispatch(globalLoadingOff());
    }
  };

  return [isGlobalLoading, setGlobalLoading];
};

export default useGlobalLoading;
