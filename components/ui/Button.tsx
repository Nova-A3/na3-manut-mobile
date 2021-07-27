import * as React from "react";
import { ViewStyle } from "react-native";
import { Button as MdButton } from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import { ColorType, systemColor } from "../../utils";

type ButtonProps = {
  onPress: () => void;
  label?: string;
  icon?: IconSource;
  type?: "text" | "outlined" | "contained";
  color?: ColorType;
  style?: ViewStyle;
  iconRight?: boolean;
  disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  label,
  icon,
  onPress,
  type,
  color,
  style,
  iconRight,
  disabled,
}) => {
  return (
    <MdButton
      style={{
        backgroundColor: systemColor(color),
        ...style,
      }}
      mode={type ? type : "contained"}
      icon={icon}
      onPress={onPress}
      contentStyle={{
        flexDirection: iconRight ? "row-reverse" : "row",
      }}
      labelStyle={{
        color: "white",
      }}
      disabled={disabled}
    >
      {label}
    </MdButton>
  );
};

export default Button;
