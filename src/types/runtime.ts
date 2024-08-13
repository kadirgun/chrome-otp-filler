export type RuntimeMessageType =
  | "get-password"
  | "set-password"
  | "ask-password"
  | "add-accounts"
  | "add-qrcode"
  | "error"
  | "scan-qrcode"
  | "get-data-url"
  | "add-selector"
  | "add-url"
  | "fill-input"
  | "auto-fill";

type DefaultData = undefined;

export type RuntimeMessage<T = DefaultData> = T extends DefaultData
  ? {
      type: RuntimeMessageType;
      data?: any;
    }
  : {
      type: RuntimeMessageType;
      data: T;
    };

export type QRCodeMessageData = {
  src?: string;
  url?: string;
  error?: string;
};

export type QRCodeMessage = RuntimeMessage<QRCodeMessageData>;

export type AskPasswordMessageData = {
  prompt: string;
  next?: RuntimeMessage;
};

export type AskPasswordMessage = RuntimeMessage<AskPasswordMessageData>;
