import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { AllTicketsHomeScreen, TicketDetailsScreen } from "../../screens";
import { AllTicketsStackParamList } from "../../types";

const Stack = createStackNavigator<AllTicketsStackParamList>();

const AllTicketsStack: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="allTicketsHome"
        component={AllTicketsHomeScreen}
        options={{
          headerTitle: "Todas as OS",
        }}
      />
      <Stack.Screen
        name="ticketDetails"
        component={TicketDetailsScreen}
        options={({ route }) => ({
          headerTitle: `OS #${route.params?.ticket.id}`,
        })}
      />
    </Stack.Navigator>
  );
};

export default AllTicketsStack;
