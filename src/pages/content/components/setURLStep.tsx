import { useAccountAtom } from "@/pages/content/jotai/accountAtom";
import { useStepAtom, type Step } from "@/pages/content/jotai/stepAtom";
import { Button, Notification, Stack, TextInput } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { cloneDeep } from "lodash";

export type SetURLStepProps = {
  next: Step;
};

export const SetURLStep = ({ next }: SetURLStepProps) => {
  const [pattern, setPattern] = useInputState(`${location.protocol}//${location.hostname}/*`);
  const { account, setAccount } = useAccountAtom();
  const { setStep } = useStepAtom();

  const handleContinue = () => {
    const newAccount = cloneDeep(account);
    if (!newAccount) return;

    const exists = newAccount.settings.urls.some((url) => url.pattern === pattern);
    if (!exists) {
      newAccount.settings.urls.push({
        pattern: pattern,
      });
    }

    setAccount(newAccount);
    setStep(next);
  };

  return (
    <Stack>
      <Notification withCloseButton={false}>
        The selected account does not have a URL pattern that matches this page.
      </Notification>

      <TextInput label="URL Pattern" placeholder="*://example.com/*" value={pattern} onChange={setPattern} />

      <Button onClick={handleContinue}>Continue</Button>
    </Stack>
  );
};
