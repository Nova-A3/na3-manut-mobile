import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { AccountHomeScreen } from "../../screens";
import { AccountStackParamList } from "../../types";

const Stack = createStackNavigator<AccountStackParamList>();

const AccountStack: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="accountHome"
        component={AccountHomeScreen}
        options={{
          headerTitle: "Conta",
        }}
      />
    </Stack.Navigator>
  );
};

export default AccountStack;
