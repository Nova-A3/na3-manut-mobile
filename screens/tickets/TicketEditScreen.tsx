import { useNavigation, useRoute } from "@react-navigation/native";
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
import Fb from "../../firebase";
import { useDepartment, useFlashMessage, useGlobalLoading } from "../../hooks";
import { TicketDependantRoute } from "../../types";

const TicketEditScreen: React.FC = () => {
  const department = useDepartment()!;

  const { execGlobalLoading } = useGlobalLoading();
  const {
    params: { ticket },
  } = useRoute<TicketDependantRoute>();
  const nav = useNavigation();
  const msg = useFlashMessage();

  const [dpt, setDpt] = React.useState(department.displayName);
  const [machine, setMachine] = React.useState(department.getMachines()[0]?.id);
  const [description, setDescription] = React.useState("");
  const [stoppedLine, setStoppedLine] = React.useState(false);
  const [stoppedEquipment, setStoppedEquipment] = React.useState(false);
  const [stoppedProduction, setStoppedProduction] = React.useState(false);
  const [team, setTeam] = React.useState("mecanica");
  const [maintenanceType, setMaintenanceType] = React.useState("preventiva");
  const [cause, setCause] = React.useState("mecanica");

  console.log(department.getMachines());

  const machineIssues = React.useMemo(
    () =>
      department
        .getMachines()
        .find((machineData) => machineData.id === machine)!
        .issues.sort((a, b) => a.localeCompare(b)),
    [department, machine]
  );

  const loadTicketData = () => {
    execGlobalLoading(async () => {
      setMachine(ticket.machine);
      setDescription(ticket.description);
      setStoppedLine(ticket.interruptions.line);
      setStoppedEquipment(ticket.interruptions.equipment);
      setStoppedProduction(ticket.interruptions.production || false);
      setTeam(ticket.team);
      setMaintenanceType(ticket.maintenanceType);
      setCause(ticket.cause);
    });
  };

  const onSubmit = async () => {
    if (description.trim().length === 0) {
      msg.show({
        type: "warning",
        title: "Campo requerido",
        text: 'O campo "Descrição do problema" é obrigatório.',
      });
      return;
    }

    Alert.alert(
      `OS #${ticket.id}`,
      `Confirma a edição da OS nº ${ticket.id}: "${description}"?`,
      [
        { style: "cancel", text: "Não, voltar" },
        {
          style: "destructive",
          text: "Sim, editar OS",
          onPress: async () => {
            await execGlobalLoading(async () => {
              await Fb.Fs.editTicket({
                id: ticket.id,
                username: department!.username,
                dpt,
                machine: machine!,
                description,
                interruptions: {
                  line: stoppedLine,
                  equipment: stoppedLine || stoppedEquipment,
                  production: stoppedProduction,
                },
                team,
                maintenanceType,
                cause,
              });

              nav.goBack();
            });

            msg.show({
              type: "success",
              title: `OS editada`,
              text: `OS ${ticket.id} — "${description}" editada com sucesso.`,
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

  React.useEffect(() => {
    loadTicketData();
  }, []);

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
              items={department.getMachines().map((machineData) => ({
                label: `${machineData.name} (${machineData.id})`,
                value: machineData.id,
              }))}
              value={machine}
              onValueChange={(val) => setMachine(val)}
              style={styles.formField}
            />
          </View>

          <View style={styles.formSection}>
            <Header title="Descrição do problema" />
            {department.username === "ekoplasto" ? (
              <TextInput
                mode="outlined"
                multiline
                numberOfLines={3}
                label="Descrição do problema"
                value={description}
                onChangeText={(val) => setDescription(val)}
                style={styles.formField}
              />
            ) : (
              <>
                <Dropdown
                  label="Problema"
                  items={[
                    ...machineIssues.map((issue) => ({
                      label: issue.toUpperCase(),
                      value: issue,
                    })),
                    { label: "Outro...", value: "" },
                  ]}
                  value={description}
                  onValueChange={(val) => setDescription(val)}
                  style={styles.formField}
                />
                {(!description || !machineIssues.includes(description)) &&
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
              </>
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
            <View style={{ ...styles.formField, ...styles.switchField }}>
              <Text>Parou produção?</Text>
              <Switch
                value={stoppedProduction}
                onValueChange={setStoppedProduction}
              />
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
              value={team}
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
              value={maintenanceType}
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
              value={cause}
              onValueChange={(val) => setCause(val)}
              style={styles.formField}
            />
          </View>

          <View>
            <Button
              label="Editar"
              icon="check-bold"
              onPress={onSubmit}
              style={styles.sendBtn}
              color="success"
            />
            <Divider />
            <Text style={styles.footer}>Editando OS: #{ticket.id}</Text>
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

export default TicketEditScreen;
