import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Divider, Subheading, Text } from "react-native-paper";
import { DataState } from "../../types";
import { systemColor } from "../../utils";

type FilterItemProps = {
  filterKey: keyof DataState["filters"];
  label: string;
  items: { label: string; value: string }[];
  selectedCount: number;
};

const FilterItem: React.FC<FilterItemProps> = ({
  filterKey,
  label,
  items,
  selectedCount,
}) => {
  const nav = useNavigation();

  return (
    <>
      <TouchableOpacity
        style={styles.filterItem}
        onPress={() => {
          nav.navigate("filterSelect", { key: filterKey, items });
        }}
      >
        <Subheading>{label}</Subheading>
        <View
          style={[
            styles.filterItemCount,
            items.length !== selectedCount && styles.filterItemCountActive,
          ]}
        >
          <Text
            style={[
              styles.filterItemCountText,
              items.length !== selectedCount &&
                styles.filterItemCountTextActive,
            ]}
          >
            {selectedCount}
          </Text>
        </View>
      </TouchableOpacity>

      <Divider style={styles.divider} />
    </>
  );
};

const styles = StyleSheet.create({
  filterItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  filterItemCount: {
    height: 31,
    width: 50,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: systemColor("primary"),
    alignItems: "center",
    justifyContent: "center",
  },
  filterItemCountActive: {
    backgroundColor: systemColor("primary"),
  },
  filterItemCountText: {
    color: systemColor("primary"),
    fontSize: 16,
  },
  filterItemCountTextActive: {
    color: "white",
    fontWeight: "bold",
  },
  divider: {
    backgroundColor: "#888",
    marginBottom: 15,
  },
});

export default FilterItem;
