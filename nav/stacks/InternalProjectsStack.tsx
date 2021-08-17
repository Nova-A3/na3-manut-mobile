import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { InternalProjects } from "../../classes";
import {
  InternalProjectDetailsScreen,
  InternalProjectsHomeScreen,
  InternalProjectsNewFormScreen,
  InternalProjectTimelineScreen,
} from "../../screens";
import { InternalProjectsStackParamList } from "../../types";

const Stack = createStackNavigator<InternalProjectsStackParamList>();

const InternalProjectsStack: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="internalProjectsHome"
        component={InternalProjectsHomeScreen}
        options={{
          headerTitle: "Projetos",
        }}
      />
      <Stack.Screen
        name="internalProjectsNewForm"
        component={InternalProjectsNewFormScreen}
        options={({ route }) => ({
          headerTitle: route.params.editing ? "Editar" : "Novo Projeto",
        })}
      />
      <Stack.Screen
        name="internalProjectDetails"
        component={InternalProjectDetailsScreen}
        options={({ route }) => ({
          headerTitle: `${InternalProjects.formatId(route.params.project)}`,
        })}
      />
      <Stack.Screen
        name="internalProjectTimeline"
        component={InternalProjectTimelineScreen}
        options={{
          headerTitle: "Histórico",
        }}
      />
    </Stack.Navigator>
  );
};

export default InternalProjectsStack;
