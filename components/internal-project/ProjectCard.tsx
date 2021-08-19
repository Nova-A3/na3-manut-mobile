import { FontAwesome } from "@expo/vector-icons";
import * as React from "react";
import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import { Badge, Caption, Subheading, Text, Title } from "react-native-paper";
import { InternalProjects } from "../../classes";
import { FsInternalProject } from "../../types";
import ProjectCardInfo from "./ProjectCardInfo";

type ProjectCardProps = {
  project: FsInternalProject;
  onPress: () => void;
  containerStyle?: ViewStyle;
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onPress,
  containerStyle,
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, containerStyle]}
      activeOpacity={0.4}
      onPress={onPress}
    >
      <View>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.projectId}>
              {InternalProjects.formatId(project)}
            </Text>

            <Badge
              style={{
                ...styles.badge,
              }}
            >
              PROJETO
            </Badge>
          </View>

          <View style={styles.statusContainer}>
            <FontAwesome
              name="circle"
              size={18}
              color={InternalProjects.statusColor(project)[0]}
            />
            <Caption style={styles.statusText}>
              {InternalProjects.statusSelect(project, {
                running: "Em execução",
                finished: "Finalizado",
                late: "Atrasado",
              })}
            </Caption>
          </View>
        </View>

        <Title style={styles.title}>{project.title}</Title>
        <Subheading style={styles.description}>
          {project.description}
        </Subheading>

        <View style={styles.infoContainer}>
          <ProjectCardInfo
            icon="create-outline"
            italic={InternalProjects.projectStatus(project) !== "finished"}
          >
            {InternalProjects.projectStatus(project) === "finished"
              ? InternalProjects.formatTimestamp(
                  InternalProjects.getEvents(project, "create")[0]!.timestamp,
                  "DD/MM"
                )
              : InternalProjects.humanizeTimestamp(
                  InternalProjects.getEvents(project, "create")[0]!.timestamp
                )}
          </ProjectCardInfo>

          {InternalProjects.projectStatus(project) === "finished" && (
            <>
              <ProjectCardInfo icon="checkmark-done-outline">
                {InternalProjects.formatTimestamp(
                  InternalProjects.getEvents(project, "complete")[0]!.timestamp,
                  "DD/MM"
                )}
              </ProjectCardInfo>

              <ProjectCardInfo icon="hourglass-outline">
                {InternalProjects.humanizedTimeDiffBetweenEvents(
                  InternalProjects.getEvents(project, "create")[0]!,
                  InternalProjects.getEvents(project, "complete")[0]!
                )}
              </ProjectCardInfo>
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 15,
    borderRadius: 12,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  projectId: {
    fontStyle: "italic",
    color: "#aaa",
  },
  badge: {
    alignSelf: "center",
    paddingHorizontal: 10,
    marginLeft: 12,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    marginLeft: 6,
  },
  title: {
    marginTop: 10,
    lineHeight: 25,
  },
  description: {
    fontStyle: "italic",
    marginBottom: 8,
    lineHeight: 18,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default ProjectCard;
