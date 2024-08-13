import { Modal } from "@mantine/core";
import { useAccountsAtom } from "../jotai/accountsAtom";
import { useAddAccount } from "@/queries/accounts";
import type { HistoryItem, OTPAccount } from "@/types";
import { showNotification } from "@mantine/notifications";
import { useMessageAtom } from "../jotai/messageAtom";
import { AccountSelectList } from "@/components/accountSelectList";
import { usePasswordGuard } from "@/hooks/usePasswordGuard";
import { useEffect } from "react";
import type { AskPasswordMessage } from "@/types/runtime";
import { isNull } from "lodash";

export const AddAccountsModal = () => {
  const { accounts, setAccounts } = useAccountsAtom();
  const { mutateAsync: addAccounts, isPending } = useAddAccount();
  const { setMessage } = useMessageAtom();
  const guard = usePasswordGuard();

  const onClose = () => {
    setAccounts(undefined);
    setMessage(undefined);
  };

  const onSubmit = (values: OTPAccount[]) => {
    if (isPending) return;

    const history: HistoryItem = {
      timestamp: Date.now(),
      type: "create",
      description: `Account created via QR code on ${window.location.href}`,
      url: window.location.href,
    };

    const newAccounts = values.map((value) => ({
      ...value,
      history: [...value.history, history],
    }));

    addAccounts(newAccounts).then(() => {
      showNotification({
        title: "Success",
        message: "Accounts added",
        color: "teal",
      });

      onClose();
    });
  };

  useEffect(() => {
    if (guard) {
      const message: AskPasswordMessage = {
        type: "ask-password",
        data: {
          prompt: "Enter your password to add accounts",
          next: {
            type: "add-accounts",
          },
        },
      };

      setMessage(message);
    }
  }, [guard]);

  if (!accounts || isNull(guard)) return null;

  return (
    <Modal centered title="Create OTP Account" opened={true} onClose={onClose}>
      <AccountSelectList accounts={accounts} onConfirm={onSubmit} message="Select OTP accounts to add" />
    </Modal>
  );
};
