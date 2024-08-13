import { useAccountsContext } from "@/pages/options/contexts/accounts";
import { TextInput } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { useDebounce } from "@reactuses/core";
import { IconSearch } from "@tabler/icons-react";
import { memo, useEffect } from "react";

export const AccountsSearch = memo(() => {
  const [search, setSearch] = useInputState("");
  const debounced = useDebounce(search, 250);
  const { updateOptions } = useAccountsContext();

  useEffect(() => {
    updateOptions((draft) => {
      draft.search = debounced;
    });
  }, [debounced]);

  return (
    <TextInput
      value={search}
      onChange={setSearch}
      placeholder="Search accounts"
      leftSection={<IconSearch size={16} />}
    />
  );
});
