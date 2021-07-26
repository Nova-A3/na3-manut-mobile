import * as React from "react";
import { Keyboard, Pressable, StyleSheet, View } from "react-native";
import { Modal, Portal } from "react-native-paper";
import Header from "./Header";

type FormModalProps = {
  show: boolean;
  onDismiss: () => void;
  title: string;
  footer?: React.ReactNode;
};

const FormModal: React.FC<FormModalProps> = ({
  show,
  onDismiss,
  title,
  footer,
  children,
}) => {
  return (
    <Portal>
      <Modal
        dismissable
        visible={show}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modal}
      >
        <Pressable onPress={Keyboard.dismiss}>
          <View style={styles.body}>
            <Header title={title} />
            {children}
          </View>

          {footer && <View style={styles.footer}>{footer}</View>}
        </Pressable>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "white",
    justifyContent: "space-between",
    borderRadius: 12,
    margin: 40,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  body: {
    padding: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    minHeight: 300,
  },
  footer: {
    padding: 25,
  },
});

export default FormModal;
