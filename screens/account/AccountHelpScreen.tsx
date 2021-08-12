import * as Random from "expo-random";
import * as SecureStore from "expo-secure-store";
import firebase from "firebase";
import * as React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Subheading } from "react-native-paper";
import { Header, ScreenContainer, TutorialCard } from "../../components";
import { useDepartment, useGlobalLoading } from "../../hooks";
import { DeviceTutorial, FsTutorial } from "../../types";

const AccountHelpScreen: React.FC = () => {
  const dpt = useDepartment()!;
  const { execGlobalLoading } = useGlobalLoading();
  const [allTutorials, setAllTutorials] = React.useState<DeviceTutorial[]>();

  const fetchAllTutorials = React.useCallback(async () => {
    const allTutorialsSnapshot = await firebase
      .firestore()
      .collection("manut-tutorials")
      .get();
    const allTutorialsData = allTutorialsSnapshot.docs.map(
      (d) => ({ id: d.id, ...d.data() } as FsTutorial)
    );

    const deviceId = await SecureStore.getItemAsync("device_id");
    if (!deviceId) {
      await SecureStore.setItemAsync(
        "device_id",
        Random.getRandomBytes(16).join("")
      );
    }

    const deviceAllTutorials: DeviceTutorial[] = allTutorialsData
      .map((t) => ({
        ...t,
        watched: t.views.some((view) => view.deviceId === deviceId!),
      }))
      .sort((tA) => (tA.watched ? 1 : -1));

    setAllTutorials(deviceAllTutorials);
  }, []);

  React.useEffect(() => {
    execGlobalLoading(fetchAllTutorials);
  }, [fetchAllTutorials]);

  return (
    <ScreenContainer style={styles.screen}>
      <View style={styles.container}>
        <View>
          <Header title="Tutoriais para você" noMarginBottom />
          <FlatList
            data={allTutorials?.filter((t) => t.targets.includes(dpt.type))}
            renderItem={({ item }) => (
              <TutorialCard tutorial={item} user={dpt} key={item.id} />
            )}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Subheading style={styles.emptyText}>
                  Nenhum tutorial disponível
                </Subheading>
              </View>
            }
            ItemSeparatorComponent={() => (
              <View style={styles.listSeparator}></View>
            )}
            ListHeaderComponent={() => <View style={styles.listHeaderFooter} />}
            ListFooterComponent={() => <View style={styles.listHeaderFooter} />}
          />

          <Header
            title="Outros tutoriais"
            style={{ marginTop: 17 }}
            noMarginBottom
          />
          <FlatList
            data={allTutorials?.filter((t) => !t.targets.includes(dpt.type))}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Subheading style={styles.emptyText}>
                  Nenhum tutorial disponível
                </Subheading>
              </View>
            }
            renderItem={({ item }) => (
              <TutorialCard tutorial={item} user={dpt} key={item.id} />
            )}
            ItemSeparatorComponent={() => (
              <View style={styles.listSeparator}></View>
            )}
            ListHeaderComponent={() => <View style={styles.listHeaderFooter} />}
            ListFooterComponent={() => <View style={styles.listHeaderFooter} />}
          />
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  screen: {
    padding: 0,
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  empty: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ddd",
    borderRadius: 12,
    height: 85,
    paddingHorizontal: 10,
  },
  emptyText: {
    fontStyle: "italic",
  },
  btn: {
    margin: 20,
  },
  listSeparator: {
    height: 12,
  },
  listHeaderFooter: {
    height: 17,
  },
});

export default AccountHelpScreen;
