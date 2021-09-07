import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import * as React from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";
import { Divider, Subheading, Switch } from "react-native-paper";
import { HeaderButton, ScreenContainer } from "../../components";
import { useFilters } from "../../hooks";
import { AllTicketsStackParamList } from "../../types";

const FiltersSelectScreen: React.FC = () => {
  const {
    params: { key, items },
  } = useRoute<RouteProp<AllTicketsStackParamList, "filterSelect">>();
  const nav = useNavigation();
  const { filters, toggleFilter, filterOn, filterOff } = useFilters();

  const handleToggleAllFilters = React.useCallback(() => {
    if (filters[key].length > 0) {
      items.forEach(({ value }) => {
        filterOff(key, value);
      });
    } else {
      items.forEach(({ value }) => {
        filterOn(key, value);
      });
    }
  }, [filters, key, items, filterOff, filterOn]);

  React.useLayoutEffect(() => {
    let headerTitle: string;
    switch (key) {
      case "departments":
        headerTitle = "Setores";
        break;
      case "problems":
        headerTitle = "Tipos de problema";
        break;
      case "teams":
        headerTitle = "Equipes responsáveis";
        break;
      case "maintenanceTypes":
        headerTitle = "Tipos de manutenção";
        break;
      case "causes":
        headerTitle = "Tipos de causa";
        break;
    }

    nav.setOptions({
      headerTitle,
      headerRight: () =>
        filters[key].length > 0 ? (
          <HeaderButton
            icon="remove-circle-outline"
            title="Limpar filtros"
            onPress={handleToggleAllFilters}
          />
        ) : (
          <HeaderButton
            icon="radio-button-on-outline"
            title="Limpar filtros"
            onPress={handleToggleAllFilters}
          />
        ),
    });

    const navBeforeRemoveListener = nav.addListener("beforeRemove", (ev) => {
      if (filters[key].length > 0) {
        // If at least one filter is selected, it's ok to remove the screen
        return nav.dispatch(ev.data.action);
      }

      // Prevent default behavior of leaving the screen
      ev.preventDefault();

      // Alert the user and prevent him from leaving the screen
      Alert.alert(
        "Nenhum filtro selecionado",
        "Você precisa selecionar ao menos um filtro para que pelo menos alguma OS seja relacionada."
      );
    });

    return () => {
      nav.removeListener("beforeRemove", navBeforeRemoveListener);
    };
  }, [key, filters]);

  return (
    <ScreenContainer>
      <FlatList
        data={items
          .map((i) => ({ ...i, key: i.value }))
          .sort((a, b) => a.label.localeCompare(b.label))}
        renderItem={({ item }) => (
          <>
            <View style={styles.itemContainer}>
              <Subheading>{item.label.toUpperCase()}</Subheading>
              <Switch
                value={filters[key].includes(item.value)}
                onValueChange={() => toggleFilter(key, item.value)}
                disabled={
                  filters[key].length === 1 && item.value === filters[key][0]
                }
              />
            </View>

            <Divider style={styles.divider} />
          </>
        )}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  divider: {
    backgroundColor: "#888",
    marginBottom: 15,
  },
});

export default FiltersSelectScreen;
