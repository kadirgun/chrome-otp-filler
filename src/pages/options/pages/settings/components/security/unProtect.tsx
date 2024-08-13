import { useAccounts, useUpdateAccount } from "@/queries/accounts";
import { useSettings, useUpdateSettings } from "@/queries/settings";
import { decryptAccount } from "@/utils/account";
import { Stack, PasswordInput, Button, Input, Notification } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconShield, IconShieldOff } from "@tabler/icons-react";
import crypto from "crypto-js";
import { memo } from "react";

export type UnprotectForm = {
  password: string;
};

export const Unprotect = memo(() => {
  const { data: settings } = useSettings();
  const { mutate: updateSettings } = useUpdateSettings();
  const { data: accounts } = useAccounts();
  const { mutate: updateAccounts } = useUpdateAccount(false);

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
    if (!accounts) return;

    updateAccounts(
      accounts
        .map((account) => decryptAccount(account, values.password))
        .map((account) => ({
          ...account,
          history: [
            ...account.history,
            {
              timestamp: Date.now(),
              type: "unprotect",
              description: "Account unprotected",
              url: "",
            },
          ],
        }))
    );

    updateSettings({
      protected: false,
      password: "",
      salt: "",
    });

    showNotification({
      title: "Protection disabled",
      message: "Accounts are now unprotected",
      color: "orange",
    });
  };

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack pt="sm">
        <Notification
          title="Protection is enabled"
          color="teal"
          icon={<IconShield size={16} />}
          withCloseButton={false}
        />
        <PasswordInput
          label="Passowrd"
          description="Password to protect your accounts"
          {...form.getInputProps("password")}
        />
        <Button type="submit" color="blue" variant="light" leftSection={<IconShieldOff size={16} />}>
          Disable Protection
        </Button>
        <Input.Description>
          Enable password protection for the extension. Secret keys will be encrypted using the password.
        </Input.Description>
      </Stack>
    </form>
  );
});
