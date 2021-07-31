import { useRoute } from "@react-navigation/native";
import * as React from "react";
import { FlatList, View } from "react-native";
import { TicketTimelineItem } from "../../components";
import { TicketDependantRoute } from "../../types";

const TicketTimelineScreen: React.FC = () => {
  const {
    params: { ticket },
  } = useRoute<TicketDependantRoute>();

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={ticket.events.filter(
          (e) =>
            e.type !== "solutionStepAdded" ||
            e.payload?.solutionStep?.type === "step"
        )}
        renderItem={({ item }) => <TicketTimelineItem data={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
        style={{ paddingHorizontal: 20, flexGrow: 1 }}
        ListHeaderComponent={<View style={{ height: 30 }} />}
        ListFooterComponent={<View style={{ height: 20 }} />}
      />
    </View>
  );
};

export default TicketTimelineScreen;
