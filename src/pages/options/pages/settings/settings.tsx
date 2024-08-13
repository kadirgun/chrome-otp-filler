import { Stack, Tabs } from "@mantine/core";
import { memo } from "react";
import { SecuritySettings } from "./components/security";
import { GeneralSettings } from "./components/general";
import { IconForms, IconSettings, IconShield } from "@tabler/icons-react";
import { AutoFillSettings } from "./components/autoFill";

export const SettingsPage = memo(() => {
  return (
    <Stack flex={1} pos="relative">
      <Tabs defaultValue="general">
        <Tabs.List>
          <Tabs.Tab value="general" leftSection={<IconSettings size={16} />}>
            General
          </Tabs.Tab>
          <Tabs.Tab value="security" leftSection={<IconShield size={16} />}>
            Security
          </Tabs.Tab>
          <Tabs.Tab value="autofill" leftSection={<IconForms size={16} />}>
            Autofill
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="general">
          <GeneralSettings />
        </Tabs.Panel>

        <Tabs.Panel value="security">
          <SecuritySettings />
        </Tabs.Panel>

        <Tabs.Panel value="autofill">
          <AutoFillSettings />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
});
