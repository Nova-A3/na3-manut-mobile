import * as React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

type ScreenContainerProps = {
  children: React.ReactNode;
  style?: ViewStyle;
};

const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  style,
}) => {
  return <View style={[styles.container, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default ScreenContainer;
