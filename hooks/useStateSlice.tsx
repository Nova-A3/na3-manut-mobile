import { useSelector } from "react-redux";
import { RootState } from "../types";

const useStateSlice = <T extends keyof RootState>(slice: T): RootState[T] => {
  const _slice = useSelector<RootState, RootState[T]>((state) => state[slice]);

  return _slice;
};

export default useStateSlice;
