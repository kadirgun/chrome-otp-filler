import { Stack, PasswordInput, Button, Input } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconShield } from "@tabler/icons-react";
import { memo } from "react";
import crypto from "crypto-js";
import { useAccounts, useUpdateAccount } from "@/queries/accounts";
import { useUpdateSettings, useUpdateUser } from "@/queries/settings";
import { showNotification } from "@mantine/notifications";
import { encryptAccount } from "@/utils/account";
import type { HistoryItem } from "@/types";

type ProtectForm = {
  password: string;
  confirmPassword: string;
};

export const Protect = memo(() => {
  const { mutate: updateSettings } = useUpdateSettings();
  const { data: accounts } = useAccounts();
  const { mutate: updateAccount } = useUpdateAccount(false);
  const { mutate: updateUser } = useUpdateUser();

  const form = useForm<ProtectForm>({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validate: {
      password: (value) => {
        if (value.length < 4) {
          return "Password is too short";
        }
      },
      confirmPassword: (value) => {
        if (value !== form.values.password) {
          return "Passwords do not match";
        }
      },
    },
  });

  const onSubmit = (values: ProtectForm) => {
    if (!accounts) return;

    const salt = crypto.lib.WordArray.random(128 / 8).toString(crypto.enc.Hex);
    const password = crypto.HmacSHA256(values.password, salt).toString(crypto.enc.Hex);

    const history: HistoryItem = {
      timestamp: Date.now(),
      type: "protect",
      description: "Account protected with password",
      url: "",
    };

    const encryptedAccounts = accounts
      .map((account) => encryptAccount(account, values.password))
      .map((account) => ({
        ...account,
        history: [...account.history, history],
      }));

    console.log("encryptedAccounts", encryptedAccounts);

    updateAccount(encryptedAccounts);

    updateSettings({
      protected: true,
      password,
      salt,
    });

    updateUser({
      password: values.password,
    });

    showNotification({
      title: "Protection enabled",
      message: "Password protection has been enabled",
      color: "blue",
    });
  };

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack pt="sm">
        <PasswordInput
          label="Passowrd"
          description="Password to protect your accounts"
          {...form.getInputProps("password")}
        />
        <PasswordInput
          label="Confirm Password"
          description="Confirm your password"
          {...form.getInputProps("confirmPassword")}
        />
        <Button type="submit" color="blue" variant="light" leftSection={<IconShield size={16} />}>
          Enable Protection
        </Button>
        <Input.Description>
          Enable password protection for the extension. Secret keys will be encrypted using the password.
        </Input.Description>
      </Stack>
    </form>
  );
});
