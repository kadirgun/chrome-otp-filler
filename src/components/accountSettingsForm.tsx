import type { OTPAccountSettings } from "@/types";
import {
  Stack,
  Divider,
  Switch,
  NumberInput,
  Accordion,
  TextInput,
  ScrollArea,
  ActionIcon,
  Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconTrash, IconPlus } from "@tabler/icons-react";
import { cloneDeep, merge } from "lodash";
import { isMatch } from "matcher";
import { memo } from "react";

const defaultSettings: OTPAccountSettings = {
  autofill: true,
  autofillDelay: 0,
  selectors: [],
  urls: [],
};

export type AccountSettingsFormProps = {
  settings: OTPAccountSettings;
  onSubmit: (values: OTPAccountSettings) => void;
  fields?: (keyof OTPAccountSettings)[];
};

export const AccountSettingsForm = memo(
  ({
    settings,
    onSubmit,
    fields = Object.keys(defaultSettings) as (keyof OTPAccountSettings)[],
  }: AccountSettingsFormProps) => {
    const form = useForm<OTPAccountSettings>({
      initialValues: merge(cloneDeep(defaultSettings), settings),
      validate: {
        selectors: {
          pattern: (pattern) => {
            try {
              document.querySelector(pattern);
            } catch {
              console.log("Invalid CSS selector");
              return "Invalid CSS selector";
            }
          },
        },
        urls: {
          pattern: (pattern) => {
            if (pattern.trim().length === 0) return "URL pattern is required";

            try {
              isMatch("https://example.com", pattern);
            } catch {
              return "Invalid URL pattern";
            }
          },
        },
      },
    });

    return (
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack>
          <Divider />
          {fields.includes("autofill") && (
            <Switch
              label="Autofill"
              description="Autofills the matching element if the URL pattern and HTML selector match"
              checked={form.values.autofill}
              {...form.getInputProps("autofill")}
            />
          )}

          {fields.includes("autofillDelay") && (
            <NumberInput
              label="Autofill Delay"
              description="Delay in milliseconds before autofilling the matching element"
              min={0}
              {...form.getInputProps("autofillDelay")}
            />
          )}

          <Accordion>
            {fields.includes("selectors") && (
              <Accordion.Item key="selectors" value="selectors">
                <Accordion.Control>Selectors</Accordion.Control>
                <Accordion.Panel>
                  <TextInput
                    description="CSS selectors to use auto fill for all matching URLs"
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
                </Accordion.Panel>
              </Accordion.Item>
            )}

            {fields.includes("urls") && (
              <Accordion.Item key="urls" value="urls">
                <Accordion.Control>URL Patterns</Accordion.Control>
                <Accordion.Panel>
                  <TextInput
                    description="URL patterns to use auto fill for all matching URLs"
                    inputContainer={() => (
                      <Stack mt={5}>
                        <ScrollArea.Autosize mah={300} scrollbarSize={3}>
                          <Stack>
                            {form.values.urls.map((_, index) => (
                              <TextInput
                                key={index}
                                placeholder="*.example.com"
                                spellCheck={false}
                                rightSection={
                                  <ActionIcon
                                    onClick={() => form.removeListItem("urls", index)}
                                    variant="transparent"
                                    color="red"
                                  >
                                    <IconTrash size={16} />
                                  </ActionIcon>
                                }
                                {...form.getInputProps(`urls.${index}.pattern`)}
                              />
                            ))}
                          </Stack>
                        </ScrollArea.Autosize>

                        <Button
                          color="gray"
                          variant="light"
                          leftSection={<IconPlus />}
                          onClick={() =>
                            form.insertListItem("urls", {
                              pattern: "",
                            })
                          }
                        >
                          Add new
                        </Button>
                      </Stack>
                    )}
                  />
                </Accordion.Panel>
              </Accordion.Item>
            )}
          </Accordion>

          <Button type="submit">Save</Button>
        </Stack>
      </form>
    );
  }
);
