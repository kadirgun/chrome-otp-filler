import { useAccountContext } from "@/pages/options/contexts/account";
import { Flex, Image, Modal } from "@mantine/core";
import { memo, useEffect, useState } from "react";
import { TOTP } from "otpauth";
import { useQRCode } from "@reactuses/core/useQRCode";
import { showNotification } from "@mantine/notifications";
import { useUpdateAccount } from "@/queries/accounts";

export const AccountQRCodeModal = memo(() => {
  const { updateUI, account } = useAccountContext();
  const [url, setUrl] = useState<string>();
  const { mutate: updateAccount } = useUpdateAccount();

  const onClose = () => {
    updateUI((draft) => {
      draft.isQRCodeModalOpen = false;
    });
  };

  useEffect(() => {
    if (!account) return;

    try {
      const totp = new TOTP(account);
      const newURL = totp.toString();

      if (newURL === url) return;

      setUrl(newURL);

      updateAccount({
        ...account,
        history: [
          ...account.history,
          {
            timestamp: Date.now(),
            type: "qrcode",
            description: "Generated QR code",
            url: "",
          },
        ],
      });
    } catch {
      showNotification({
        title: "Error",
        message: "Failed to generate QR code",
        color: "red",
      });
    }
  }, [account]);

  const { qrCode } = useQRCode(url || "", {
    width: 512,
  });

  if (!url) return null;

  return (
    <Modal size="xs" centered title={`${account.label} QR Code`} opened={true} onClose={onClose}>
      <Flex
        justify="center"
        align="center"
        style={{
          aspectRatio: 1,
        }}
      >
        <Image src={qrCode} w="100%" h="100%" />
      </Flex>
    </Modal>
  );
});
