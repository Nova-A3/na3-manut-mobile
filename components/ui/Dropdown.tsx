import * as React from "react";
import { View, ViewStyle } from "react-native";
import { TextInput } from "react-native-paper";
import MdDropdown from "react-native-paper-dropdown";
import { COLORS } from "../../constants";

type DropdownProps<T extends string> = {
  label: string;
  items: {
    label: string;
    value: T;
  }[];
  value?: string;
  onValueChange: (newVal: DropdownProps<T>["items"][number]["value"]) => void;
  style?: ViewStyle;
};

const Dropdown = <T extends string>({
  label,
  items,
  value,
  onValueChange,
  style,
}: DropdownProps<T>) => {
  const [val, setVal] = React.useState(items[0]!.value);
  const [show, setShow] = React.useState(false);

  const handleValueChange = (newVal: T) => {
    setVal(newVal);
    onValueChange(newVal);
  };

  return (
    <View style={style}>
      <MdDropdown
        label={label}
        mode="outlined"
        value={value ? value : val}
        setValue={(newVal) => handleValueChange(newVal as T)}
        list={items}
        visible={show}
        showDropDown={() => setShow(true)}
        onDismiss={() => setShow(false)}
        inputProps={{
          right: <TextInput.Icon name="menu-down" />,
        }}
        activeColor={COLORS.SYSTEM.BLUE}
        dropDownContainerMaxHeight={400}
      />
    </View>
  );
};

export default Dropdown;
