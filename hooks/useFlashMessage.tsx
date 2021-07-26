import { showMessage } from "react-native-flash-message";

const useFlashMessage = () => {
  const show = (data: {
    type: "success" | "warning" | "danger";
    title: string;
    text: string;
  }) => {
    showMessage({
      type: data.type,
      message: data.title,
      description: data.text,
      autoHide: true,
      hideStatusBar: true,
    });
  };

  return { show };
};

export default useFlashMessage;
