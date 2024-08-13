import { AccordionSelect } from "@/components/accordionSelect";
import { TextInput } from "@mantine/core";
import { memo } from "react";
import { cloneDeep } from "lodash";
import { isURLMatchAccount } from "@/pages/content/utils";
import { useAccountAtom } from "@/pages/content/jotai/accountAtom";
import { useAttributesAtom, type SelectorAttribute } from "@/pages/content/jotai/attributesAtom";
import { useStepAtom, type Step } from "@/pages/content/jotai/stepAtom";

export type SelectAttributesStepProps = {
  next: Step;
};

export const SelectAttributesStep = memo(({ next }: SelectAttributesStepProps) => {
  const { account, setAccount } = useAccountAtom();
  const { attributes, setAttributes } = useAttributesAtom();
  const { setStep } = useStepAtom();

  const onConfirmSelectors = (selected: SelectorAttribute[]) => {
    const newAccount = cloneDeep(account);

    if (!newAccount) return;

    const selectors = selected.map((attribute) => `[${attribute.name}="${attribute.value}"]`);

    const pattern = attributes.at(0)!.tag + selectors.join("");

    newAccount.settings.selectors.push({
      pattern: pattern,
    });

    const urlMatch = isURLMatchAccount(newAccount, window.location.href);

    setAccount(newAccount);

    setStep(urlMatch ? next : "set-url");
  };

  const handleChange = (index: number, value: string) => {
    const newAttributes = [...attributes];
    newAttributes[index].value = value;

    setAttributes(newAttributes);
  };

  return (
    <AccordionSelect<SelectorAttribute>
      data={attributes}
      multiple={true}
      message="Select attributes to create a selector"
      title={(attribute) => attribute.name}
      info={(attribute, index) => (
        <TextInput
          value={attribute.value}
          label="Attribute Value"
          onChange={(event) => handleChange(index, event.target.value)}
          spellCheck={false}
        />
      )}
      onConfirm={onConfirmSelectors}
    />
  );
});
