import { showMessage } from "react-native-flash-message";

const useFlashMessage = () => {
  const show = (data: {
    type: "success" | "warning" | "danger";
    title: string;
    text: string;
    duration?: number;
  }) => {
    showMessage({
      type: data.type,
      message: data.title,
      description: data.text,
      autoHide: true,
      hideStatusBar: true,
      duration: data.duration ? data.duration : 1850,
    });
  };

  return { show };
};

export default useFlashMessage;
