import * as React from "react";
import { FilterItem, ScreenContainer } from "../components";

const FiltersScreen: React.FC = () => {
  return (
    <ScreenContainer>
      <FilterItem label="Setores" count={{ default: 10, current: 10 }} />
      <FilterItem
        label="Tipos de interrupção"
        count={{ default: 2, current: 2 }}
      />
      <FilterItem
        label="Equipes responsáveis"
        count={{ default: 3, current: 2 }}
      />
      <FilterItem
        label="Tipos de manutenção"
        count={{ default: 3, current: 1 }}
      />
      <FilterItem label="Tipos de causa" count={{ default: 3, current: 3 }} />
    </ScreenContainer>
  );
};

export default FiltersScreen;
