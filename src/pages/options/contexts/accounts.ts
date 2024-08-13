import type { OTPAccount } from "@/types";
import { createContext, useContext } from "react";
import type { Updater } from "use-immer";

export type AccountsOptions = {
  account?: OTPAccount;
  search: string;
  showAccountModal?: boolean;
  showDeleteModal?: boolean;
  showExportModal?: boolean;
};

export type AccountsContextType = {
  options: AccountsOptions;
  updateOptions: Updater<AccountsOptions>;
};

export const AccountsContext = createContext<AccountsContextType>({} as AccountsContextType);

export function useAccountsContext() {
  const context = useContext(AccountsContext);

  if (!context) {
    throw new Error("useAccountsContext must be used within a AccountsContext");
  }

  return context;
}
