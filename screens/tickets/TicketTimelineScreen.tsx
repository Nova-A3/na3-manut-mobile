import { useRoute } from "@react-navigation/native";
import * as React from "react";
import { FlatList, View } from "react-native";
import { ScreenContainer, TicketTimelineItem } from "../../components";
import { TicketDependantRoute } from "../../types";

const TicketTimelineScreen: React.FC = () => {
  const {
    params: { ticket },
  } = useRoute<TicketDependantRoute>();

  return (
    <ScreenContainer>
      <View>
        <FlatList
          data={ticket.events}
          renderItem={({ item }) => <TicketTimelineItem data={item} />}
          ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
          style={{ marginTop: 10 }}
        />
      </View>
    </ScreenContainer>
  );
};

export default TicketTimelineScreen;
