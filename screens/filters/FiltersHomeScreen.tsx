import * as React from "react";
import { FilterItem, ScreenContainer } from "../../components";
import Db from "../../db";
import { useDepartment, useFilters } from "../../hooks";

const FiltersHomeScreen: React.FC = () => {
  const department = useDepartment();
  const { filters } = useFilters();

  return (
    <ScreenContainer>
      {!department?.isOperator() && (
        <FilterItem
          filterKey="departments"
          label="Setores"
          items={Db.getDepartments().map((d) => ({
            label: d.displayName,
            value: d.username,
          }))}
          selectedCount={filters.departments.length}
        />
      )}

      {/* <FilterItem
        label="Tipos de interrupção"
        count={{ default: 2, current: 2 }}
      /> */}

      <FilterItem
        filterKey="teams"
        label="Equipes responsáveis"
        items={[
          { label: "Mecânica", value: "mecanica" },
          { label: "Elétrica", value: "eletrica" },
          { label: "Predial", value: "predial" },
        ]}
        selectedCount={filters.teams.length}
      />
      <FilterItem
        filterKey="maintenanceTypes"
        label="Tipos de manutenção"
        items={[
          { label: "Preventiva", value: "preventiva" },
          { label: "Corretiva", value: "corretiva" },
          { label: "Preditiva", value: "preditiva" },
        ]}
        selectedCount={filters.maintenanceTypes.length}
      />
      <FilterItem
        filterKey="causes"
        label="Tipos de causa"
        items={[
          { label: "Mecânica", value: "mecanica" },
          { label: "Elétrica", value: "eletrica" },
          { label: "Ajuste de máquina", value: "machineAdjustment" },
        ]}
        selectedCount={filters.causes.length}
      />
    </ScreenContainer>
  );
};

export default FiltersHomeScreen;
