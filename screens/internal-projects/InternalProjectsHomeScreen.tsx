import { Ionicons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import * as React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Button, Subheading } from "react-native-paper";
import { HeaderButton, ProjectCard } from "../../components";
import { useDepartment, useProjects } from "../../hooks";
import { FsInternalProject, InternalProjectsStackParamList } from "../../types";
import { systemColor } from "../../utils";

const InternalProjectsHomeScreen: React.FC = () => {
  const department = useDepartment()!;
  const { projects, loadProjects, loading } = useProjects();
  const nav =
    useNavigation<
      NavigationProp<InternalProjectsStackParamList, "internalProjectsHome">
    >();

  const onRefresh = () => {
    loadProjects();
  };

  const onNavigateToNewProject = React.useCallback(() => {
    nav.navigate("internalProjectsNewForm", { editing: false });
  }, [nav]);

  const navigateToProjectDetails = React.useCallback(
    (project: FsInternalProject) => {
      nav.navigate("internalProjectDetails", { project });
    },
    [nav]
  );

  React.useEffect(() => {
    loadProjects();
  }, []);

  React.useLayoutEffect(() => {
    if (department.isMaintenance()) {
      nav.setOptions({
        headerRight: () => (
          <HeaderButton
            icon="add-circle-outline"
            title="Novo projeto"
            onPress={onNavigateToNewProject}
          />
        ),
      });
    }
  }, [nav, onNavigateToNewProject]);

  return (
    <View style={styles.container}>
      <FlatList
        data={projects}
        renderItem={({ item }) => (
          <ProjectCard
            project={item}
            onPress={() => navigateToProjectDetails(item)}
            containerStyle={styles.projectCard}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="file-tray-outline" size={50} color="#333" />
            <Subheading style={styles.emptyText}>
              Nenhum projeto encontrado
            </Subheading>
            {department.isMaintenance() && (
              <Button
                mode="text"
                style={styles.emptyBtn}
                color={systemColor("primary")}
                onPress={onNavigateToNewProject}
              >
                Novo projeto
              </Button>
            )}
          </View>
        }
        ItemSeparatorComponent={() => (
          <View style={styles.listSeparator}></View>
        )}
        ListHeaderComponent={
          projects.length > 0
            ? () => <View style={styles.listHeaderFooter} />
            : null
        }
        ListFooterComponent={
          projects.length > 0
            ? () => <View style={styles.listHeaderFooter} />
            : null
        }
        refreshing={loading}
        onRefresh={onRefresh}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  projectCard: {
    marginHorizontal: 20,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  emptyText: {
    fontStyle: "italic",
    marginTop: 30,
  },
  emptyBtn: {
    marginTop: 15,
  },
  listSeparator: {
    height: 15,
  },
  listHeaderFooter: {
    height: 20,
  },
});

export default InternalProjectsHomeScreen;
