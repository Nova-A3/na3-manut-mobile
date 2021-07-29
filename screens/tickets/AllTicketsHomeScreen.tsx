import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Button, Divider, Subheading } from "react-native-paper";
import {
  DataLoading,
  Dropdown,
  HeaderButton,
  MultipleHeaderButtons,
  ScreenContainer,
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
    <ScreenContainer>
      <Dropdown
        label="Mostrar"
        items={filterItems}
        onValueChange={(val) => setView(val as Ticket["status"] | "all")}
      />
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
  emptyBtn: {
    marginTop: 30,
  },
  listSeparator: {
    height: 15,
  },
});

export default AllTicketsHomeScreen;
