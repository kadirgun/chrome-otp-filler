import type { OTPAccount } from "@/types";
import { memo } from "react";
import { AccordionSelect } from "@/components/accordionSelect";
import { AccountInfoTable } from "@/pages/options/components/accountInfoTable";

export type AccountSelectListProps = {
  accounts: OTPAccount[];
  multiple?: boolean;
  onConfirm: (accounts: OTPAccount[]) => void;
  message?: string;
};

export const AccountSelectList = memo(({ accounts, multiple, onConfirm, message }: AccountSelectListProps) => {
  return (
    <AccordionSelect<OTPAccount>
      data={accounts}
      multiple={multiple}
      onConfirm={onConfirm}
      message={message}
      title={(account) => account.label}
      info={(account) => <AccountInfoTable account={account} />}
    />
  );
});
