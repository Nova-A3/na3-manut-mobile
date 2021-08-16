import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import * as React from "react";
import Firebase from "../firebase";
import { useDepartment, useTickets } from "../hooks";
import { AccountStack, AllTicketsStack, InternalProjectsStack } from "./stacks";

const Tabs = createBottomTabNavigator();

const ViewOnlyNav: React.FC = () => {
  const department = useDepartment()!;
  const { tickets } = useTickets((ticket) =>
    Firebase.Firestore.checkTicketUrgency(ticket, department)
  );

  return (
    <NavigationContainer>
      <Tabs.Navigator initialRouteName="allTicketsTab">
        <Tabs.Screen
          name="internalProjectsTab"
          component={InternalProjectsStack}
          options={{
            tabBarLabel: "Projetos",
            tabBarIcon: ({ focused, color, size }) => {
              return focused ? (
                <Ionicons name="build" size={size} color={color} />
              ) : (
                <Ionicons name="build-outline" size={size} color={color} />
              );
            },
          }}
        />

        <Tabs.Screen
          name="allTicketsTab"
          component={AllTicketsStack}
          options={{
            tabBarLabel: "Todas as OS",
            tabBarIcon: ({ focused, color, size }) => {
              return focused ? (
                <Ionicons name="list" size={size} color={color} />
              ) : (
                <Ionicons name="list-outline" size={size} color={color} />
              );
            },
            tabBarBadge: tickets.length > 0 ? tickets.length : undefined,
          }}
        />

        <Tabs.Screen
          name="accountTab"
          component={AccountStack}
          options={{
            tabBarLabel: "Conta",
            tabBarIcon: ({ focused, color, size }) => {
              return focused ? (
                <Ionicons name="person-circle" size={size} color={color} />
              ) : (
                <Ionicons
                  name="person-circle-outline"
                  size={size}
                  color={color}
                />
              );
            },
          }}
        />
      </Tabs.Navigator>
    </NavigationContainer>
  );
};

export default ViewOnlyNav;
