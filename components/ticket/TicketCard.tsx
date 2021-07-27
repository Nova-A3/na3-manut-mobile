import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Badge, Text, Title } from "react-native-paper";
import { COLORS } from "../../constants";
import Database from "../../db";
import Firebase from "../../firebase";
import { useDepartment } from "../../hooks";
import { Ticket } from "../../types";
import { formatTimestamp } from "../../utils";
import TicketCardStatus from "./TicketCardStatus";

type TicketCardProps = {
  data: Ticket;
};

const TicketCard: React.FC<TicketCardProps> = ({ data }) => {
  const department = useDepartment()!;
  const nav = useNavigation();

  const onPress = () => {
    nav.navigate("ticketDetails", { ticket: data });
  };

  const getBadge = (): {
    text: string;
    color: string;
  } => {
    if (Firebase.Firestore.checkTicketUrgency(data, department)) {
      return { text: "AÇÃO NECESSÁRIA", color: COLORS.SYSTEM.RED };
    } else {
      return {
        text: data.dpt,
        color: department.isMaintenance()
          ? Database.getDepartment(data.username)!.color
          : department.color,
      };
    }
  };

  const badge = getBadge();

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.4} onPress={onPress}>
      <>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.idText}>#{data.id}</Text>
            <Badge
              style={{
                ...styles.badge,
                backgroundColor: badge.color,
              }}
            >
              {badge.text}
            </Badge>
          </View>

          <TicketCardStatus status={data.status} />
        </View>
        <Title style={styles.descriptionText}>{data.description}</Title>

        <View style={styles.infoContainer}>
          <View style={styles.dates}>
            <View style={styles.infoItem}>
              <Ionicons name="create-outline" size={18} color="#444" />
              <Text style={styles.infoItemText}>
                {formatTimestamp(data.createdAt, "DD/MM")}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="thumbs-up-outline" size={18} color="#444" />
              <Text style={styles.infoItemText}>
                {data.acceptedAt
                  ? formatTimestamp(data.acceptedAt, "DD/MM")
                  : "–––"}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="checkmark-done-outline" size={18} color="#444" />
              <Text style={styles.infoItemText}>
                {data.solvedAt
                  ? formatTimestamp(data.solvedAt, "DD/MM")
                  : "–––"}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="lock-closed-outline" size={18} color="#444" />
              <Text style={styles.infoItemText}>
                {data.closedAt
                  ? formatTimestamp(data.closedAt, "DD/MM")
                  : "–––"}
              </Text>
            </View>
          </View>
        </View>
      </>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 15,
    borderRadius: 12,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    color: "white",
    marginLeft: 12,
  },
  descriptionText: {
    marginTop: 10,
    marginBottom: 8,
    lineHeight: 25,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dates: {
    flexDirection: "row",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginRight: 15,
  },
  infoItemText: {
    marginLeft: 6,
  },
  idText: {
    fontStyle: "italic",
    color: "#aaa",
  },
});

export default TicketCard;
