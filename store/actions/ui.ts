import { UIActionGlobalLoadingOff, UIActionGlobalLoadingOn } from "../../types";

export const globalLoadingOn = (
  text?: UIActionGlobalLoadingOn["payload"]["text"]
): UIActionGlobalLoadingOn => {
  return {
    type: "GLOBAL_LOADING_ON",
    payload: { text },
  };
};

export const globalLoadingOff = (): UIActionGlobalLoadingOff => {
  return {
    type: "GLOBAL_LOADING_OFF",
  };
};
