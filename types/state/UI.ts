export type UIState = {
  isGlobalLoading: boolean;
  globalLoadingText: string;
};

export type UIActionGlobalLoadingOn = {
  type: "GLOBAL_LOADING_ON";
  payload: { text?: string };
};

export type UIActionGlobalLoadingOff = {
  type: "GLOBAL_LOADING_OFF";
};

export type UIAction = UIActionGlobalLoadingOn | UIActionGlobalLoadingOff;
