import { useDispatch } from "react-redux";
import {
  filterOff as filterOffAction,
  filterOn as filterOnAction,
  toggleFilter as toggleFilterAction,
} from "../store/actions";
import { DataState } from "../types";
import useStateSlice from "./useStateSlice";

const useFilters = () => {
  const { filters } = useStateSlice("data");

  const dispatch = useDispatch();

  const filterOn = (
    filterKey: keyof DataState["filters"],
    filterValue: string
  ) => {
    dispatch(filterOnAction(filterKey, filterValue));
  };

  const filterOff = (
    filterKey: keyof DataState["filters"],
    filterValue: string
  ) => {
    dispatch(filterOffAction(filterKey, filterValue));
  };

  const toggleFilter = (
    filterKey: keyof DataState["filters"],
    filterValue: string
  ) => {
    dispatch(toggleFilterAction(filterKey, filterValue));
  };

  return { filters, filterOn, filterOff, toggleFilter };
};

export default useFilters;
