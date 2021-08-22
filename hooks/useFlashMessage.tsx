import * as Haptics from "expo-haptics";
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
      icon: "auto",
      autoHide: true,
      hideStatusBar: true,
      duration: data.duration ? data.duration : 3000,
    });

    Haptics.notificationAsync(
      data.type === "success"
        ? Haptics.NotificationFeedbackType.Success
        : data.type === "warning"
        ? Haptics.NotificationFeedbackType.Warning
        : Haptics.NotificationFeedbackType.Error
    );
  };

  return { show };
};

export default useFlashMessage;
