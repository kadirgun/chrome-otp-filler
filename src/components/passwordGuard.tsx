import { Card, Center, Stack, Text, type CenterProps } from "@mantine/core";
import { memo } from "react";
import { PasswordPrompt } from "./passwordPrompt";
import { usePasswordGuard } from "@/hooks/usePasswordGuard";
import { isNull } from "lodash";

export type PasswordGuardProps = CenterProps;

export const PasswordGuard = memo(({ children, ...props }: PasswordGuardProps) => {
  const guard = usePasswordGuard();

  if (isNull(guard)) return null;

  if (guard)
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
