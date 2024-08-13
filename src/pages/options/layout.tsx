import { AppShell, Group, Burger, Stack, Image } from "@mantine/core";
import { memo, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Outlet } from "react-router-dom";
import { AppMenu } from "./components/menu";
import { useLogo } from "@/hooks/useLogo";
import { useFavicon } from "@/hooks/useFavicon";
import { LogoutButton } from "./components/logoutButton";
import { PasswordGuard } from "@/components/passwordGuard";
import { usePasswordGuard } from "@/hooks/usePasswordGuard";
import { isNull } from "lodash";

export const Layout = memo(() => {
  const [opened, { toggle }] = useDisclosure();
  const logo = useLogo();
  const favicon = useFavicon();
  const guard = usePasswordGuard();

  useEffect(() => {
    const link = document.querySelector("#favicon") as HTMLLinkElement;
    link.href = favicon;
  }, [favicon]);

  if (isNull(guard)) return null;

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened, desktop: guard } }}
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
        <PasswordGuard flex={1}>
          <Outlet />
        </PasswordGuard>
      </AppShell.Main>
    </AppShell>
  );
});
