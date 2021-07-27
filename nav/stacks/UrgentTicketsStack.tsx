import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import {
  TicketDetailsScreen,
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
    </Stack.Navigator>
  );
};

export default UrgentTicketsStack;
