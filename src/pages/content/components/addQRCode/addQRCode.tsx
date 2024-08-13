import type { QRCodeMessageData } from "@/types/runtime";
import { memo, useEffect } from "react";
import { imageDataFromURL, scanQRCode } from "@/utils/otp";
import { useAccountsAtom } from "../../jotai/accountsAtom";
import { useMessageAtom } from "../../jotai/messageAtom";

const findImageElement = (src?: string) => {
  if (!src) return;
  const urls = [
    src,
    src.replace(location.origin, ""),
    src.replace(location.href, ""),
    src.replace("https://", "//"),
    src.replace("http://", "//"),
  ];

  for (const url of urls) {
    const img = document.querySelector(`[src="${url}"]`);
    if (img) return img;
  }
};

export const AddQRCode = memo(() => {
  const { setAccounts } = useAccountsAtom();
  const { message, setMessage } = useMessageAtom();

  useEffect(() => {
    console.log("AddQRCode mounted");
  }, []);

  const scan = async (data: QRCodeMessageData) => {
    if (!data.url) return;
    const element = findImageElement(data.src);
    if (!element) return;

    const image = await imageDataFromURL(data.url);
    const accounts = await scanQRCode(image);

    setAccounts(accounts);
    setMessage({ type: "add-accounts" });
  };

  useEffect(() => {
    if (!message) return;
    const data = message.data as QRCodeMessageData;
    scan(data);
  }, []);

  return null;
});
