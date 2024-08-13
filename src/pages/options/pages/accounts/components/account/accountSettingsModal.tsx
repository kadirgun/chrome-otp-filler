import { useAccountContext } from "@/pages/options/contexts/account";
import { OTPAccountSettings } from "@/types";
import { Modal } from "@mantine/core";
import { memo } from "react";
import { showNotification } from "@mantine/notifications";
import { useUpdateAccount } from "@/queries/accounts";
import { AccountSettingsForm } from "@/components/accountSettingsForm";

export const AccountSettingsModal = memo(() => {
  const { account, updateUI } = useAccountContext();
  const { mutate: updateAccount } = useUpdateAccount();

  const onClose = () => {
    updateUI((draft) => {
      draft.isSettingsModalOpen = false;
    });
  };

  const onSubmit = (values: OTPAccountSettings) => {
    updateAccount({
      ...account,
      settings: values,
      history: [
        ...account.history,
        {
          timestamp: Date.now(),
          type: "settings",
          description: `Settings updated`,
          url: "",
        },
      ],
    });

    showNotification({
      title: "Settings saved",
      message: "Account settings were successfully saved",
      color: "blue",
    });
  };

  return (
    <Modal centered title="Account Settings" opened={true} onClose={onClose}>
      <AccountSettingsForm settings={account.settings} onSubmit={onSubmit} />
    </Modal>
  );
});
