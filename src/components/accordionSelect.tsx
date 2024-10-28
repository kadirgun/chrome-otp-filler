import { Stack, Group, Checkbox, ScrollArea, Accordion, Center, Box, Button, Notification } from "@mantine/core";
import { useState, useEffect, useMemo, useRef, memo } from "react";

export type AccordionSelectProps<T = any> = {
  title: (item: T) => string;
  info: (item: T, index: number) => React.ReactNode;
  data: T[];
  multiple?: boolean;
  onConfirm: (item: T[]) => void;
  message?: string;
  initialSelect?: number[];
};

export const AccordionSelect = memo(function <T>({
  data,
  multiple,
  onConfirm,
  message,
  title,
  info,
  initialSelect,
}: AccordionSelectProps<T>) {
  const [selected, setSelected] = useState<number[]>([]);
  const initialized = useRef(false);

  const handleSelect = (index: number, checked: boolean) => {
    const oldSelected = [...selected];

    if (!multiple) {
      oldSelected.splice(0, oldSelected.length);
    }

    setSelected((current) => {
      if (checked) {
        return [...oldSelected, index];
      }

      return current.filter((i) => i !== index);
    });
  };

  useEffect(() => {
    if (initialized.current) return;
    if (initialSelect) {
      setSelected(initialSelect);
    } else if (!multiple) {
      setSelected([0]);
    } else {
      setSelected(data.map((_, index) => index));
    }
    initialized.current = true;
  }, [data, multiple]);

  const isAllSelected = useMemo(() => selected.length === data.length, [selected, data]);
  const isİntermediateSelected = useMemo(() => selected.length > 0 && selected.length < data.length, [selected, data]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelected(data.map((_, index) => index));
    } else {
      setSelected([]);
    }
  };

  const handleSubmit = () => {
    onConfirm(selected.map((index) => data[index]));
  };

  return (
    <Stack pt="sm">
      {message && <Notification withCloseButton={false}>{message}</Notification>}

      <Group justify="end" pr="sm">
        {multiple && (
          <Checkbox
            checked={isAllSelected}
            indeterminate={isİntermediateSelected}
            onChange={(event) => handleSelectAll(event.target.checked)}
            label="Select All"
            labelPosition="left"
          />
        )}
      </Group>

      <ScrollArea.Autosize mah={500} scrollbarSize={3}>
        <Accordion chevronPosition="left" p={0}>
          {data.map((item, index) => (
            <Accordion.Item key={index} value={`${index}`}>
              <Center pos="relative">
                <Accordion.Control>{title(item)}</Accordion.Control>
                <Box pos="absolute" right={0} p="sm">
                  <Checkbox
                    checked={selected.includes(index)}
                    onChange={(event) => handleSelect(index, event.target.checked)}
                  />
                </Box>
              </Center>

              <Accordion.Panel>{info(item, index)}</Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </ScrollArea.Autosize>

      <Button onClick={handleSubmit} disabled={selected.length === 0}>
        Submit
      </Button>
    </Stack>
  );
}) as <T>(props: AccordionSelectProps<T>) => JSX.Element;
