import type { OTPAccount } from "@/types";
import { algorithms } from "@/utils/constants";
import { mergeAccount } from "@/utils/account";
import { Button, Group, NumberInput, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Secret } from "otpauth";

export type AccountFormProps = {
  account?: OTPAccount;
  onSubmit: (account: OTPAccount) => void;
  action: "create" | "update";
};

export const AccountForm = ({ account, onSubmit, action }: AccountFormProps) => {
  const form = useForm<OTPAccount>({
    initialValues: mergeAccount(account),
    validate: {
      label: (value) => (value.trim().length > 0 ? null : "Label is required"),
      issuer: (value) => (value.trim().length > 0 ? null : "Issuer is required"),
      secret: (value) => {
        if (action === "update") return;
        if (value.trim().length === 0) return "Secret is required";

        try {
          Secret.fromBase32(value);
          return null;
        } catch (error) {
          return "Invalid secret";
        }
      },
      algorithm: (value) => (algorithms.includes(value) ? null : "Invalid algorithm"),
      digits: (value) => (value > 0 ? null : "Digits must be greater than 0"),
      period: (value) => (value > 0 ? null : "Period must be greater than 0"),
    },
  });

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack gap="sm">
        <TextInput withAsterisk label="Label" {...form.getInputProps("label")} />
        <TextInput withAsterisk label="Issuer" {...form.getInputProps("issuer")} />
        {action === "create" && <TextInput withAsterisk label="Secret" {...form.getInputProps("secret")} />}
        <Select withAsterisk data={algorithms} label="Algorithm" {...form.getInputProps("algorithm")} />
        <NumberInput withAsterisk label="Digits" {...form.getInputProps("digits")} />
        <NumberInput withAsterisk label="Period" {...form.getInputProps("period")} />

        <Group justify="end">
          <Button type="submit">{account?.id ? "Save" : "Create"}</Button>
        </Group>
      </Stack>
    </form>
  );
};
