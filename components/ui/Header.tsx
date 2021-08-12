import * as React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { Divider, Subheading } from "react-native-paper";

type HeaderProps = {
  title: string;
  style?: ViewStyle;
  noMarginBottom?: boolean;
};

const Header: React.FC<HeaderProps> = ({ title, style, noMarginBottom }) => {
  return (
    <View style={style}>
      <Subheading>{title}</Subheading>
      <Divider
        style={[styles.divider, { marginBottom: noMarginBottom ? 0 : 12 }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  divider: {
    backgroundColor: "#333",
  },
});

export default Header;
