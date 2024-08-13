import { Modal } from "@mantine/core";
import { memo, useEffect } from "react";
import { AccountSelectStep } from "../selectAccountStep";
import { SelectAttributesStep } from "./selectAttributesStep";
import { SetURLStep } from "../setURLStep";
import { UpdateAccountStep } from "../updateSettingsStep";
import { useAttributesAtom } from "../../jotai/attributesAtom";
import { useStepAtom } from "../../jotai/stepAtom";
import { useActionAtom } from "../../jotai/actionAtom";

export const AddSelector = memo(() => {
  const { setAttributes } = useAttributesAtom();
  const { step, setStep } = useStepAtom();
  const { setAction } = useActionAtom();

  useEffect(() => {
    if (step !== "idle") return;
    const element = document.activeElement as HTMLElement;
    if (!element) return;
    const attributes = Array.from(element.attributes).map((attribute) => ({
      name: attribute.name,
      value: attribute.value,
      tag: element.tagName.toLowerCase(),
    }));

    setAttributes(attributes);
    setStep("select-account");
  }, []);

  const onClose = () => {
    setStep("idle");
    setAction(undefined);
  };

  useEffect(() => {
    if (step === "finish") {
      onClose();
    }
  }, [step]);

  return (
    <Modal title="Add Selector" centered opened={step !== "idle"} onClose={onClose}>
      {step === "select-account" && (
        <AccountSelectStep message="Select account to add to the selector" next="select-attributes" />
      )}
      {step === "select-attributes" && <SelectAttributesStep next="update-account" />}
      {step === "set-url" && <SetURLStep next="update-account" />}
      {step === "update-account" && <UpdateAccountStep next="finish" />}
    </Modal>
  );
});
