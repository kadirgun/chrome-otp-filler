import { AccountSettingsForm } from "@/components/accountSettingsForm";
import { useAccountAtom } from "@/pages/content/jotai/accountAtom";
import { useAttributesAtom } from "@/pages/content/jotai/attributesAtom";
import { useStepAtom, type Step } from "@/pages/content/jotai/stepAtom";
import { useUpdateAccount } from "@/queries/accounts";
import type { HistoryItem, OTPAccountSettings } from "@/types";
import { Notification, Stack } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { memo } from "react";

export type UpdateAccountStepProps = {
  next: Step;
};

export const UpdateAccountStep = memo(({ next }: UpdateAccountStepProps) => {
  const { mutateAsync: updateAccount, isPending } = useUpdateAccount();
  const { account, setAccount } = useAccountAtom();
  const { setStep } = useStepAtom();
  const { setAttributes } = useAttributesAtom();

  const onSubmit = (values: OTPAccountSettings) => {
    if (!account || isPending) return;

    const history: HistoryItem = {
      timestamp: Date.now(),
      type: "settings",
      description: `Settings updated on ${window.location.hostname}`,
      url: window.location.href,
    };

    updateAccount({
      ...account,
      settings: values,
      history: [...account.history, history],
    }).then(() => {
      showNotification({
        title: "Settings saved",
        message: "Account settings were successfully saved",
        color: "blue",
      });

      setStep(next);
      setAccount(undefined);
      setAttributes([]);
    });
  };

  if (!account) return null;

  return (
    <Stack>
      <Notification withCloseButton={false}>Review and update the account settings</Notification>
      <AccountSettingsForm settings={account.settings} onSubmit={onSubmit} fields={["urls", "selectors"]} />
    </Stack>
  );
});
