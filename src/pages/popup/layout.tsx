import { AppShell, Group, Burger, Stack } from "@mantine/core";
import { memo } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Outlet } from "react-router-dom";
import { AppMenu } from "../options/components/menu";

export const Layout = memo(() => {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          Chrome OTP
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <AppMenu />
      </AppShell.Navbar>
      <AppShell.Main component={Stack}>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
});
