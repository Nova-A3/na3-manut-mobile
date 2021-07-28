import * as React from "react";
import { StyleSheet, View } from "react-native";
import { Subheading, Text } from "react-native-paper";
import { systemColor } from "../../utils";

type FilterItemProps = {
  label: string;
  count: { default: number; current: number };
};

const FilterItem: React.FC<FilterItemProps> = ({ label, count }) => {
  return (
    <View style={styles.filterItem}>
      <Subheading>{label}</Subheading>
      <View
        style={[
          styles.filterItemCount,
          count.default !== count.current && styles.filterItemCountActive,
        ]}
      >
        <Text
          style={[
            styles.filterItemCountText,
            count.default !== count.current && styles.filterItemCountTextActive,
          ]}
        >
          {count.current}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  filterItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#bbb",
    paddingBottom: 10,
    marginBottom: 15,
  },
  filterItemCount: {
    height: 25,
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
  },
  filterItemCountTextActive: {
    color: "white",
    fontWeight: "bold",
  },
});

export default FilterItem;
