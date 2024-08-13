import type { UnprotectForm } from "@/pages/options/pages/settings/components/security/unProtect";
import { Button, PasswordInput, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { memo } from "react";
import crypto from "crypto-js";
import { useSettings, useUpdateUser } from "@/queries/settings";

export type PasswordPromptProps = {
  onPass?: () => void;
};

export const PasswordPrompt = memo(({ onPass }: PasswordPromptProps) => {
  const { data: settings } = useSettings();
  const { mutateAsync: updateUser, isPending } = useUpdateUser();

  const form = useForm<UnprotectForm>({
    initialValues: {
      password: "",
    },
    validate: {
      password: (value) => {
        if (!settings) return "Settings not found";

        if (value.length < 4) {
          return "Password is too short";
        }

        const hash = crypto.HmacSHA256(value, settings.salt).toString(crypto.enc.Hex);

        if (settings.password != hash) {
          return "Invalid password";
        }
      },
    },
  });

  const onSubmit = (values: UnprotectForm) => {
    updateUser({
      password: values.password,
    }).then(() => {
      onPass?.();
      form.reset();
    });
  };

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack pt="sm">
        <PasswordInput placeholder="Enter password" {...form.getInputProps("password")} />
        <Button type="submit" variant="light" color="blue" loading={isPending}>
          Submit
        </Button>
      </Stack>
    </form>
  );
});
