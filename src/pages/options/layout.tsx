import { AppShell, Group, Burger, Stack, Image } from "@mantine/core";
import { memo, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Outlet } from "react-router-dom";
import { AppMenu } from "./components/menu";
import { useLogo } from "@/hooks/useLogo";
import { useFavicon } from "@/hooks/useFavicon";
import { LogoutButton } from "./components/logoutButton";

export const Layout = memo(() => {
  const [opened, { toggle }] = useDisclosure();
  const logo = useLogo();
  const favicon = useFavicon();

  useEffect(() => {
    const link = document.querySelector("#favicon") as HTMLLinkElement;
    link.href = favicon;
  }, [favicon]);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group justify="space-between" h="100%" px="md">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Image src={logo} alt="Logo" height={40} />
          </Group>

          <Group>
            <LogoutButton />
          </Group>
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
