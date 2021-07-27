import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { useDepartment } from "../../hooks";
import {
  AllTicketsHomeScreen,
  TicketDetailsScreen,
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

export default AllTicketsStack;
