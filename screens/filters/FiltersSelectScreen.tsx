import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import * as React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Divider, Subheading, Switch } from "react-native-paper";
import { ScreenContainer } from "../../components";
import { useFilters } from "../../hooks";
import { AllTicketsStackParamList } from "../../types";

const FiltersSelectScreen: React.FC = () => {
  const {
    params: { key, items },
  } = useRoute<RouteProp<AllTicketsStackParamList, "filterSelect">>();
  const nav = useNavigation();
  const { filters, toggleFilter } = useFilters();

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
    });
  });

  return (
    <ScreenContainer>
      <FlatList
        data={items.map((i) => ({ ...i, key: i.value }))}
        renderItem={({ item }) => (
          <>
            <View style={styles.itemContainer}>
              <Subheading>{item.label}</Subheading>
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
