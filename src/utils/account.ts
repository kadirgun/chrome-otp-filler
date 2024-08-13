import type { OTPAccount } from "@/types";
import { deepMerge } from "@mantine/core";
import { uuid } from "./uuid";
import crypto from "crypto-js";
import { isMatch } from "matcher";
import { cloneDeep } from "lodash";

export const mergeAccount = (account?: Partial<OTPAccount>): OTPAccount => {
  const defaults: OTPAccount = {
    id: uuid(),
    label: "",
    issuer: "",
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: "",
    encrypted: false,
    history: [],
    settings: {
      autofill: true,
      autofillDelay: 0,
      urls: [],
      selectors: [],
    },
  };

  if (account) {
    return deepMerge(cloneDeep(defaults), account);
  }

  return defaults;
};

export const encryptAccount = (account: OTPAccount, password: string): OTPAccount => {
  if (account.encrypted) return account;
  return {
    ...account,
    secret: crypto.AES.encrypt(account.secret, password).toString(),
    encrypted: true,
  };
};

export const decryptAccount = (account: OTPAccount, password: string): OTPAccount => {
  if (!account.encrypted) return account;
  return {
    ...account,
    secret: crypto.AES.decrypt(account.secret, password).toString(crypto.enc.Utf8),
    encrypted: false,
  };
};

export const isURLMatchAccount = (account: OTPAccount, url: string) => {
  return account.settings.urls.some((matcher) => isMatch(url, matcher.pattern));
};

export const sortAccountByURLMatch = (accounts: OTPAccount[], url: string) => {
  return accounts.sort((_, b) => {
    return isURLMatchAccount(b, url) ? 1 : -1;
  });
};
