import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";
import React from "react";
import FlashMessage from "react-native-flash-message";
import { Provider as PaperProvider } from "react-native-paper";
import { OverflowMenuProvider } from "react-navigation-header-buttons";
import { Provider } from "react-redux";
import { GlobalLoading } from "./components";
import Firebase from "./firebase";
import { useDepartment } from "./hooks";
import { AuthNav, MainNav, SuperNav, ViewOnlyNav } from "./nav";
import { LoadingScreen } from "./screens";
import store from "./store";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

Firebase.init();

const UI: React.FC = () => {
  return (
    <>
      <StatusBar style="auto" />
      <GlobalLoading />
      <FlashMessage position="top" />
    </>
  );
};

const App: React.FC = () => {
  const department = useDepartment();

  let Content: React.FC;

  if (department === undefined) {
    Content = () => <LoadingScreen />;
  } else if (department === null) {
    Content = () => <AuthNav />;
  } else if (department.isMaintenance()) {
    Content = () => <SuperNav />;
  } else if (department.isViewOnly()) {
    Content = () => <ViewOnlyNav />;
  } else {
    Content = () => <MainNav />;
  }

  return <Content />;
};

const Main: React.FC = () => {
  return (
    <OverflowMenuProvider spaceAboveMenu={70}>
      <Provider store={store}>
        <PaperProvider>
          <App />
          <UI />
        </PaperProvider>
      </Provider>
    </OverflowMenuProvider>
  );
};

export default Main;
