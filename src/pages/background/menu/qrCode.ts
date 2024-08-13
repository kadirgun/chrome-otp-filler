import type { QRCodeMessage, QRCodeMessageData } from "@/types/runtime";

export const handleQRCode = async (info: chrome.contextMenus.OnClickData): Promise<QRCodeMessage> => {
  const data = await parseURL(info.srcUrl);

  return {
    type: "add-qrcode",
    data,
  };
};

export const parseURL = async (url?: string): Promise<QRCodeMessageData> => {
  if (!url) return { error: "No URL provided" };

  if (url.startsWith("data:")) return { src: url, url };

  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const buffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = "";
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);
    const data = `data:${blob.type};base64,${base64}`;

    return {
      src: url,
      url: data,
    };
  } catch (error) {
    return { error: "Invalid URL" };
  }
};
