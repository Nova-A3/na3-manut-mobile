import * as React from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Modal, Portal, Text } from "react-native-paper";
import useStateSlice from "../../hooks/useStateSlice";

const GlobalLoading: React.FC = () => {
  const { isGlobalLoading, globalLoadingText } = useStateSlice("ui");

  return (
    <Portal>
      <Modal visible={isGlobalLoading} contentContainerStyle={styles.modal}>
        <View style={styles.contentContainer}>
          <ActivityIndicator />

          <View style={styles.textContainer}>
            <Text>{globalLoadingText}</Text>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  contentContainer: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 12,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  textContainer: {
    marginTop: 20,
  },
});

export default GlobalLoading;
