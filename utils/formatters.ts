import moment from "moment-timezone";
import { Ticket } from "../types";

export const formatTimestamp = (timestamp: string, formatString: string) => {
  return moment(timestamp).tz("America/Sao_Paulo").format(formatString);
};

export const formatDeviceInfo = (
  device: Ticket["events"][0]["device"]
): string => {
  return [device.name, device.model, `${device.os.name} v${device.os.version}`]
    .filter((substring) => substring)
    .join("\n");
};
