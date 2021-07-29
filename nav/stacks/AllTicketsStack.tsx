import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { useDepartment } from "../../hooks";
import {
  AllTicketsHomeScreen,
  FiltersHomeScreen,
  FiltersSelectScreen,
  ReportsScreen,
  TicketDetailsScreen,
  TicketEditScreen,
  TicketStatsScreen,
  TicketTimelineScreen,
} from "../../screens";
import { AllTicketsStackParamList } from "../../types";

const Stack = createStackNavigator<AllTicketsStackParamList>();

const AllTicketsStack: React.FC = () => {
  const dpt = useDepartment();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="allTicketsHome"
        component={AllTicketsHomeScreen}
        options={{
          headerTitle: dpt?.type === "operator" ? "Minhas OS" : "Todas as OS",
        }}
      />

      <Stack.Screen
        name="filterTickets"
        component={FiltersHomeScreen}
        options={{
          headerTitle: "Filtrar OS",
        }}
      />
      <Stack.Screen
        name="filterSelect"
        component={FiltersSelectScreen}
        options={{
          headerTitle: "Filtrar OS",
        }}
      />

      <Stack.Screen
        name="ticketDetails"
        component={TicketDetailsScreen}
        options={({ route }) => ({
          headerTitle: `OS #${route.params?.ticket.id}`,
        })}
      />
      <Stack.Screen
        name="ticketTimeline"
        component={TicketTimelineScreen}
        options={{
          headerTitle: "Histórico",
        }}
      />
      <Stack.Screen
        name="ticketStats"
        component={TicketStatsScreen}
        options={{
          headerTitle: "Estatísticas",
        }}
      />
      <Stack.Screen
        name="ticketEdit"
        component={TicketEditScreen}
        options={{
          headerTitle: "Editar",
        }}
      />

      <Stack.Screen
        name="reportsHome"
        component={ReportsScreen}
        options={{
          headerTitle: "Relatórios",
        }}
      />
    </Stack.Navigator>
  );
};

export default AllTicketsStack;
