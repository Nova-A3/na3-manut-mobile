import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import {
  HeaderButton as HeaderButtonComponent,
  HeaderButtons,
  Item,
} from "react-navigation-header-buttons";
import { ColorType, systemColor } from "../../utils";

type HeaderButtonProps = {
  title: string;
  icon: string;
  onPress: () => void;
  color?: ColorType;
  disabled?: boolean;
  left?: boolean;
};

const HeaderButton: React.FC<HeaderButtonProps> = ({
  title,
  icon,
  onPress,
  color,
  disabled,
  left,
}) => {
  return (
    <HeaderButtons
      HeaderButtonComponent={(props) => (
        <HeaderButtonComponent
          IconComponent={Ionicons}
          iconSize={23}
          color={
            disabled
              ? systemColor("secondary")
              : color
              ? systemColor(color)
              : systemColor("primary")
          }
          disabled={disabled}
          {...props}
        />
      )}
      left={left}
    >
      <Item title={title} iconName={icon} onPress={onPress} />
    </HeaderButtons>
  );
};

export default HeaderButton;
