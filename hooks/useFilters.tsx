import { useDispatch } from "react-redux";
import { toggleFilter as toggleFilterAction } from "../store/actions";
import { DataState } from "../types";
import useStateSlice from "./useStateSlice";

const useFilters = () => {
  const { filters } = useStateSlice("data");

  const dispatch = useDispatch();

  const toggleFilter = (
    filterKey: keyof DataState["filters"],
    filterValue: string
  ) => {
    dispatch(toggleFilterAction(filterKey, filterValue));
  };

  return { filters, toggleFilter };
};

export default useFilters;
