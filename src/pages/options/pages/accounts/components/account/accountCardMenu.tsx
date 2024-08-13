import { useAccountContext } from "@/pages/options/contexts/account";
import { useAccountsContext } from "@/pages/options/contexts/accounts";
import { Menu, ActionIcon, rem } from "@mantine/core";
import { IconDots, IconQrcode, IconEdit, IconSettings, IconHistory } from "@tabler/icons-react";
import { memo } from "react";
import { AccountDeleteButton } from "./accountDeleteButton";

export const AccountCardMenu = memo(() => {
  const { updateUI, account } = useAccountContext();
  const { updateOptions } = useAccountsContext();

  const handleOpenQRCodeModal = () => {
    updateUI((draft) => {
      draft.isQRCodeModalOpen = true;
    });
  };

  const handleOpenEditModal = () => {
    updateOptions((draft) => {
      draft.showAccountModal = true;
      draft.account = account;
    });
  };

  const handleOpenHistoryModal = () => {
    updateUI((draft) => {
      draft.isHistoryModalOpen = true;
    });
  };

  const handleOpenSettingsModal = () => {
    updateUI((draft) => {
      draft.isSettingsModalOpen = true;
    });
  };

  return (
    <Menu position="bottom-end" shadow="sm">
      <Menu.Target>
        <ActionIcon variant="subtle" color="gray">
          <IconDots style={{ width: rem(16), height: rem(16) }} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item leftSection={<IconQrcode size={14} />} onClick={handleOpenQRCodeModal}>
          Generate QR Code
        </Menu.Item>
        <Menu.Item leftSection={<IconEdit size={14} />} onClick={handleOpenEditModal}>
          Edit
        </Menu.Item>
        <Menu.Item leftSection={<IconHistory size={14} />} onClick={handleOpenHistoryModal}>
          History
        </Menu.Item>
        <Menu.Item leftSection={<IconSettings size={14} />} onClick={handleOpenSettingsModal}>
          Settings
        </Menu.Item>
        <AccountDeleteButton />
      </Menu.Dropdown>
    </Menu>
  );
});
