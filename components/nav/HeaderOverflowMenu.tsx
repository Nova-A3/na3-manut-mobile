import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import {
  HeaderButton as HeaderButtonComponent,
  HeaderButtons,
  HiddenItem,
  Item,
  OverflowMenu,
} from "react-navigation-header-buttons";
import { systemColor } from "../../utils";

type HeaderOverflowMenuProps = {
  items: React.ComponentProps<typeof HiddenItem>[];
  buttons?: React.ComponentProps<typeof Item>[];
};

const HeaderOverflowMenu: React.FC<HeaderOverflowMenuProps> = ({
  items,
  buttons,
}) => {
  return (
    <HeaderButtons
      HeaderButtonComponent={(props) => (
        <HeaderButtonComponent
          IconComponent={Ionicons}
          iconSize={23}
          color={
            props.disabled ? systemColor("secondary") : systemColor("primary")
          }
          {...props}
        />
      )}
    >
      {buttons && buttons.map((btn) => <Item key={btn.title} {...btn} />)}

      <OverflowMenu
        OverflowIcon={() => (
          <Ionicons
            name="ellipsis-horizontal-circle-outline"
            size={23}
            color={systemColor("primary")}
          />
        )}
        style={{ marginHorizontal: 10 }}
      >
        {items.map((i) => (
          <HiddenItem key={i.title} {...i} />
        ))}
      </OverflowMenu>
    </HeaderButtons>
  );
};

export default HeaderOverflowMenu;
