import { useAccountsContext } from "@/pages/options/contexts/accounts";
import type { OTPAccount } from "@/types";
import { generateMigrationURL } from "@/utils/otp";
import { Modal, Image, Center } from "@mantine/core";
import { memo, useState } from "react";
import { toDataURL } from "qrcode";
import { showNotification } from "@mantine/notifications";
import { useAccounts, useUpdateAccount } from "@/queries/accounts";
import { AccountSelectList } from "@/components/accountSelectList";

export const ExportAccountsModal = memo(() => {
  const { data: accounts } = useAccounts();
  const { updateOptions } = useAccountsContext();
  const [qrCode, setQRCode] = useState<string>();
  const { mutate: updateAccounts } = useUpdateAccount();

  const onClose = () => {
    updateOptions((draft) => {
      draft.showExportModal = false;
    });
  };

  const onExport = (value: OTPAccount[]) => {
    try {
      const url = generateMigrationURL(value);
      toDataURL(url, {
        type: "image/webp",
      }).then(setQRCode);

      updateAccounts(
        value.map((account) => ({
          ...account,
          history: [
            ...account.history,
            {
              timestamp: Date.now(),
              type: "qrcode",
              description: "Generated migration QR code",
              url: "",
            },
          ],
        }))
      );
    } catch (error: any) {
      console.error(error);
      showNotification({
        title: "Error",
        message: "Failed to generate migration URL",
        color: "red",
      });
    }
  };

  if (!accounts) return null;

  return (
    <Modal centered title="Export accounts" opened={true} onClose={onClose}>
      {qrCode ? (
        <Center
          w="100%"
          bg="white"
          style={{
            aspectRatio: 1,
          }}
        >
          <Image src={qrCode} />
        </Center>
      ) : (
        <AccountSelectList
          multiple
          accounts={accounts}
          message="Select accounts to export as migration QR code"
          onConfirm={onExport}
        />
      )}
    </Modal>
  );
});
