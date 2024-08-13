import { useAccountsContext } from "@/pages/options/contexts/accounts";
import { Button } from "@mantine/core";
import { IconQrcode } from "@tabler/icons-react";
import { memo } from "react";

export const AddAccountButton = memo(() => {
  const { updateOptions } = useAccountsContext();

  const handleAddAccount = () => {
    updateOptions((draft) => {
      draft.showAccountModal = true;
    });
  };

  return (
    <Button onClick={handleAddAccount} leftSection={<IconQrcode size={16} />}>
      Create
    </Button>
  );
});
