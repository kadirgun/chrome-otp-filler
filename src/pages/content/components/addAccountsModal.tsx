import { Modal } from "@mantine/core";
import { useAccountsAtom } from "../jotai/accountsAtom";
import { useAddAccount } from "@/queries/accounts";
import type { OTPAccount } from "@/types";
import { showNotification } from "@mantine/notifications";
import { useActionAtom } from "../jotai/actionAtom";
import { AccountSelectList } from "@/components/accountSelectList";

export const AddAccountsModal = () => {
  const { accounts, setAccounts } = useAccountsAtom();
  const { mutate: addAccounts } = useAddAccount();
  const { setAction } = useActionAtom();

  const onClose = () => {
    setAccounts(undefined);
    setAction(undefined);
  };

  const onSubmit = (values: OTPAccount[]) => {
    addAccounts({
      ...values,
      history: [
        {
          timestamp: Date.now(),
          type: "create",
          description: `Account created via QR code on ${window.location.href}`,
          url: window.location.href,
        },
      ],
    });

    showNotification({
      title: "Success",
      message: "Accounts added",
      color: "teal",
    });
    onClose();
  };

  if (!accounts) return null;

  return (
    <Modal centered title="Create OTP Account" opened={true} onClose={onClose}>
      <AccountSelectList accounts={accounts} onConfirm={onSubmit} message="Select OTP accounts to add" />
    </Modal>
  );
};
