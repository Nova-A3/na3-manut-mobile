import * as React from "react";
import { View, ViewStyle } from "react-native";
import { TextInput } from "react-native-paper";
import MdDropdown from "react-native-paper-dropdown";
import { COLORS } from "../../constants";

type DropdownProps = {
  label: string;
  items: {
    label: string;
    value: string;
  }[];
  value?: string;
  onValueChange: (newVal: string) => void;
  style?: ViewStyle;
};

const Dropdown: React.FC<DropdownProps> = ({
  label,
  items,
  value,
  onValueChange,
  style,
}) => {
  const [val, setVal] = React.useState(items[0]!.value);
  const [show, setShow] = React.useState(false);

  const handleValueChange = (newVal: string) => {
    setVal(newVal);
    onValueChange(newVal);
  };

  console.log("DROP", value);

  return (
    <View style={style}>
      <MdDropdown
        label={label}
        mode="outlined"
        value={value ? value : val}
        setValue={(newVal) => handleValueChange(newVal as string)}
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
