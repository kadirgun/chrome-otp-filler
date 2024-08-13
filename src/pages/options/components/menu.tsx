import { NavLink } from "@mantine/core";
import { IconQrcode, IconSettings } from "@tabler/icons-react";
import { memo } from "react";
import { NavLink as RouterNavLink } from "react-router-dom";

export const AppMenu = memo(() => {
  return (
    <>
      <NavLink
        component={RouterNavLink}
        to="/"
        label="Accounts"
        leftSection={<IconQrcode size="1rem" stroke={1.5} />}
      />

      <NavLink
        component={RouterNavLink}
        to="/settings"
        label="Settings"
        leftSection={<IconSettings size="1rem" stroke={1.5} />}
      />
    </>
  );
});
