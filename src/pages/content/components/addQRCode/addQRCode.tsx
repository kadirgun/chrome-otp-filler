import type { QRCodeMessageData } from "@/types/runtime";
import { memo, useEffect } from "react";
import { imageDataFromURL, scanQRCode } from "@/utils/otp";
import { useAccountsAtom } from "../../jotai/accountsAtom";
import { useActionAtom } from "../../jotai/actionAtom";

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
  const { action } = useActionAtom();
  const scan = async (data: QRCodeMessageData) => {
    if (!data.url) return;
    const element = findImageElement(data.src);
    if (!element) return;

    const image = await imageDataFromURL(data.url);
    const accounts = await scanQRCode(image);

    setAccounts(accounts);
  };

  useEffect(() => {
    const data = action?.data as QRCodeMessageData;
    scan(data);
  }, []);

  return null;
});
