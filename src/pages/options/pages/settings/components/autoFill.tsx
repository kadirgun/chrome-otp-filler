import { defaultSettings, useSettings, useUpdateSettings } from "@/queries/settings";
import type { UserSettings } from "@/types";
import { TextInput, Anchor, Stack, ScrollArea, ActionIcon, Button, NumberInput, Switch } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconTrash, IconPlus } from "@tabler/icons-react";
import { pick } from "lodash";
import { memo, useEffect } from "react";

export type AutoFillForm = Pick<UserSettings, "autofill" | "autofillDelay" | "selectors">;

export const AutoFillSettings = memo(() => {
  const { data: settings } = useSettings();
  const { mutate: updateSetings } = useUpdateSettings();

  const form = useForm<AutoFillForm>({
    initialValues: pick(defaultSettings, ["autofill", "autofillDelay", "selectors"]),
  });

  useEffect(() => {
    if (!settings) return;
    form.setInitialValues(pick(settings, ["autofill", "autofillDelay", "selectors"]));
    form.reset();
  }, [settings]);

  const onSubmit = (values: AutoFillForm) => {
    updateSetings(pick(values, ["autofill", "autofillDelay", "selectors"]));
    showNotification({
      title: "Settings saved",
      message: "Auto fill settings have been saved",
      color: "blue",
    });
  };

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack pt="sm">
        <Switch
          label="Autofill"
          description="Autofills the matching element if the URL pattern and HTML selector match"
          checked={form.values.autofill}
          {...form.getInputProps("autofill")}
        />
        <NumberInput
          label="Autofill Delay"
          description="Delay in milliseconds before autofilling the matching element"
          {...form.getInputProps("autofillDelay")}
        />
        <TextInput
          label="Global Selectors"
          description={
            <>
              <Anchor fz={12} href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors" target="_blank">
                CSS selectors
              </Anchor>{" "}
              to use auto fill for all matching URLs.
            </>
          }
          inputContainer={() => (
            <Stack mt={5}>
              <ScrollArea.Autosize mah={300} scrollbarSize={3}>
                <Stack>
                  {form.values.selectors.map((_, index) => (
                    <TextInput
                      key={index}
                      placeholder="input[name='otp']"
                      spellCheck={false}
                      rightSection={
                        <ActionIcon
                          onClick={() => form.removeListItem("selectors", index)}
                          variant="transparent"
                          color="red"
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      }
                      {...form.getInputProps(`selectors.${index}.pattern`)}
                    />
                  ))}
                </Stack>
              </ScrollArea.Autosize>

              <Button
                color="gray"
                variant="light"
                leftSection={<IconPlus />}
                onClick={() =>
                  form.insertListItem("selectors", {
                    pattern: "",
                  })
                }
              >
                Add new
              </Button>
            </Stack>
          )}
        />
        <Button type="submit">Save</Button>
      </Stack>
    </form>
  );
});
