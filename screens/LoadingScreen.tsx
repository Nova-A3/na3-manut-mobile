import * as React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";

const LoadingScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ActivityIndicator />
      <View style={styles.textContainer}>
        <Text>Carregando</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  textContainer: {
    marginTop: 15,
  },
});

export default LoadingScreen;
