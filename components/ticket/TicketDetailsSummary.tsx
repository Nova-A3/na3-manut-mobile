import { FontAwesome } from "@expo/vector-icons";
import * as React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Caption, Divider, Text, TextInput } from "react-native-paper";
import { COLORS } from "../../constants";
import Db from "../../db";
import Fb from "../../firebase";
import {
  useDepartment,
  useFlashMessage,
  useGlobalLoading,
  useTickets,
} from "../../hooks";
import { Ticket } from "../../types";
import { idToName, systemColor, translatePriority } from "../../utils";
import Button from "../ui/Button";
import Dropdown from "../ui/Dropdown";
import FormModal from "../ui/FormModal";
import IoniconsIconButton from "../ui/IoniconsIconButton";

type TicketDetailsSummaryProps = {
  data: Ticket;
};

const TicketDetailsSummary: React.FC<TicketDetailsSummaryProps> = ({
  data: { id: ticketId },
}) => {
  const { tickets } = useTickets((t) => t.id === ticketId);
  const {
    id,
    status,
    dpt,
    machine,
    team,
    maintenanceType,
    cause,
    additionalInfo,
    interruptions,
    priority,
    refusalReason,
    assignedMaintainer,
    username,
  } = tickets[0]!;
  const department = useDepartment();
  const { execGlobalLoading } = useGlobalLoading();
  const msg = useFlashMessage();

  const [newPriority, setNewPriority] =
    React.useState<Ticket["priority"]>(priority);
  const [showEditPriority, setShowEditPriority] = React.useState(false);

  const [newAssignedMaintainer, setNewAssignedMaintainer] =
    React.useState<Ticket["assignedMaintainer"]>(assignedMaintainer);
  const [showEditAssignedMaintainer, setShowEditAssignedMaintainer] =
    React.useState(false);

  const onEditPriority = async (editedPriority: Ticket["priority"]) => {
    setNewPriority(priority);
    setShowEditPriority(false);

    await execGlobalLoading(async () => {
      const { error } = await Fb.Fs.editTicketPriority(id, {
        priority: editedPriority!,
      });

      if (error) {
        msg.show({
          type: "warning",
          title: error.title,
          text: error.description,
        });
      } else {
        msg.show({
          type: "success",
          title: "Prioridade redefinida",
          text: `Prioridade da OS nº ${id} redefinida para "${translatePriority(
            editedPriority
          )}"`,
        });
        setNewPriority(editedPriority);
      }
    });
  };

  const onEditAssignedMaintainer = async (editedAssignedMaintainer: string) => {
    setNewAssignedMaintainer(assignedMaintainer);
    setShowEditAssignedMaintainer(false);

    if (editedAssignedMaintainer.trim().length === 0) {
      msg.show({
        type: "warning",
        title: "Campo requerido",
        text: 'O campo "Manutentor(es)" é obrigatório.',
      });
      setNewAssignedMaintainer(editedAssignedMaintainer);
      setShowEditAssignedMaintainer(true);
      return;
    }

    if (editedAssignedMaintainer === assignedMaintainer) {
      return;
    }

    await execGlobalLoading(async () => {
      const { error } = await Fb.Fs.editTicketAssignedMaintainer(id, {
        assignedMaintainer: editedAssignedMaintainer!,
      });

      if (error) {
        msg.show({
          type: "warning",
          title: error.title,
          text: error.description,
        });
      } else {
        msg.show({
          type: "success",
          title: "Manutentor(es) redefinido(s)",
          text: `Manutentor(es) da OS nº ${id} redefinido(s) para "${editedAssignedMaintainer}"`,
        });
        setNewAssignedMaintainer(editedAssignedMaintainer);
      }
    });
  };

  const onChangeNewAssignedMaintainerText = React.useCallback((val: string) => {
    setNewAssignedMaintainer(val);
  }, []);

  return (
    <>
      <View style={styles.card}>
        {newPriority && (
          <>
            <View
              style={[
                styles.summaryItem,
                assignedMaintainer ? styles.bottomMargined : null,
              ]}
            >
              <Caption style={styles.itemKey}>Prioridade:</Caption>
              <View style={styles.priorityContainer}>
                <View style={styles.priority}>
                  <View style={styles.priorityIcon}>
                    <FontAwesome
                      name="circle"
                      size={16}
                      color={
                        {
                          low: COLORS.TICKET_STATUS.REFUSED,
                          medium: COLORS.TICKET_STATUS.PENDING,
                          high: COLORS.TICKET_STATUS.CLOSED,
                        }[newPriority]
                      }
                    />
                  </View>

                  <Text style={styles.priorityText}>
                    {translatePriority(newPriority)}
                  </Text>
                </View>

                {department?.isMaintenance() && status === "solving" && (
                  <IoniconsIconButton
                    icon="pencil"
                    onPress={() => {
                      setShowEditPriority(true);
                    }}
                    color={systemColor("primary")}
                    size={14}
                    style={{ margin: 0, padding: 0 }}
                  />
                )}
              </View>
            </View>

            {assignedMaintainer && (
              <View style={styles.summaryItem}>
                <Caption style={styles.itemKey}>Responsável:</Caption>
                <View
                  style={{
                    width: "55%",
                    display: "flex",
                    flexDirection: "row",
                    flexGrow: 1,
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View style={{ width: "87.2728%" }}>
                    <Text>{assignedMaintainer}</Text>
                  </View>

                  {department?.isMaintenance() && status === "solving" && (
                    <IoniconsIconButton
                      icon="pencil"
                      onPress={() => {
                        setShowEditAssignedMaintainer(true);
                      }}
                      color={systemColor("primary")}
                      size={14}
                      style={{ margin: 0, padding: 0 }}
                    />
                  )}
                </View>
              </View>
            )}

            <Divider style={styles.divider} />
          </>
        )}

        <View style={[styles.summaryItem, styles.bottomMargined]}>
          <Caption style={styles.itemKey}>Setor:</Caption>
          <Text style={styles.itemValue}>{dpt}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Caption style={styles.itemKey}>Máquina:</Caption>
          <Text style={styles.itemValue}>
            {
              Db.getDepartment(username)
                ?.getMachines()
                .find((machineData) => machineData.id === machine)?.name
            }
            {!!Db.getDepartment(username)
              ?.getMachines()
              .find((machineData) => machineData.id === machine)?.name && (
              <>
                {" "}
                <Caption style={{ fontStyle: "italic" }}>({machine})</Caption>
              </>
            )}
          </Text>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.summaryItem}>
          <Caption style={styles.itemKey}>Equipe responsável:</Caption>
          <Text style={styles.itemValue}>{idToName(team)}</Text>
        </View>
        <View style={[styles.summaryItem, styles.middleItem]}>
          <Caption style={styles.itemKey}>Tipo de manutenção:</Caption>
          <Text style={styles.itemValue}>{idToName(maintenanceType)}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Caption style={styles.itemKey}>Tipo de causa:</Caption>
          <Text style={styles.itemValue}>{idToName(cause)}</Text>
        </View>

        <Divider style={styles.divider} />

        <View style={[styles.summaryItem, styles.bottomMargined]}>
          <Caption style={styles.itemKey}>Parou máquina:</Caption>
          <Text style={styles.itemValue}>
            {interruptions.equipment ? "SIM" : "NÃO"}
          </Text>
        </View>
        <View
          style={[
            styles.summaryItem,
            interruptions.production !== undefined
              ? styles.bottomMargined
              : undefined,
          ]}
        >
          <Caption style={styles.itemKey}>Parou linha:</Caption>
          <Text style={styles.itemValue}>
            {interruptions.line ? "SIM" : "NÃO"}
          </Text>
        </View>
        {interruptions.production !== undefined && (
          <View style={styles.summaryItem}>
            <Caption style={styles.itemKey}>Parou produção:</Caption>
            <Text style={styles.itemValue}>
              {interruptions.production ? "SIM" : "NÃO"}
            </Text>
          </View>
        )}

        {additionalInfo ? (
          <>
            <Divider style={styles.divider} />
            <View style={styles.summaryItem}>
              <Caption style={styles.itemKey}>Mais informações:</Caption>
              <Text style={styles.itemValue}>{additionalInfo}</Text>
            </View>
          </>
        ) : undefined}

        {refusalReason && ["pending", "solving"].includes(status) && (
          <>
            <Divider style={styles.divider} />
            <View style={styles.summaryItem}>
              <Caption style={styles.itemKey}>Motivo da reabertura:</Caption>
              <Text style={styles.itemValue}>{refusalReason}</Text>
            </View>
          </>
        )}
      </View>

      {department?.isMaintenance() && status === "solving" && (
        <>
          <FormModal
            show={showEditPriority}
            onDismiss={() => setShowEditPriority(false)}
            title="Editar prioridade"
            footer={
              <Button
                label="Redefinir prioridade"
                onPress={() => onEditPriority(newPriority)}
                icon="arrow-right"
                iconRight
              />
            }
          >
            <Dropdown
              label="Nova prioridade"
              items={[
                { value: "low", label: translatePriority("low") },
                { value: "medium", label: translatePriority("medium") },
                { value: "high", label: translatePriority("high") },
              ]}
              value={newPriority!}
              onValueChange={(val) =>
                setNewPriority(
                  val as Exclude<Ticket["priority"], undefined | null>
                )
              }
            />
          </FormModal>

          <FormModal
            show={showEditAssignedMaintainer}
            onDismiss={() => {
              setNewAssignedMaintainer(assignedMaintainer);
              setShowEditAssignedMaintainer(false);
            }}
            title="Redefinir responsável/eis"
            footer={
              <Button
                label="Redefinir"
                onPress={() => onEditAssignedMaintainer(newAssignedMaintainer!)}
                icon="arrow-right"
                iconRight
              />
            }
          >
            <TextInput
              mode="outlined"
              multiline
              numberOfLines={2}
              label="Manutentor(es)"
              defaultValue={newAssignedMaintainer!}
              onChangeText={onChangeNewAssignedMaintainerText}
              autoCompleteType="off"
              autoCorrect={false}
            />
          </FormModal>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "white",
    margin: 20,
  },
  summaryItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemKey: {
    width: "45%",
    fontWeight: "bold",
  },
  itemValue: {
    width: "48%",
  },
  middleItem: {
    marginVertical: 4,
  },
  bottomMargined: {
    marginBottom: 4,
  },
  divider: {
    marginVertical: 10,
    backgroundColor: "#333",
  },
  priorityContainer: {
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priority: {
    flexDirection: "row",
    alignItems: "center",
  },
  priorityIcon: {
    marginRight: 5,
  },
  priorityText: {
    paddingTop: Platform.OS === "ios" ? 2 : 0,
  },
});

export default TicketDetailsSummary;
