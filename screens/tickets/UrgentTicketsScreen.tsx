import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import {
  DataLoading,
  HeaderButton,
  ScreenContainer,
  TicketCard,
} from "../../components";
import Firebase from "../../firebase";
import { useDepartment, useTickets } from "../../hooks";

const UrgentTicketsScreen: React.FC = () => {
  const department = useDepartment()!;
  const { tickets, loadTickets, loading } = useTickets((ticket) =>
    Firebase.Firestore.checkTicketUrgency(ticket, department)
  );

  const nav = useNavigation();

  const onRefresh = () => {
    loadTickets();
  };

  React.useLayoutEffect(() => {
    nav.setOptions({
      headerRight: () => (
        <HeaderButton
          title="Atualizar"
          icon="refresh-outline"
          onPress={onRefresh}
          disabled={loading}
        />
      ),
    });
  }, [nav, loading]);

  React.useEffect(() => {
    loadTickets();
  }, []);

  return (
    <ScreenContainer>
      {tickets.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Nenhuma OS urgente</Text>
        </View>
      ) : (
        <FlatList
          data={tickets}
          renderItem={({ item }) => <TicketCard data={item} />}
          ItemSeparatorComponent={() => (
            <View style={styles.listSeparator}></View>
          )}
          refreshing={loading}
          onRefresh={onRefresh}
        />
      )}

      <DataLoading show={loading} />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  empty: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ddd",
    borderRadius: 10,
  },
  emptyText: {
    fontStyle: "italic",
  },
  listSeparator: {
    height: 15,
  },
});

export default UrgentTicketsScreen;
