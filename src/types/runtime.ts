export type RuntimeMessageType =
  | "get-password"
  | "set-password"
  | "add-qrcode"
  | "error"
  | "scan-qrcode"
  | "get-data-url"
  | "add-selector"
  | "add-url"
  | "fill-input";

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
