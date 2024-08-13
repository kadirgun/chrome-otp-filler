import { useAccounts } from "@/queries/accounts";
import { Stack } from "@mantine/core";
import { memo, useEffect, useState } from "react";
import { AccountItem } from "../components/AccountItem";
import { sortAccountByURLMatch } from "@/utils/account";
import { OTPAccount } from "@/types";
import { getActiveTabUrl } from "@/utils/chrome";

export const AccountsPage = memo(() => {
  const { data: accounts } = useAccounts();
  const [sortedAccounts, setSortedAccounts] = useState<OTPAccount[]>([]);

  useEffect(() => {
    if (!accounts) return;
    getActiveTabUrl().then((url) => {
      if (!url) {
        setSortedAccounts(accounts);
      } else {
        setSortedAccounts(sortAccountByURLMatch(accounts, url));
      }
    });
  }, [accounts]);

  if (!accounts) return null;

  return (
    <Stack py={10} px={10}>
      {sortedAccounts.map((account) => (
        <AccountItem key={account.id} account={account} />
      ))}
    </Stack>
  );
});
