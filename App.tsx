import * as Notifications from "expo-notifications";
import * as Random from "expo-random";
import * as SecureStore from "expo-secure-store";
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

const isAndroid = require("react-native").Platform.OS === "android";
// @ts-ignore
const isHermesEnabled = !!global.HermesInternal;

if (isHermesEnabled || isAndroid) {
  require("@formatjs/intl-getcanonicallocales/polyfill");
  require("@formatjs/intl-locale/polyfill");
  require("@formatjs/intl-pluralrules/polyfill");
  require("@formatjs/intl-pluralrules/locale-data/pt.js");
  require("@formatjs/intl-displaynames/polyfill");
  require("@formatjs/intl-displaynames/locale-data/pt.js");
  require("@formatjs/intl-listformat/polyfill");
  require("@formatjs/intl-listformat/locale-data/pt.js");
  require("@formatjs/intl-numberformat/polyfill");
  require("@formatjs/intl-numberformat/locale-data/pt.js");
  require("@formatjs/intl-relativetimeformat/polyfill");
  require("@formatjs/intl-relativetimeformat/locale-data/pt.js");
  require("@formatjs/intl-datetimeformat/polyfill");
  require("@formatjs/intl-datetimeformat/locale-data/pt.js");

  require("@formatjs/intl-datetimeformat/add-all-tz.js");

  if ("__setDefaultTimeZone" in Intl.DateTimeFormat) {
    // @ts-ignore
    Intl.DateTimeFormat.__setDefaultTimeZone("America/Sao_Paulo");
  }
}

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

  const generateDeviceId = async () => {
    if (await SecureStore.getItemAsync("device_id")) {
      return;
    }
    const generatedDeviceId = Random.getRandomBytes(16).join("");
    SecureStore.setItemAsync("device_id", generatedDeviceId);
  };

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

  React.useEffect(() => {
    generateDeviceId();
  }, []);

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
