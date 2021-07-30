import * as React from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { systemColor } from "../../utils";

type DataLoadingProps = {
  show: boolean;
};

const DataLoading: React.FC<DataLoadingProps> = ({ show }) => {
  if (show) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loading}>
          <ActivityIndicator color={systemColor("primary")} />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </View>
    );
  } else {
    return <></>;
  }
};

const styles = StyleSheet.create({
  loadingContainer: {
    position: "absolute",
    left: 20,
    bottom: 30,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  loading: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 30,
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
  loadingText: {
    marginLeft: 12,
  },
});

export default DataLoading;
