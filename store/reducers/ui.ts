import { UIAction, UIState } from "../../types";

const initialState: UIState = {
  isGlobalLoading: false,
  globalLoadingText: "Carregando",
};

const uiReducer = (state = initialState, action: UIAction) => {
  switch (action.type) {
    case "GLOBAL_LOADING_ON":
      return {
        ...state,
        isGlobalLoading: true,
        globalLoadingText: action.payload.text
          ? action.payload.text
          : initialState.globalLoadingText,
      };
    case "GLOBAL_LOADING_OFF":
      return {
        ...state,
        isGlobalLoading: false,
        globalLoadingText: initialState.globalLoadingText,
      };
    default:
      return state;
  }
};

export default uiReducer;
