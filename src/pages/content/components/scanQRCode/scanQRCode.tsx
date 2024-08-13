import { useEffect, useState } from "react";
import { scanQRCode } from "@/utils/otp";
import { Box } from "@mantine/core";
import { useEventListener } from "@reactuses/core";
import { useAccountsAtom } from "../../jotai/accountsAtom";
import { useMessageAtom } from "../../jotai/messageAtom";
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop";
import { showNotification } from "@mantine/notifications";

const overflow = document.body.style.overflow;

export const ScanQRCode = () => {
  const { setAccounts } = useAccountsAtom();
  const { message: action, setMessage: setAction } = useMessageAtom();
  const [crop, setCrop] = useState<Crop>();

  const onClose = () => {
    console.log(overflow);
    document.body.style.overflow = overflow || "";
    setAction(undefined);
  };

  const onComplete = async (crop: PixelCrop) => {
    console.log(crop);
    if (crop.width < 50 || crop.height < 50) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const image = document.createElement("img");
    image.onload = async () => {
      canvas.width = image.width;
      canvas.height = image.height;

      ctx.drawImage(image, 0, 0);

      const imageData = ctx.getImageData(crop.x, crop.y, crop.width, crop.height);

      try {
        const accounts = await scanQRCode(imageData);

        setAccounts(accounts);
      } catch (error: any) {
        console.error(error);
        showNotification({
          title: "Error",
          message: error.message || "An error occurred",
          color: "red",
        });
      }

      onClose();
    };
    image.src = action.data;
  };

  useEventListener("keydown", (event) => {
    if (event.key == "Escape") {
      onClose();
    }
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
  }, []);

  if (action?.type !== "scan-qrcode") return null;

  return (
    <ReactCrop
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 2147483647,
        overflow: "hidden",
      }}
      crop={crop}
      onChange={setCrop}
      onComplete={onComplete}
    >
      <Box w="100vw" h="100vh" />
    </ReactCrop>
  );
};
