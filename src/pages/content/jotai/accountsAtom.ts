import { OTPAccount } from "@/types";
import { atom, useAtom } from "jotai";

const accountsAtom = atom<OTPAccount[]>();

export const useAccountsAtom = () => {
  const [accounts, setAccounts] = useAtom(accountsAtom);

  return { accounts, setAccounts };
};
