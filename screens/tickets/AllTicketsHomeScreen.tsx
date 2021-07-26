import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Divider, Text } from "react-native-paper";
import {
  DataLoading,
  Dropdown,
  HeaderButton,
  ScreenContainer,
  TicketCard,
} from "../../components";
import { useTickets } from "../../hooks";
import { TicketStatus } from "../../types";

const filterItems: { value: TicketStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "Todas" },
  { value: "PENDING", label: "Pendentes" },
  { value: "SOLVING", label: "Resolvendo" },
  { value: "SOLVED", label: "Solucionadas" },
  { value: "CLOSED", label: "Encerradas" },
  { value: "REFUSED", label: "Recusadas" },
];

const AllTicketsHomeScreen: React.FC = () => {
  const [view, setView] = React.useState<TicketStatus | "ALL">("ALL");
  const { tickets, loadTickets, loading } = useTickets(
    view === "ALL" ? undefined : view
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
      <Dropdown
        label="Mostrar"
        items={filterItems}
        onValueChange={(val) => setView(val as TicketStatus | "ALL")}
      />
      <Divider style={styles.divider} />

      {tickets.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Nenhuma OS para mostrar</Text>
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
  divider: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: "#333",
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
});

export default AllTicketsHomeScreen;
