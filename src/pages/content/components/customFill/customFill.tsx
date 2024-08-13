import { Modal } from "@mantine/core";
import { memo, useEffect, useState } from "react";
import { AccountSelectStep } from "../selectAccountStep";
import { useMessageAtom } from "../../jotai/messageAtom";
import { useStepAtom } from "../../jotai/stepAtom";
import { useAccountAtom } from "../../jotai/accountAtom";
import { fillInput, getMatchedAccountsByURL } from "../../utils";
import { useAccounts, useUpdateAccount } from "@/queries/accounts";
import { generate } from "@/utils/otp";
import type { HistoryItem } from "@/types";
import { usePasswordGuard } from "@/hooks/usePasswordGuard";
import type { AskPasswordMessage } from "@/types/runtime";
import { get, isNull } from "lodash";

export const CustomFill = memo(() => {
  const { data: accounts } = useAccounts();
  const { step, setStep } = useStepAtom();
  const { message, setMessage } = useMessageAtom();
  const [input, setInput] = useState<HTMLInputElement>();
  const { account, setAccount } = useAccountAtom();
  const { mutate: updateAccount } = useUpdateAccount();
  const guard = usePasswordGuard();

  useEffect(() => {
    console.log("CustomFill mounted");
  }, []);

  useEffect(() => {
    if (step !== "idle" || !accounts || isNull(guard)) return;

    if (guard) {
      const message: AskPasswordMessage = {
        type: "ask-password",
        data: {
          prompt: "Enter your password to fill the OTP code",
          next: {
            type: "fill-input",
            data: {
              input: document.activeElement,
            },
          },
        },
      };

      return setMessage(message);
    }

    const messageInput = get(message, "data.input");
    const element = messageInput || document.activeElement;
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

    onClose();
  }, [account, input, step]);

  const onClose = () => {
    setStep("idle");
    setMessage({
      type: "auto-fill",
    });
  };

  return (
    <Modal title="Fill OTP Code" centered opened={step === "select-account"} onClose={onClose}>
      <AccountSelectStep message="Select account to fill the OTP code" next="fill" />
    </Modal>
  );
});
