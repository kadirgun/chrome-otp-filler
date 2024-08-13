import type { OTPAccount } from "@/types";
import { createContext, useContext } from "react";
import type { Updater } from "use-immer";

export type AccountUI = {
  isQRCodeModalOpen?: boolean;
  isHistoryModalOpen?: boolean;
  isSettingsModalOpen?: boolean;
};

export type AccountContextType = {
  account: OTPAccount;
  ui: AccountUI;
  updateUI: Updater<AccountUI>;
};

export const AccountContext = createContext<AccountContextType>({} as AccountContextType);

export function useAccountContext() {
  const context = useContext(AccountContext);

  if (!context) {
    throw new Error("useAccountContext must be used within a AccountContext");
  }

  return context;
}
