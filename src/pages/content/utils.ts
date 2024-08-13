import type { OTPAccount } from "@/types";
import { isMatch } from "matcher";

export async function fillInput(element: HTMLInputElement, token: string) {
  element.click();
  element.focus();
  for (const char of token) {
    element.dispatchEvent(new KeyboardEvent("keydown", { key: char }));
  }
  element.value = token;
  element.dispatchEvent(new Event("input", { bubbles: true }));
  element.dispatchEvent(new Event("change", { bubbles: true }));
}

export const getMatchedAccountsByURL = (accounts: OTPAccount[], url: string) => {
  return accounts.filter((account) => {
    return isURLMatchAccount(account, url);
  });
};

type MatchedAccount = {
  element: HTMLInputElement;
  account: OTPAccount;
};

export const getMatchedElementByAccount = (account: OTPAccount) => {
  const element = account.settings.selectors.map((selector) => document.querySelector(selector.pattern)).find(Boolean);

  return element as HTMLInputElement | null;
};

export const getMatchedAccountsBySelector = (accounts: OTPAccount[]) => {
  const found = accounts
    .map((account) => {
      const element = getMatchedElementByAccount(account);

      if (!element) return;
      return {
        element: element as HTMLInputElement,
        account,
      };
    })
    .filter(Boolean);

  return found as MatchedAccount[];
};

export const isURLMatchAccount = (account: OTPAccount, url: string) => {
  return account.settings.urls.some((matcher) => isMatch(url, matcher.pattern));
};
