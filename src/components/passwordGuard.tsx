import { Card, Center, Stack, Text, type CenterProps } from "@mantine/core";
import { memo } from "react";
import { PasswordPrompt } from "./passwordPrompt";
import { usePasswordRequired } from "@/hooks/usePasswordRequired";

export type PasswordGuardProps = CenterProps;

export const PasswordGuard = memo(({ children, ...props }: PasswordGuardProps) => {
  const passwordRequired = usePasswordRequired();

  if (!passwordRequired) return null;

  if (passwordRequired.ask)
    return (
      <Center {...props}>
        <Stack align="center" justify="center">
          <Card withBorder shadow="sm" radius="md" w={300}>
            <Card.Section withBorder inheritPadding py="xs">
              <Text fw={500}>Password required</Text>
            </Card.Section>
            <PasswordPrompt />
          </Card>
        </Stack>
      </Center>
    );

  return <>{children}</>;
});
