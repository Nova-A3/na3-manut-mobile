import { RouteProp, useRoute } from "@react-navigation/native";
import * as React from "react";
import { FlatList, View } from "react-native";
import ProjectTimelineItem from "../../components/internal-project/ProjectTimelineItem";
import { InternalProjectsStackParamList } from "../../types";

const InternalProjectTimelineScreen: React.FC = () => {
  const {
    params: { project },
  } =
    useRoute<
      RouteProp<InternalProjectsStackParamList, "internalProjectDetails">
    >();

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={project.events}
        renderItem={({ item }) => <ProjectTimelineItem event={item} />}
        keyExtractor={(item, idx) =>
          item.type + "-" + item.timestamp.nanoseconds + "-" + idx
        }
        ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
        style={{ paddingHorizontal: 20, flexGrow: 1 }}
        ListHeaderComponent={<View style={{ height: 30 }} />}
        ListFooterComponent={<View style={{ height: 20 }} />}
      />
    </View>
  );
};

export default InternalProjectTimelineScreen;
