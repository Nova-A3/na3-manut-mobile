import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import {
  HeaderButton as HeaderButtonComponent,
  HeaderButtons,
  Item,
} from "react-navigation-header-buttons";
import { systemColor } from "../../utils";

type MultipleHeaderButtonsProps = {
  items: (React.ComponentProps<typeof Item> | undefined)[];
};

const MultipleHeaderButtons: React.FC<MultipleHeaderButtonsProps> = ({
  items,
}) => {
  return (
    <HeaderButtons
      HeaderButtonComponent={(props) => (
        <HeaderButtonComponent
          IconComponent={Ionicons}
          iconSize={23}
          color={
            props.disabled
              ? systemColor("secondary")
              : props.color
              ? systemColor(props.color)
              : systemColor("primary")
          }
          disabled={props.disabled}
          {...props}
        />
      )}
    >
      {items
        .filter((i) => i !== undefined)
        .map((i) => (
          <Item key={i!.title} {...i!} />
        ))}
    </HeaderButtons>
  );
};

export default MultipleHeaderButtons;
