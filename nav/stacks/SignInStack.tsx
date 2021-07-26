import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { SignInScreen } from "../../screens";
import { SignInStackParamList } from "../../types";

const Stack = createStackNavigator<SignInStackParamList>();

const SignInStack: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="signInHome"
        component={SignInScreen}
        options={{
          headerTitle: "Entrar",
        }}
      />
    </Stack.Navigator>
  );
};

export default SignInStack;
