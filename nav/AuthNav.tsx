import { NavigationContainer } from "@react-navigation/native";
import * as React from "react";
import SignInStack from "./stacks/SignInStack";

const AuthNav: React.FC = () => {
  return (
    <NavigationContainer>
      <SignInStack />
    </NavigationContainer>
  );
};

export default AuthNav;
