import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { Subheading, Text } from "react-native-paper";
import { COLORS } from "../../constants";
import { TicketStatsItem as TicketStatsItemT } from "../../types";

type TicketStatsItemProps = {
  label: string;
  labelDefinition?: string;
  stats?: TicketStatsItemT<string | number>;
  inline?: boolean;
  style?: ViewStyle;
};

const TicketStatsItem: React.FC<TicketStatsItemProps> = ({
  label,
  labelDefinition,
  stats,
  inline,
  style,
}) => {
  return (
    <View style={style}>
      <View style={[styles.labelContainer, !inline && { marginBottom: 8 }]}>
        <Text style={styles.label}>{label}</Text>

        {labelDefinition && (
          <Text style={styles.labelDefinition}>{`(${labelDefinition})`}</Text>
        )}

        {inline && (
          <Subheading style={styles.inlineData}>
            {stats ? stats.data : "–––"}
          </Subheading>
        )}
      </View>

      {!inline && (
        <>
          {/* ALL TIME */}
          <View style={styles.dataContainer}>
            <Subheading style={styles.data}>
              {stats ? stats.data : "–––"}
            </Subheading>
            <Subheading
              style={[
                { width: "21%" },
                stats?.pos === 1 && {
                  color: COLORS.SYSTEM.GREEN,
                  fontWeight: "bold",
                },
              ]}
            >
              <Ionicons
                name={stats?.pos === 1 ? "analytics" : "analytics-outline"}
                size={16}
              />{" "}
              {stats ? stats.pos : "–––"}
            </Subheading>
            <Subheading
              style={[
                { width: "39%" },
                stats?.pos === 1 && {
                  color: COLORS.SYSTEM.GREEN,
                  fontWeight: "bold",
                },
              ]}
            >
              <Ionicons
                name={stats?.pos === 1 ? "trophy" : "trophy-outline"}
                size={16}
              />{" "}
              {stats ? stats.best : "–––"}
            </Subheading>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  labelContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 5,
  },
  label: {
    fontWeight: "bold",
    fontSize: 18,
  },
  labelDefinition: {
    fontStyle: "italic",
    marginLeft: 8,
    color: "#aaa",
  },
  dataContainer: {
    marginLeft: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  data: {
    width: "40%",
    fontWeight: "bold",
  },
  inlineData: {
    fontWeight: "bold",
    flexGrow: 1,
    textAlign: "right",
    alignSelf: "baseline",
  },
});

export default TicketStatsItem;
