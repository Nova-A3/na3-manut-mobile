import moment from "moment";

export const timestamp = () => {
  return moment().toISOString();
};
