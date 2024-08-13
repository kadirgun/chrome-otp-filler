import { ActionIcon, Card, CopyButton, Group, Progress, Stack, Text, Tooltip } from "@mantine/core";
import { memo } from "react";
import { useAccountContext } from "@/pages/options/contexts/account";
import { useGenerateOTP } from "@/hooks/useGenerateOTP";
import { AccountCardMenu } from "./accountCardMenu";
import { AccountQRCodeModal } from "./accountQRCodeModal";
import { AccountInfoTable } from "@/pages/options/components/accountInfoTable";
import { AccountHistoryModal } from "./accountHistoryModal";
import { AccountSettingsModal } from "./accountSettingsModal";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { useUpdateAccount } from "@/queries/accounts";
import type { HistoryItem } from "@/types";

export const AccountCard = memo(() => {
  const { account, ui } = useAccountContext();
  const { token, progress } = useGenerateOTP(account);
  const { mutate: updateAccount } = useUpdateAccount();

  const handleCopy = (callback: () => void) => {
    callback();

    const history: HistoryItem = {
      timestamp: Date.now(),
      type: "copy",
      description: "OTP code copied on extension dashboard",
      url: "",
    };

    updateAccount({
      ...account,
      history: [...account.history, history],
    });
  };

  if (!token) return null;

  return (
    <Card withBorder shadow="sm" radius="md">
      <Card.Section withBorder inheritPadding py="xs">
        <Group justify="space-between" align="center" wrap="nowrap">
          <Text fw={500} lineClamp={1}>
            {account.label}
          </Text>
          <Group wrap="nowrap">
            <CopyButton value={token} timeout={1000}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? "Copied" : "Copy"} withArrow position="right">
                  <ActionIcon color={copied ? "teal" : "gray"} variant="subtle" onClick={() => handleCopy(copy)}>
                    {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
            <AccountCardMenu />
          </Group>
        </Group>
      </Card.Section>

      <AccountInfoTable account={account} />

      <Card.Section>
        <CopyButton value={token} timeout={1000}>
          {({ copied, copy }) => (
            <Tooltip label={copied ? "Copied" : "Copy"} withArrow position="right">
              <Stack
                justify="center"
                align="center"
                p="lg"
                onClick={() => handleCopy(copy)}
                style={{
                  cursor: "pointer",
                }}
              >
                <Text fz="h1" fw={600}>
                  {token}
                </Text>
              </Stack>
            </Tooltip>
          )}
        </CopyButton>
      </Card.Section>

      <Card.Section>
        <Progress
          value={progress}
          w="100%"
          radius={0}
          transitionDuration={1000}
          styles={{
            section: {
              transitionTimingFunction: "linear",
            },
          }}
        />
      </Card.Section>

      {ui.isQRCodeModalOpen && <AccountQRCodeModal />}
      {ui.isHistoryModalOpen && <AccountHistoryModal />}
      {ui.isSettingsModalOpen && <AccountSettingsModal />}
    </Card>
  );
});
