import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Button, Divider, Subheading } from "react-native-paper";
import {
  DataLoading,
  Dropdown,
  HeaderButton,
  MultipleHeaderButtons,
  TicketCard,
} from "../../components";
import { useFilters, useTickets } from "../../hooks";
import { Ticket } from "../../types";
import { systemColor } from "../../utils";

const filterItems: { value: Ticket["status"] | "all"; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "pending", label: "Pendentes" },
  { value: "solving", label: "Resolvendo" },
  { value: "solved", label: "Solucionadas" },
  { value: "closed", label: "Encerradas" },
  { value: "refused", label: "Recusadas" },
];

const AllTicketsHomeScreen: React.FC = () => {
  const [view, setView] = React.useState<Ticket["status"] | "all">("all");
  const { filters } = useFilters();
  const { tickets, loadTickets, loading } = useTickets(
    (ticket) =>
      filters.departments.includes(ticket.username) &&
      filters.teams.includes(ticket.team) &&
      filters.maintenanceTypes.includes(ticket.maintenanceType) &&
      filters.causes.includes(ticket.cause) &&
      (view === "all" || ticket.status === view)
  );
  const nav = useNavigation();

  const onRefresh = () => {
    loadTickets();
  };

  React.useLayoutEffect(() => {
    nav.setOptions({
      headerLeft: () => (
        <HeaderButton
          title="Relatórios"
          icon="document-text-outline"
          // onPress={() => nav.navigate("reportsHome")}
          onPress={() => {}}
          left
          disabled
        />
      ),
      headerRight: () => (
        <MultipleHeaderButtons
          items={[
            {
              title: "Filtros",
              iconName: "filter-outline",
              onPress: () => nav.navigate("filterTickets"),
            },
            {
              title: "Atualizar",
              iconName: "refresh-outline",
              onPress: onRefresh,
              disabled: loading,
            },
          ]}
        />
      ),
    });
  }, [nav, loading]);

  React.useEffect(() => {
    loadTickets();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.dropdownContainer}>
        <Dropdown
          label="Mostrar"
          items={filterItems}
          onValueChange={(val) => setView(val as Ticket["status"] | "all")}
        />
      </View>

      <Divider style={styles.divider} />

      {tickets.length === 0 ? (
        <View style={styles.empty}>
          <Subheading style={styles.emptyText}>
            Nenhuma OS para mostrar
          </Subheading>
          <Button
            mode="text"
            style={styles.emptyBtn}
            color={systemColor("primary")}
            onPress={() => nav.navigate("filterTickets")}
          >
            Filtros, talvez?
          </Button>
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
    marginTop: 20,
    flex: 1,
  },
  dropdownContainer: {
    marginHorizontal: 20,
  },
  divider: {
    marginTop: 20,
    backgroundColor: "#ccc",
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
  emptyBtn: {
    marginTop: 30,
  },
  listSeparator: {
    height: 15,
  },
  listHeaderFooter: {
    height: 20,
  },
});

export default AllTicketsHomeScreen;
