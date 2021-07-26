import Database from "../db";
import useStateSlice from "./useStateSlice";

const useDepartment = () => {
  const { department } = useStateSlice("auth");

  if (department) {
    return Database.getDepartment(department.username);
  } else {
    return department;
  }
};

export default useDepartment;
