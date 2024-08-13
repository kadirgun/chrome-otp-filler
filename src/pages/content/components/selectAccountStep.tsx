import { AccordionSelect } from "@/components/accordionSelect";
import { useAccountAtom } from "@/pages/content/jotai/accountAtom";
import { isURLMatchAccount } from "@/pages/content/utils";
import { AccountInfoTable } from "@/pages/options/components/accountInfoTable";
import { useAccounts } from "@/queries/accounts";
import type { OTPAccount } from "@/types";
import { memo, useMemo } from "react";
import { useStepAtom, type Step } from "../jotai/stepAtom";
import { useAccountsAtom } from "../jotai/accountsAtom";

export type AccountSelectStepProps = {
  next: Step;
  message: string;
};

export const AccountSelectStep = memo(({ next, message }: AccountSelectStepProps) => {
  const { data: accounts } = useAccounts();
  const { accounts: customAccounts } = useAccountsAtom();
  const { setAccount } = useAccountAtom();
  const { setStep } = useStepAtom();

  const onConfirm = (accounts: OTPAccount[]) => {
    const account = accounts.at(0);
    if (!account) return;

    setAccount(account);
    setStep(next);
  };

  const selected = useMemo(() => {
    if (!accounts) return 0;

    const index = accounts.findIndex((account) => isURLMatchAccount(account, window.location.href));
    return index === -1 ? 0 : index;
  }, [accounts]);

  if (!accounts) return null;

  return (
    <AccordionSelect<OTPAccount>
      data={accounts || customAccounts}
      multiple={false}
      onConfirm={onConfirm}
      message={message}
      title={(account) => account.issuer}
      info={(account) => <AccountInfoTable account={account} />}
      initialSelect={[selected]}
    />
  );
});
