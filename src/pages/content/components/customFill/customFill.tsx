import { Modal } from "@mantine/core";
import { memo, useEffect, useState } from "react";
import { AccountSelectStep } from "../selectAccountStep";
import { useActionAtom } from "../../jotai/actionAtom";
import { useStepAtom } from "../../jotai/stepAtom";
import { useAccountAtom } from "../../jotai/accountAtom";
import { fillInput, getMatchedAccountsByURL } from "../../utils";
import { useAccounts, useUpdateAccount } from "@/queries/accounts";
import { generate } from "@/utils/otp";
import type { HistoryItem } from "@/types";

export const CustomFill = memo(() => {
  const { data: accounts } = useAccounts();
  const { step, setStep } = useStepAtom();
  const { setAction } = useActionAtom();
  const [input, setInput] = useState<HTMLInputElement>();
  const { account, setAccount } = useAccountAtom();
  const { mutate: updateAccount } = useUpdateAccount();

  useEffect(() => {
    if (step !== "idle" || !accounts) return;

    const element = document.activeElement;
    setInput(element as HTMLInputElement);

    const matchedAccounts = getMatchedAccountsByURL(accounts, window.location.href);

    if (matchedAccounts.length === 0) {
      setStep("select-account");
    } else {
      setStep("fill");
      setAccount(matchedAccounts[0]);
    }
  }, [accounts]);

  useEffect(() => {
    if (step !== "fill" || !input || !account) return;
    const token = generate(account);
    fillInput(input, token);

    const history: HistoryItem = {
      timestamp: Date.now(),
      type: "fill",
      description: `Filled OTP code on ${window.location.hostname}`,
      url: window.location.href,
    };

    updateAccount({
      ...account,
      history: [...account.history, history],
    });

    setStep("idle");
    setAction(undefined);
  }, [account, input, step]);

  const onClose = () => {
    setStep("idle");
    setAction(undefined);
  };

  return (
    <Modal title="Fill OTP Code" centered opened={step === "select-account"} onClose={onClose}>
      {step === "select-account" && <AccountSelectStep message="Select account to fill the OTP code" next="fill" />}
    </Modal>
  );
});
