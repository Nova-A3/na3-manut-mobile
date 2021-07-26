import * as React from "react";
import { StyleSheet } from "react-native";
import { Divider, Subheading } from "react-native-paper";

type HeaderProps = {
  title: string;
};

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <>
      <Subheading>{title}</Subheading>
      <Divider style={styles.divider} />
    </>
  );
};

const styles = StyleSheet.create({
  divider: {
    marginBottom: 12,
    backgroundColor: "#333",
  },
});

export default Header;
