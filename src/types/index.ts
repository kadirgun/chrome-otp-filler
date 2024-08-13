import type { algorithms } from "@/utils/constants";

export type HistoryItem = {
  timestamp: number;
  type: "copy" | "autofill" | "create" | "edit" | "settings" | "protect" | "unprotect" | "fill" | "qrcode";
  url: string;
  description?: string;
};

export type OTPAccount = {
  id: string;
  label: string;
  issuer: string;
  algorithm: (typeof algorithms)[number];
  digits: number;
  period: number;
  secret: string;
  history: HistoryItem[];
  settings: OTPAccountSettings;
  encrypted: boolean;
};

export type OTPAccountSettings = {
  autofill: boolean;
  autofillDelay: number;
  urls: OTPSelector[];
  selectors: OTPSelector[];
};

export type OTPSelector = {
  pattern: string;
};

export type UserSettings = {
  algorithm: (typeof algorithms)[number];
  digits: number;
  period: number;
  autofill: boolean;
  autofillDelay: number;
  selectors: OTPSelector[];
  protected: boolean;
  password: string;
  salt: string;
};

export type User = {
  password?: string;
};
