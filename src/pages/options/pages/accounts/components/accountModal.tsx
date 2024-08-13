import { useAccountsContext } from "@/pages/options/contexts/accounts";
import { AccountForm } from "@/pages/options/components/accountForm";
import { QRCodeForm } from "@/pages/options/components/qrCodeForm";
import type { OTPAccount } from "@/types";
import { Modal, Tabs } from "@mantine/core";
import { IconQrcode, IconForms } from "@tabler/icons-react";
import { memo, useMemo, useState } from "react";
import { VisibleError } from "@/errors/visible";
import { showNotification } from "@mantine/notifications";
import { useAddAccount, useUpdateAccount } from "@/queries/accounts";

export const AccountModal = memo(() => {
  const { options, updateOptions } = useAccountsContext();
  const { mutate: addAccounts } = useAddAccount();
  const { mutate: updateAccount } = useUpdateAccount();
  const [activeTab, setActiveTab] = useState<string | null>(options.account ? "secret-key" : "qr-code");

  const action = useMemo(() => (options.account ? "update" : "create"), [options.account]);

  const title = useMemo(() => {
    return action === "update" ? "Edit OTP Account" : "Create OTP Account";
  }, [options.account]);

  const onClose = () => {
    updateOptions((draft) => {
      draft.showAccountModal = false;
      draft.account = undefined;
    });
  };

  const handleSubmit = (value: OTPAccount | OTPAccount[]) => {
    const createEventDescription =
      activeTab === "qr-code" ? "Account created from QR code" : "Account created from secret key";
    const updateEventDescription = activeTab === "qr-code" ? "Account updated from QR code" : "Account updated";

    try {
      if (action === "create") {
        const accounts = Array.isArray(value) ? value : [value];

        addAccounts(
          accounts.map((account) => {
            account.history.push({
              timestamp: Date.now(),
              description: createEventDescription,
              type: "create",
              url: "",
            });

            return account;
          })
        );

        showNotification({
          title: "Success",
          message: "Account(s) added successfully",
          color: "blue",
        });
      } else if (action === "update") {
        const newAccount = Array.isArray(value) ? value[0] : value;

        updateAccount({
          ...newAccount,
          id: options.account!.id,
          history: [
            ...newAccount.history,
            {
              timestamp: Date.now(),
              description: updateEventDescription,
              type: "edit",
              url: "",
            },
          ],
        });

        showNotification({
          title: "Success",
          message: "Account updated successfully",
          color: "blue",
        });
      }

      onClose();
    } catch (error) {
      console.error(error);
      const message = error instanceof VisibleError ? error.message : "An error occurred while saving account(s)";
      showNotification({
        title: "Error",
        message: message,
        color: "red",
      });
    }
  };

  return (
    <Modal centered title={title} opened={true} onClose={onClose} closeOnClickOutside={false}>
      <Tabs defaultValue={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="qr-code" leftSection={<IconQrcode size={16} />}>
            QR Code
          </Tabs.Tab>
          <Tabs.Tab value="secret-key" leftSection={<IconForms size={16} />}>
            Secret Key
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="qr-code">
          <QRCodeForm action={action} onSubmit={handleSubmit} />
        </Tabs.Panel>

        <Tabs.Panel value="secret-key">
          <AccountForm account={options.account} onSubmit={handleSubmit} action={action} />
        </Tabs.Panel>
      </Tabs>
    </Modal>
  );
});
