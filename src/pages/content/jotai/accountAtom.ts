import { OTPAccount } from "@/types";
import { atom, useAtom } from "jotai";

const accountsAtom = atom<OTPAccount>();

export const useAccountAtom = () => {
  const [account, setAccount] = useAtom(accountsAtom);

  return { account, setAccount };
};
