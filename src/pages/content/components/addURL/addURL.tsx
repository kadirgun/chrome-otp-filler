import { Modal } from "@mantine/core";
import { useStepAtom } from "../../jotai/stepAtom";
import { AccountSelectStep } from "../selectAccountStep";
import { SetURLStep } from "../setURLStep";
import { UpdateAccountStep } from "../updateSettingsStep";
import { useEffect } from "react";
import { useActionAtom } from "../../jotai/actionAtom";

export const AddURL = () => {
  const { step, setStep } = useStepAtom();
  const { setAction } = useActionAtom();

  useEffect(() => {
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
    <Modal title="Add URL" centered opened={step !== "idle"} onClose={onClose}>
      {step === "select-account" && <AccountSelectStep message="Select account to add to the URL" next="set-url" />}
      {step === "set-url" && <SetURLStep next="update-account" />}
      {step === "update-account" && <UpdateAccountStep next="finish" />}
    </Modal>
  );
};
