import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Divider, Switch, Text, TextInput } from "react-native-paper";
import { Button, Dropdown, Header, HeaderButton } from "../../components";
import Firebase from "../../firebase";
import { useDepartment, useFlashMessage, useGlobalLoading } from "../../hooks";
import useStateSlice from "../../hooks/useStateSlice";

const NewTicketFormScreen: React.FC = () => {
  const department = useDepartment()!;
  const { dptIssues } = useStateSlice("data");

  const [dpt, setDpt] = React.useState(department!.displayName);
  const [machine, setMachine] = React.useState("1");
  const [description, setDescription] = React.useState("");
  const [stoppedLine, setStoppedLine] = React.useState(false);
  const [stoppedEquipment, setStoppedEquipment] = React.useState(false);
  const [team, setTeam] = React.useState("mecanica");
  const [maintenanceType, setMaintenanceType] = React.useState("preventiva");
  const [cause, setCause] = React.useState("mecanica");
  const [additionalInfo, setAdditionalInfo] = React.useState("");

  const nav = useNavigation();
  const { execGlobalLoading } = useGlobalLoading();
  const msg = useFlashMessage();

  const onSubmit = async () => {
    if (description === "[placeholder]" || description.trim().length === 0) {
      msg.show({
        type: "warning",
        title: "Campo requerido",
        text: 'O campo "Descrição do problema" é obrigatório.',
      });
      return;
    }

    const nextTicketId = await execGlobalLoading(
      Firebase.Firestore.getNextTicketId
    );

    Alert.alert(
      `OS #${nextTicketId}`,
      `Confirma a abertura da OS nº ${nextTicketId}: "${description}"?`,
      [
        { style: "destructive", text: "Não, voltar" },
        {
          text: "Sim, abrir OS",
          onPress: async () => {
            await execGlobalLoading(async () => {
              await Firebase.Firestore.postTicket(nextTicketId, {
                username: department!.username,
                dpt,
                machine,
                description: description.trim(),
                interruptions: {
                  line: stoppedLine,
                  equipment: stoppedEquipment,
                },
                team,
                maintenanceType,
                cause,
                additionalInfo: additionalInfo.trim(),
              });

              nav.goBack();
              nav.navigate("allTicketsTab");
            });

            msg.show({
              type: "success",
              title: `OS aberta`,
              text: `OS ${nextTicketId} — "${description}" registrada com sucesso.`,
            });
          },
        },
      ]
    );
  };

  React.useLayoutEffect(() => {
    nav.setOptions({
      headerRight: () => (
        <HeaderButton
          title="Enviar"
          icon="checkmark-circle-outline"
          onPress={onSubmit}
        />
      ),
    });
  });

  return (
    <KeyboardAvoidingView behavior="position" style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.view}>
          <View style={styles.formSection}>
            <Header title="Cabeçalho" />
            <TextInput
              mode="outlined"
              label="Setor"
              value={dpt}
              onChangeText={(val) => setDpt(val)}
              style={styles.formField}
              disabled
            />
            <Dropdown
              label="Máquina"
              items={department.getMachineNames().map((label, value) => ({
                label,
                value: (value + 1).toString(),
              }))}
              onValueChange={(val) => setMachine(val)}
              style={styles.formField}
            />
          </View>

          <View style={styles.formSection}>
            <Header title="Descrição do problema" />
            <Dropdown
              label="Problema"
              items={[
                { label: "Escolher...", value: "[placeholder]" },
                ...[...dptIssues].sort().map((issue) => ({
                  label: issue.toUpperCase(),
                  value: issue,
                })),
                { label: "Outro...", value: "" },
              ]}
              onValueChange={(val) => setDescription(val)}
              style={styles.formField}
            />
            {(!description || !dptIssues.includes(description)) &&
              description !== "[placeholder]" && (
                <TextInput
                  mode="outlined"
                  multiline
                  numberOfLines={3}
                  label="Descrição do problema"
                  value={description}
                  onChangeText={(val) => setDescription(val)}
                  style={styles.formField}
                />
              )}
          </View>

          <View style={styles.formSection}>
            <Header title="Interrupções" />
            <View style={{ ...styles.formField, ...styles.switchField }}>
              <Text>Parou máquina?</Text>
              <Switch
                value={stoppedLine ? true : stoppedEquipment}
                onValueChange={setStoppedEquipment}
                disabled={stoppedLine}
              />
            </View>
            <View style={{ ...styles.formField, ...styles.switchField }}>
              <Text>Parou linha?</Text>
              <Switch value={stoppedLine} onValueChange={setStoppedLine} />
            </View>
          </View>

          <View style={styles.formSection}>
            <Header title="Detalhes" />
            <Dropdown
              label="Equipe responsável"
              items={[
                { value: "mecanica", label: "Mecânica" },
                { value: "eletrica", label: "Elétrica" },
                { value: "predial", label: "Predial" },
              ]}
              onValueChange={(val) => setTeam(val)}
              style={styles.formField}
            />
            <Dropdown
              label="Tipo de manutenção"
              items={[
                { value: "preventiva", label: "Preventiva" },
                { value: "corretiva", label: "Corretiva" },
                { value: "preditiva", label: "Preditiva" },
              ]}
              onValueChange={(val) => setMaintenanceType(val)}
              style={styles.formField}
            />
            <Dropdown
              label="Tipo de causa"
              items={[
                { value: "mecanica", label: "Mecânica" },
                { value: "eletrica", label: "Elétrica" },
                { value: "machineAdjustment", label: "Ajuste de máquina" },
              ]}
              onValueChange={(val) => setCause(val)}
              style={styles.formField}
            />
          </View>

          <View style={styles.formSection}>
            <Header title="Informações adicionais" />
            <TextInput
              mode="outlined"
              multiline
              numberOfLines={3}
              label="Informações adicionais"
              value={additionalInfo}
              onChangeText={(val) => setAdditionalInfo(val)}
              style={styles.formField}
            />
          </View>

          <View>
            <Button
              label="Enviar"
              icon="check-bold"
              onPress={onSubmit}
              style={styles.sendBtn}
              color="success"
            />
            <Divider />
            <Text style={styles.footer}>Nova A3 • Manutenção</Text>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  view: {
    flexGrow: 1,
    padding: 20,
  },
  formSection: {
    marginBottom: 12,
  },
  formField: {
    marginBottom: 12,
  },
  switchField: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 6,
  },
  sendBtn: {
    marginTop: 12,
    marginBottom: 16,
  },
  footer: {
    textAlign: "right",
    color: "#ccc",
    fontStyle: "italic",
    marginTop: 8,
  },
});

export default NewTicketFormScreen;
