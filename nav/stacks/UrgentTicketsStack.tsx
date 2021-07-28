import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import {
  TicketDetailsScreen,
  TicketEditScreen,
  TicketStatsScreen,
  TicketTimelineScreen,
  UrgentTicketsScreen,
} from "../../screens";
import { UrgentTicketsStackParamList } from "../../types";

const Stack = createStackNavigator<UrgentTicketsStackParamList>();

const UrgentTicketsStack: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="urgentTicketsHome"
        component={UrgentTicketsScreen}
        options={{
          headerTitle: "OS Urgentes",
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
    </Stack.Navigator>
  );
};

export default UrgentTicketsStack;
