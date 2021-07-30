import { useNavigation, useRoute } from "@react-navigation/native";
import * as React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Divider } from "react-native-paper";
import { HeaderButton, TicketStatsItem } from "../../components";
import Fb from "../../firebase";
import { useGlobalLoading } from "../../hooks";
import { TicketDependantRoute, TicketStats } from "../../types";

const TicketStatsScreen: React.FC = () => {
  const {
    params: { ticket },
  } = useRoute<TicketDependantRoute>();
  const nav = useNavigation();
  const { isGlobalLoading, execGlobalLoading } = useGlobalLoading();
  const [ticketStats, setTicketStats] = React.useState<TicketStats>();

  const loadStats = () => {
    execGlobalLoading(async () => {
      const stats = await Fb.Fs.getTicketStats(ticket);
      setTicketStats(stats);
    });
  };

  React.useEffect(() => {
    loadStats();
  }, []);

  React.useLayoutEffect(() => {
    nav.setOptions({
      headerRight: () => (
        <HeaderButton
          title="Atualizar"
          icon="refresh-outline"
          onPress={loadStats}
          disabled={isGlobalLoading}
        />
      ),
    });
  });

  return (
    <View>
      <ScrollView style={{ paddingTop: 20 }}>
        <TicketStatsItem
          label="TAC"
          labelDefinition="Tempo até 1ª Confirmação"
          stats={ticketStats?.timeToFirstConfirmation}
          style={styles.statsItem}
        />
        <TicketStatsItem
          label="TAS"
          labelDefinition="Tempo até 1ª Solução"
          stats={ticketStats?.timeToFirstSolution}
          style={styles.statsItem}
        />
        <TicketStatsItem
          label="TAR"
          labelDefinition="Tempo até 1ª Resposta à Solução"
          stats={ticketStats?.timeToFirstAnswerToSolution}
          style={styles.statsItem}
        />
        <TicketStatsItem
          label="TAE"
          labelDefinition="Tempo até Encerramento"
          stats={ticketStats?.timeToClosure}
          style={styles.statsItem}
        />

        <Divider style={styles.divider} />

        <TicketStatsItem
          inline
          label="QSR"
          labelDefinition="Qtd. Soluções Recusadas"
          stats={ticketStats?.solutionsRefused}
          style={styles.statsItem}
        />
        <TicketStatsItem
          inline
          label="QCT"
          labelDefinition="Qtd. Cutucadas"
          stats={ticketStats?.pokes}
          style={styles.statsItem}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  statsItem: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  divider: {
    marginTop: 10,
    marginBottom: 30,
    marginHorizontal: 20,
    backgroundColor: "#222",
  },
});

export default TicketStatsScreen;
