import { AlgorithmSelect } from "@/components/algorithmSelect";
import { defaultSettings, useSettings, useUpdateSettings } from "@/queries/settings";
import type { UserSettings } from "@/types";
import { Stack, NumberInput, Divider, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { pick } from "lodash";
import { memo, useEffect } from "react";

type GeneralSettings = Pick<UserSettings, "algorithm" | "digits" | "period">;

export const GeneralSettings = memo(() => {
  const { data: settings } = useSettings();
  const { mutate: updateSetings } = useUpdateSettings();

  const form = useForm<GeneralSettings>({
    initialValues: pick(defaultSettings, ["algorithm", "digits", "period"]),
  });

  useEffect(() => {
    if (!settings) return;
    form.setInitialValues(pick(settings, ["algorithm", "digits", "period"]));
    form.reset();
  }, [settings]);

  const onSubmit = (values: GeneralSettings) => {
    updateSetings(pick(values, ["algorithm", "digits", "period"]));
    showNotification({
      title: "Settings saved",
      message: "Auto fill settings have been saved",
      color: "blue",
    });
  };

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack pt="sm" pb={100}>
        <AlgorithmSelect
          label="Algorithm"
          description="Default algorithm to be selected when creating an account"
          {...form.getInputProps("algorithm")}
        />
        <NumberInput
          label="Digits"
          description="Default length of the one-time password to be generated"
          {...form.getInputProps("digits")}
        />
        <NumberInput
          label="Period"
          description="Default period to be selected when creating an account"
          {...form.getInputProps("period")}
        />
        <Divider />

        <Button type="submit">Save</Button>
      </Stack>
    </form>
  );
});
