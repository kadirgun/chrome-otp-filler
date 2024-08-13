import { useGenerateOTP } from "@/hooks/useGenerateOTP";
import { useUpdateAccount } from "@/queries/accounts";
import type { HistoryItem, OTPAccount } from "@/types";
import { ActionIcon, Card, Center, CopyButton, Group, Progress, rem, Text, Tooltip } from "@mantine/core";
import { IconCheck, IconCopy, IconSquareAsteriskFilled } from "@tabler/icons-react";
import { memo } from "react";

export type AccountItemProps = {
  account: OTPAccount;
};
export const AccountItem = memo(({ account }: AccountItemProps) => {
  const { token, progress } = useGenerateOTP(account);
  const { mutate: updateAccount } = useUpdateAccount();

  const handleCopy = (callback: () => void) => {
    callback();

    const history: HistoryItem = {
      timestamp: Date.now(),
      type: "copy",
      description: "OTP code copied on extension popup",
      url: "",
    };

    updateAccount({
      ...account,
      history: [...account.history, history],
    });
  };

  if (!token) return null;

  return (
    <Card withBorder key={account.id}>
      <Card.Section p={10} withBorder>
        <Group justify="space-between" wrap="nowrap">
          <Group wrap="nowrap" gap={5}>
            <IconSquareAsteriskFilled size={20} />
            <Text lineClamp={1} flex={1}>
              {account.issuer}
            </Text>
          </Group>
          <CopyButton value={token} timeout={1000}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? "Copied" : "Copy"} withArrow position="right">
                <ActionIcon color={copied ? "teal" : "gray"} variant="subtle" onClick={() => handleCopy(copy)}>
                  {copied ? <IconCheck style={{ width: rem(16) }} /> : <IconCopy style={{ width: rem(16) }} />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        </Group>
      </Card.Section>

      <Card.Section p={6} px={10} withBorder>
        <Text c="gray" fz="xs" lineClamp={1}>
          {account.label}
        </Text>
      </Card.Section>

      <Card.Section>
        <Center py={10}>
          <Text fz="h2" fw={700}>
            {token}
          </Text>
        </Center>
      </Card.Section>

      <Card.Section>
        <Progress
          w="100%"
          value={progress}
          size="xs"
          transitionDuration={1000}
          styles={{
            section: {
              transitionTimingFunction: "linear",
            },
          }}
        />
      </Card.Section>
    </Card>
  );
});
