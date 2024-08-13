import { AccountContext, type AccountUI } from "@/pages/options/contexts/account";
import type { OTPAccount } from "@/types";
import { AccountCard } from "./accountCard";
import { useImmer } from "use-immer";
import { useMemo } from "react";

export type AccountProviderProps = {
  account: OTPAccount;
};

export const AccountProvider = ({ account }: AccountProviderProps) => {
  const [ui, updateUI] = useImmer<AccountUI>({
    isQRCodeModalOpen: false,
  });

  const context = useMemo(() => ({ account, ui, updateUI }), [account, ui]);

  return (
    <AccountContext.Provider value={context}>
      <AccountCard />
    </AccountContext.Provider>
  );
};
