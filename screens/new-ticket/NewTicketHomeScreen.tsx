import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { View } from "react-native";
import { Button, HeaderButton, ScreenContainer } from "../../components";

const NewTicketHomeScreen: React.FC = () => {
  const nav = useNavigation();

  const onOpenTicket = () => {
    nav.navigate("newTicketForm");
  };

  React.useLayoutEffect(() => {
    nav.setOptions({
      headerRight: () => (
        <HeaderButton
          title="Enviar"
          icon="add-circle-outline"
          onPress={onOpenTicket}
        />
      ),
    });
  }, [nav]);

  return (
    <ScreenContainer>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Button label="Abrir OS" icon="plus-circle" onPress={onOpenTicket}>
          Abrir OS
        </Button>
      </View>
    </ScreenContainer>
  );
};

export default NewTicketHomeScreen;
