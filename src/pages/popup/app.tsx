import { ActionIcon, AppShell, Group, Image, MantineProvider, ScrollArea, Stack } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AccountsPage } from "./pages/accounts";
import { IconSettings } from "@tabler/icons-react";
import { useLogo } from "@/hooks/useLogo";

const queryClient = new QueryClient();

export const App = () => {
  const logo = useLogo();

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider defaultColorScheme="auto">
        <AppShell header={{ height: 40 }} padding="sm" w={375} h={600}>
          <AppShell.Header>
            <Group h="100%" px="md" justify="space-between">
              <Image src={logo} alt="Logo" height={25} />
              <ActionIcon variant="light" color="gray" onClick={() => chrome.runtime.openOptionsPage()}>
                <IconSettings size={15} />
              </ActionIcon>
            </Group>
          </AppShell.Header>
          <AppShell.Main component={Stack} p={0} pt={40}>
            <ScrollArea h={560} scrollbarSize={4} offsetScrollbars>
              <AccountsPage />
            </ScrollArea>
          </AppShell.Main>
        </AppShell>
      </MantineProvider>
    </QueryClientProvider>
  );
};

export default App;
