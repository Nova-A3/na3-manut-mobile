import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Subheading } from "react-native-paper";
import { DataLoading, HeaderButton, TicketCard } from "../../components";
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
    <View style={styles.container}>
      {tickets.length === 0 ? (
        <View style={styles.empty}>
          <Subheading style={styles.emptyText}>Nenhuma OS urgente</Subheading>
        </View>
      ) : (
        <FlatList
          data={tickets}
          renderItem={({ item }) => (
            <TicketCard data={item} style={styles.ticketCard} />
          )}
          ItemSeparatorComponent={() => (
            <View style={styles.listSeparator}></View>
          )}
          ListHeaderComponent={() => <View style={styles.listHeaderFooter} />}
          ListFooterComponent={() => <View style={styles.listHeaderFooter} />}
          refreshing={loading}
          onRefresh={onRefresh}
        />
      )}

      <DataLoading show={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ticketCard: {
    marginHorizontal: 20,
  },
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
  listHeaderFooter: {
    height: 20,
  },
});

export default UrgentTicketsScreen;
