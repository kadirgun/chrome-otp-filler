import { AccountSelectList } from "@/components/accountSelectList";
import { useAccountsContext } from "@/pages/options/contexts/accounts";
import { useAccounts, useRemoveAccount } from "@/queries/accounts";
import type { OTPAccount } from "@/types";
import { Modal, Text } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { memo } from "react";

export const DeleteAccountsModal = memo(() => {
  const { updateOptions } = useAccountsContext();
  const { data: accounts } = useAccounts();
  const { mutate: removeAccounts } = useRemoveAccount();

  const handleRemove = (values: OTPAccount[]) => {
    removeAccounts(values.map((account) => account.id));

    showNotification({
      title: "Accounts deleted",
      message: "Accounts were successfully deleted",
      color: "orange",
    });

    onClose();
  };

  const onConfirm = (values: OTPAccount[]) => {
    openConfirmModal({
      title: "Delete accounts",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this OTP accounts? This action is irreversible and account data will be lost.
        </Text>
      ),
      labels: { confirm: "Delete account", cancel: "No don't delete it" },
      confirmProps: { color: "red" },
      onConfirm: () => handleRemove(values),
    });
  };

  const onClose = () => {
    updateOptions((state) => {
      state.showDeleteModal = false;
    });
  };

  if (!accounts) return null;

  return (
    <Modal centered title="Delete accounts" opened={true} onClose={onClose}>
      <AccountSelectList message="Select accounts to delete" multiple onConfirm={onConfirm} accounts={accounts} />
    </Modal>
  );
});
