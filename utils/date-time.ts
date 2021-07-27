import moment from "moment-timezone";

export const timestamp = () => {
  return moment().toISOString();
};
