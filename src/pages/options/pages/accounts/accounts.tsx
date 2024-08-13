import { Center, Group, SimpleGrid, Stack } from "@mantine/core";
import { memo, useEffect, useMemo } from "react";
import { AccountProvider } from "./components/account/provider";
import { useImmer } from "use-immer";
import { AccountsContext, AccountsOptions } from "@/pages/options/contexts/accounts";
import { AccountsSearch } from "./components/search";
import { AddAccountButton } from "./components/addAccountButton";
import { AccountModal } from "./components/accountModal";
import { AccountsMenu } from "./components/accountsMenu";
import { DeleteAccountsModal } from "./components/deleteAccountsModal";
import { ExportAccountsModal } from "./components/exportAccountsModal";
import { useAccounts } from "@/queries/accounts";
import { usePassword, useSettings } from "@/queries/settings";
import { PasswordPrompt } from "@/components/passwordPrompt";

export const AccountsPage = memo(() => {
  const { data: accounts } = useAccounts();
  const [options, updateOptions] = useImmer<AccountsOptions>({
    search: "",
  });
  const { password } = usePassword();
  const { data: settings } = useSettings();

  const filtered = useMemo(() => {
    if (!accounts) {
      return [];
    }

    return accounts.filter((account) => {
      if (!options.search) {
        return true;
      }

      const matchLabel = account.label.toLowerCase().includes(options.search.toLowerCase());
      const matchIssuer = account.issuer.toLowerCase().includes(options.search.toLowerCase());

      return matchLabel || matchIssuer;
    });
  }, [accounts, options.search]);

  const context = useMemo(() => ({ options, updateOptions }), [options, accounts]);

  useEffect(() => {
    console.log(accounts);
  }, [accounts]);

  if (!settings) return null;
  if (!password && settings.protected) {
    return (
      <Center flex={1}>
        <PasswordPrompt width={300} />
      </Center>
    );
  }

  return (
    <AccountsContext.Provider value={context}>
      <Stack>
        <Group justify="space-between">
          <AccountsSearch />
          <Group>
            <AddAccountButton />
            <AccountsMenu />
          </Group>
        </Group>
        <SimpleGrid
          cols={{
            xl: 4,
            lg: 3,
            md: 2,
            sm: 1,
          }}
        >
          {filtered.map((account) => (
            <AccountProvider key={account.id} account={account} />
          ))}
        </SimpleGrid>
      </Stack>

      {options.showAccountModal && <AccountModal />}
      {options.showDeleteModal && <DeleteAccountsModal />}
      {options.showExportModal && <ExportAccountsModal />}
    </AccountsContext.Provider>
  );
});
