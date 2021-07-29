import { useRoute } from "@react-navigation/native";
import * as React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Divider } from "react-native-paper";
import { ScreenContainer, TicketStatsItem } from "../../components";
import Fb from "../../firebase";
import { useGlobalLoading } from "../../hooks";
import { TicketDependantRoute, TicketStats } from "../../types";

const TicketStatsScreen: React.FC = () => {
  const {
    params: { ticket },
  } = useRoute<TicketDependantRoute>();
  const { execGlobalLoading } = useGlobalLoading();
  const [ticketStats, setTicketStats] = React.useState<TicketStats>();

  React.useEffect(() => {
    execGlobalLoading(async () => {
      const stats = await Fb.Fs.getTicketStats(ticket);
      setTicketStats(stats);
    });
  }, []);

  return (
    <ScreenContainer style={{ marginTop: 10 }}>
      <ScrollView>
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
        />
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  statsItem: {
    marginBottom: 20,
  },
  divider: {
    marginVertical: 30,
    backgroundColor: "#333",
  },
});

export default TicketStatsScreen;
