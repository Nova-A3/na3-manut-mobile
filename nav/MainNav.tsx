import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import * as React from "react";
import Firebase from "../firebase";
import { useDepartment, useTickets } from "../hooks";
import { AccountStack, AllTicketsStack, NewTicketStack } from "./stacks";

const Tabs = createBottomTabNavigator();

const Nav: React.FC = () => {
  const department = useDepartment()!;
  const { tickets } = useTickets((ticket) =>
    Firebase.Firestore.checkTicketUrgency(ticket, department)
  );

  return (
    <NavigationContainer>
      <Tabs.Navigator>
        <Tabs.Screen
          name="allTicketsTab"
          component={AllTicketsStack}
          options={{
            tabBarLabel: "Todas as OS",
            tabBarIcon: ({ focused, color, size }) => {
              return focused ? (
                <Ionicons name="list-circle" size={size} color={color} />
              ) : (
                <Ionicons name="list" size={size} color={color} />
              );
            },
            tabBarBadge: tickets.length > 0 ? tickets.length : undefined,
          }}
        />

        <Tabs.Screen
          name="newTicketTab"
          component={NewTicketStack}
          options={{
            tabBarLabel: "Nova OS",
            tabBarIcon: ({ focused, color, size }) => {
              return focused ? (
                <Ionicons name="add-circle" size={size} color={color} />
              ) : (
                <Ionicons name="add" size={size} color={color} />
              );
            },
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

export default Nav;
