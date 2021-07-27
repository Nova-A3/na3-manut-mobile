import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import {
  HeaderButton as HeaderButtonComponent,
  HeaderButtons,
  HiddenItem,
  OverflowMenu,
} from "react-navigation-header-buttons";

type HeaderOverflowMenuProps = {
  items: React.ComponentProps<typeof HiddenItem>[];
};

const HeaderOverflowMenu: React.FC<HeaderOverflowMenuProps> = ({ items }) => {
  return (
    <HeaderButtons
      HeaderButtonComponent={(props) => (
        <HeaderButtonComponent
          IconComponent={Ionicons}
          iconSize={23}
          {...props}
        />
      )}
    >
      <OverflowMenu
        OverflowIcon={({ color }) => (
          <Ionicons name="ellipsis-horizontal" size={23} color={color} />
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
