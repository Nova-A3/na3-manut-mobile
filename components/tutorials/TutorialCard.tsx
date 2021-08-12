import { Ionicons } from "@expo/vector-icons";
import * as Random from "expo-random";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import firebase from "firebase";
import moment from "moment";
import "moment/locale/pt-br";
import * as React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  ActivityIndicator,
  Badge,
  Subheading,
  Text,
  Title,
} from "react-native-paper";
import { COLORS } from "../../constants";
import { useFlashMessage } from "../../hooks";
import { Department, DeviceTutorial, TutorialView } from "../../types";
import { systemColor, translateAccountType } from "../../utils";

type TutorialCardProps = {
  tutorial: DeviceTutorial;
  user: Department;
};

const TutorialCard: React.FC<TutorialCardProps> = ({ tutorial, user }) => {
  const msg = useFlashMessage();
  const [forceWatched, setForceWatched] = React.useState<boolean>();

  let targetsText: string | undefined = undefined;
  if (tutorial.targets.length === 1) {
    targetsText = `${translateAccountType(tutorial.targets[0]!)}`;
  } else if (tutorial.targets.length > 1) {
    targetsText = `${tutorial.targets
      .map((tgt) => translateAccountType(tgt))
      .join(" • ")}`;
  }

  const videoDuration = moment.duration(tutorial.durationMs, "ms");

  const watched = React.useMemo(
    () => (forceWatched !== undefined ? forceWatched : tutorial.watched),
    [forceWatched, tutorial.watched]
  );

  const handlePress = async () => {
    const openBrowser = () => WebBrowser.openBrowserAsync(tutorial.url);

    if (watched) {
      openBrowser();
      return;
    }

    const startTime = moment();
    await openBrowser();
    const endTime = moment();
    const timeInBrowser = moment.duration(endTime.diff(startTime));

    if (timeInBrowser.asMilliseconds() > tutorial.durationMs * 0.8) {
      msg.show({
        type: "success",
        title: "Tutorial assistido",
        text: `Sua visualização ao tutorial "${tutorial.title}" foi registrada com sucesso!`,
        duration: 3200,
      });

      setForceWatched(true);

      const deviceId = await SecureStore.getItemAsync("device_id");
      if (!deviceId) {
        await SecureStore.setItemAsync(
          "device_id",
          Random.getRandomBytes(16).join("")
        );
      }

      const view: TutorialView = {
        department: user.username,
        deviceId: deviceId!,
        timestamp: firebase.firestore.Timestamp.fromDate(startTime.toDate()),
      };

      await firebase
        .firestore()
        .collection("manut-tutorials")
        .doc(tutorial.id)
        .update({
          views: firebase.firestore.FieldValue.arrayUnion(view),
        });
    } else {
      msg.show({
        type: "danger",
        title: "Tutorial encerrado pelo usuário",
        text: `Você fechou o tutorial "${tutorial.title}" cedo demais.`,
        duration: 3200,
      });
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.4}
      onPress={handlePress}
    >
      <View style={styles.imgLoading}>
        <ActivityIndicator color={systemColor("primary")} />
      </View>
      <Image style={styles.thumbnail} source={{ uri: tutorial.thumbnail }} />

      <View style={styles.infoContainer}>
        <Title style={styles.title}>{tutorial.title}</Title>
        {targetsText && (
          <Subheading style={styles.targets}>{targetsText}</Subheading>
        )}

        <View style={styles.info}>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" />
            <Text style={styles.infoText}>
              {`${videoDuration.minutes()}m${videoDuration.seconds()}s`}
            </Text>
          </View>
        </View>

        <Badge
          style={[
            styles.watchedBadge,
            {
              backgroundColor: watched
                ? COLORS.SYSTEM.GREEN
                : COLORS.SYSTEM.GRAY,
            },
          ]}
        >
          {watched ? "ASSISTIDO" : "NÃO ASSISTIDO"}
        </Badge>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    display: "flex",
    flexDirection: "row",
    borderRadius: 12,
    backgroundColor: "white",
  },
  thumbnail: {
    height: 85,
    width: 85,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  imgLoading: {
    position: "absolute",
    height: 85,
    width: 85,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    backgroundColor: "#eee",
    justifyContent: "center",
  },
  infoContainer: {
    flexGrow: 1,
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  title: {
    fontSize: 19,
    lineHeight: 19,
  },
  targets: {
    margin: 0,
    fontStyle: "italic",
    lineHeight: 13,
    fontSize: 13,
  },
  info: {
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "center",
    marginTop: -5,
    paddingLeft: 8,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    marginLeft: 3,
  },
  watchedBadge: {
    position: "absolute",
    top: 8,
    right: 12,
    paddingHorizontal: 8,
    color: "white",
    fontWeight: "bold",
  },
});

export default TutorialCard;
