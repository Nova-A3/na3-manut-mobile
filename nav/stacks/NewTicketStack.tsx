import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { NewTicketFormScreen, NewTicketHomeScreen } from "../../screens";
import { NewTicketStackParamList } from "../../types";

const Stack = createStackNavigator<NewTicketStackParamList>();

const NewTicketStack: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="newTicketHome"
        component={NewTicketHomeScreen}
        options={{
          headerTitle: "Nova OS",
        }}
      />
      <Stack.Screen
        name="newTicketForm"
        component={NewTicketFormScreen}
        options={{
          headerTitle: "Abrir OS",
        }}
      />
    </Stack.Navigator>
  );
};

export default NewTicketStack;
