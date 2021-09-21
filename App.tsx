import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";
import * as Updates from "expo-updates";
import React from "react";
import { Alert } from "react-native";
import FlashMessage from "react-native-flash-message";
import { Provider as PaperProvider } from "react-native-paper";
import { OverflowMenuProvider } from "react-navigation-header-buttons";
import { Provider } from "react-redux";
import * as Sentry from "sentry-expo";
import { GlobalLoading } from "./components";
import Firebase from "./firebase";
import { useDepartment } from "./hooks";
import { AuthNav, MainNav, SuperNav, ViewOnlyNav } from "./nav";
import { LoadingScreen } from "./screens";
import store from "./store";

Sentry.init({
  dsn: "https://f9d6033271b24ef3b46efcfe89d887a9@o1008778.ingest.sentry.io/5972787",
  enableInExpoDevelopment: true,
  debug: false, // Sentry will try to print out useful debugging information if something goes wrong with sending an event. Set this to `false` in production.
});

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

Updates.addListener((ev) => {
  if (ev.type === Updates.UpdateEventType.UPDATE_AVAILABLE) {
    Alert.alert("Nova versão disponível", 'Pressione "OK" para atualizar');
    Updates.reloadAsync();
  }
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
