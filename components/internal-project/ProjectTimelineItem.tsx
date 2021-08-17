import { FontAwesome } from "@expo/vector-icons";
import moment from "moment";
import * as React from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Subheading, Text } from "react-native-paper";
import { Divider } from "react-navigation-header-buttons";
import { InternalProjects } from "../../classes";
import { COLORS } from "../../constants";
import { InternalProject } from "../../types";
import IoniconsIconButton from "../ui/IoniconsIconButton";

type ProjectTimelineItemProps = {
  event: InternalProject["events"][number];
};

const ProjectTimelineItem: React.FC<ProjectTimelineItemProps> = ({
  event: projectEvent,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <View>
          <View style={styles.titleContainer}>
            <View style={styles.circle}>
              <FontAwesome
                name="circle"
                size={22}
                color={
                  projectEvent.type === "create"
                    ? COLORS.SYSTEM.BLUE
                    : projectEvent.type === "status"
                    ? COLORS.SYSTEM.CYAN
                    : projectEvent.type === "complete"
                    ? COLORS.SYSTEM.GREEN
                    : COLORS.SYSTEM.GRAY
                }
              />
            </View>
            <Subheading style={styles.title}>
              {projectEvent.type === "create"
                ? "PROJETO CRIADO"
                : projectEvent.type === "status"
                ? "PROGRESSO"
                : projectEvent.type === "edit"
                ? "PROJETO EDITADO"
                : "PROJETO ENTREGUE"}
            </Subheading>
          </View>

          <Text style={styles.timestamp}>
            {moment(projectEvent.timestamp.toDate()).format(
              "DD/MM/YY HH:mm:ss"
            )}
          </Text>
        </View>

        <View style={styles.btnRow}>
          {projectEvent.type === "status" ? (
            <IoniconsIconButton
              icon="document-text-outline"
              onPress={() => Alert.alert("Progresso", projectEvent.message)}
              style={{ marginRight: 0 }}
            />
          ) : projectEvent.type === "edit" ? (
            <IoniconsIconButton
              icon="document-text-outline"
              onPress={() =>
                Alert.alert(
                  "Alterações",
                  InternalProjects.translateEvent(projectEvent).replace(
                    "Edição:\n",
                    ""
                  )
                )
              }
              style={{ marginRight: 0 }}
            />
          ) : undefined}

          <IoniconsIconButton
            icon="person-outline"
            onPress={() => {
              Alert.alert("Autor", projectEvent.author);
            }}
            style={{ marginRight: 0 }}
          />
        </View>
      </View>

      <Divider style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 15,
  },
  body: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
  },
  circle: {
    width: 30,
  },
  timestamp: {
    fontStyle: "italic",
    marginLeft: 30,
  },
  btnRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  divider: {
    backgroundColor: "#bbb",
    marginLeft: 30,
    marginTop: 10,
  },
});

export default ProjectTimelineItem;
