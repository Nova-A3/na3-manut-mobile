import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

type ProjectCardInfoProps = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  italic?: boolean;
};

const ProjectCardInfo: React.FC<ProjectCardInfoProps> = ({
  icon,
  italic,
  children,
}) => {
  return (
    <View style={styles.infoItem}>
      <Ionicons name={icon} size={18} color="#444" />
      <Text style={[styles.infoItemText, italic && styles.italic]}>
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  infoItem: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginRight: 15,
  },
  infoItemText: {
    marginLeft: 6,
  },
  italic: {
    fontStyle: "italic",
  },
});

export default ProjectCardInfo;
