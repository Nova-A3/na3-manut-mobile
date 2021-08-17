import { Ionicons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/core";
import { BarCodeScanner } from "expo-barcode-scanner";
import * as WebBrowser from "expo-web-browser";
import * as React from "react";
import { StyleSheet, View } from "react-native";
import { Snackbar, Subheading, Text } from "react-native-paper";
import { Button } from "../components";
import { AllTicketsStackParamList } from "../types";
import { systemColor } from "../utils";

const ReportsScreen: React.FC = () => {
  const [hasCameraAccess, setHasCameraAccess] = React.useState<boolean | null>(
    null
  );
  const [showScanner, setShowScanner] = React.useState(true);
  const [scan, setScan] = React.useState<
    | Parameters<
        Exclude<
          React.ComponentProps<typeof BarCodeScanner>["onBarCodeScanned"],
          undefined
        >
      >[0]
    | null
  >(null);
  const [browserIsOpen, setBrowserIsOpen] = React.useState(false);

  const nav =
    useNavigation<NavigationProp<AllTicketsStackParamList, "reportsHome">>();

  const isValidQrCode = React.useCallback(() => {
    if (!scan) {
      return null;
    }
    return (
      scan.type === BarCodeScanner.Constants.BarCodeType.qr &&
      scan.data.startsWith("https://manutencao.novaa3.com.br/bi?id=")
    );
  }, [scan]);

  const handleBarCodeScanned: React.ComponentProps<
    typeof BarCodeScanner
  >["onBarCodeScanned"] = React.useCallback((scan) => {
    setScan(scan);
  }, []);

  const handleCloseScanner = () => {
    setShowScanner(false);
    setScan(null);
  };

  React.useEffect(() => {
    (async () => {
      if (scan && isValidQrCode() && !browserIsOpen) {
        setBrowserIsOpen(true);
        await WebBrowser.openBrowserAsync(scan.data);
        setBrowserIsOpen(false);
        nav.navigate("allTicketsHome");
      }
    })();
  }, [scan]);

  React.useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasCameraAccess(status === "granted");
    })();
  }, []);

  if (hasCameraAccess === null) {
    return (
      <View style={styles.failMessageContainer}>
        <View style={styles.failMessageIconContainer}>
          <Ionicons
            name="camera-outline"
            size={50}
            color={systemColor("primary")}
          />
        </View>
        <Subheading style={styles.failMessageText}>
          Solicitando acesso à camera...
        </Subheading>
      </View>
    );
  } else if (hasCameraAccess === false) {
    return (
      <View style={styles.failMessageContainer}>
        <View style={styles.failMessageIconContainer}>
          <Ionicons
            name="close-circle-outline"
            size={50}
            color={systemColor("danger")}
          />
        </View>
        <Subheading style={styles.failMessageText}>
          Você não autorizou o acesso à câmera
        </Subheading>
      </View>
    );
  } else {
    return (
      <>
        <View style={styles.screen}>
          <Button
            label="Escanear QR Code"
            icon="qrcode-scan"
            onPress={() => setShowScanner(true)}
          />
        </View>

        {hasCameraAccess && showScanner && (
          <>
            <BarCodeScanner
              onBarCodeScanned={handleBarCodeScanned}
              style={StyleSheet.absoluteFillObject}
            />

            <Snackbar
              visible
              onDismiss={() => {}}
              action={
                isValidQrCode()
                  ? undefined
                  : {
                      label: "Fechar",
                      color:
                        isValidQrCode() === null
                          ? systemColor("danger")
                          : "white",
                      onPress: handleCloseScanner,
                    }
              }
              style={[
                styles.snackbar,
                isValidQrCode() === true
                  ? { backgroundColor: systemColor("success") }
                  : isValidQrCode() === false
                  ? { backgroundColor: systemColor("danger") }
                  : undefined,
              ]}
            >
              <Text
                style={[
                  styles.snackbarText,
                  isValidQrCode() === true
                    ? { color: "white" }
                    : isValidQrCode() === false
                    ? { color: "white" }
                    : undefined,
                ]}
              >
                {isValidQrCode() === null
                  ? "Aponte para o QR Code no relatório"
                  : isValidQrCode()
                  ? ""
                  : "QR Code inválido"}
              </Text>
            </Snackbar>
          </>
        )}
      </>
    );
  }
};

const styles = StyleSheet.create({
  failMessageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  failMessageIconContainer: {
    marginBottom: 20,
  },
  failMessageText: {
    margin: 0,
    padding: 0,
    textAlign: "center",
  },

  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  qrCode: {
    position: "absolute",
    borderWidth: 2,
    borderColor: systemColor("primary"),
  },
  snackbar: {
    backgroundColor: "white",
    margin: 20,
  },
  snackbarText: {
    color: "#333",
  },
});

export default ReportsScreen;
