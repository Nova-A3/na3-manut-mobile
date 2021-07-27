import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { IconButton } from "react-native-paper";
import { COLORS } from "../../constants";

type IoniconsIconButtonProps = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  onPress: () => void;
  color?: string;
  size?: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

const IoniconsIconButton: React.FC<IoniconsIconButtonProps> = ({
  icon,
  onPress,
  color,
  size,
  disabled,
  style,
}) => {
  return (
    <IconButton
      icon={({ color, size }) => (
        <Ionicons name={icon} color={color} size={size} />
      )}
      onPress={onPress}
      size={size}
      color={color ? color : COLORS.SYSTEM.BLUE}
      disabled={disabled}
      style={style}
    />
  );
};

export default IoniconsIconButton;
