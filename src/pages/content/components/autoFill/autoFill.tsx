import { useGenerateOTP } from "@/hooks/useGenerateOTP";
import { useAccounts, useUpdateAccount } from "@/queries/accounts";
import { memo, useEffect, useMemo, useState } from "react";
import { fillInput, getMatchedAccountsBySelector, getMatchedAccountsByURL } from "../../utils";
import { useInterval, useLocationSelector } from "@reactuses/core";
import { useSettings } from "@/queries/settings";
import { OTPAccount, type HistoryItem } from "@/types";
import { usePasswordGuard } from "@/hooks/usePasswordGuard";
import { useMessageAtom } from "../../jotai/messageAtom";
import type { AskPasswordMessage } from "@/types/runtime";
import { isNull } from "lodash";

export const AutoFill = memo(() => {
  const { data: accounts } = useAccounts();
  const [input, setInput] = useState<HTMLInputElement>();
  const [account, setAccount] = useState<OTPAccount>();
  const { data: settings } = useSettings();
  const location = useLocationSelector((location) => location.href);
  const { mutate: updateAccount } = useUpdateAccount();
  const guard = usePasswordGuard();
  const { token } = useGenerateOTP(account, !!guard);
  const { setMessage } = useMessageAtom();

  useEffect(() => {
    console.log("AutoFill mounted");
  }, []);

  const autoFillEnabledAccounts = useMemo(() => {
    if (!accounts || !location) return;
    return getMatchedAccountsByURL(accounts, location).filter((account) => account.settings.autofill);
  }, [accounts, location]);

  useEffect(() => {
    if (isActive.current) return;
    resume();
  }, [autoFillEnabledAccounts]);

  const { pause, resume, isActive } = useInterval(async () => {
    if (!settings || !autoFillEnabledAccounts) return;

    if (autoFillEnabledAccounts.length === 0) {
      return pause();
    }

    const matchedBySelectorAccounts = getMatchedAccountsBySelector(autoFillEnabledAccounts);

    if (matchedBySelectorAccounts.length === 0) {
      const matchedElementByGlobalSelectors = settings.selectors
        .map((selector) => {
          return document.querySelector(selector.pattern);
        })
        .filter(Boolean)
        .at(0);

      if (!matchedElementByGlobalSelectors) return;

      setInput(matchedElementByGlobalSelectors as HTMLInputElement);
      setAccount(autoFillEnabledAccounts.at(0)!);
    } else {
      const { account, element } = matchedBySelectorAccounts.at(0)!;
      setInput(element);
      setAccount(account);
    }
  }, 300);

  useEffect(() => {
    console.log("autofill timer", isActive.current);
  }, [isActive]);

  useEffect(() => {
    if (isNull(guard)) return;
    if (!input || !account) return;

    pause();

    if (guard) {
      const message: AskPasswordMessage = {
        type: "ask-password",
        data: {
          prompt: "Enter your password to autofill OTP code",
          next: {
            type: "auto-fill",
          },
        },
      };

      return setMessage(message);
    }

    const history: HistoryItem = {
      timestamp: Date.now(),
      type: "autofill",
      description: `Auto-filled OTP code on ${window.location.hostname}`,
      url: window.location.href,
    };

    updateAccount({
      ...account,
      history: [...account.history, history],
    });
  }, [input]);

  useEffect(() => {
    if (!input || !token) return;
    fillInput(input, token);
  }, [input, token]);

  return null;
});
