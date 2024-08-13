import { useAccountsContext } from "@/pages/options/contexts/accounts";
import { Menu, ActionIcon } from "@mantine/core";
import { IconSettings, IconTrash, IconDots, IconPackageExport } from "@tabler/icons-react";
import { memo } from "react";
import { NavLink } from "react-router-dom";

export const AccountsMenu = memo(() => {
  const { updateOptions } = useAccountsContext();

  const handleDeleteModalOpen = () => {
    updateOptions((state) => {
      state.showDeleteModal = true;
    });
  };

  const handleExportModalOpen = () => {
    updateOptions((state) => {
      state.showExportModal = true;
    });
  };

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <ActionIcon variant="light" color="gray" size={36}>
          <IconDots size={16} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Application</Menu.Label>
        <Menu.Item component={NavLink} to="/settings" leftSection={<IconSettings size={16} />}>
          Settings
        </Menu.Item>

        <Menu.Divider />

        <Menu.Label>Danger zone</Menu.Label>
        <Menu.Item leftSection={<IconPackageExport size={16} />} onClick={handleExportModalOpen}>
          Export Accounts
        </Menu.Item>
        <Menu.Item color="red" leftSection={<IconTrash size={16} />} onClick={handleDeleteModalOpen}>
          Delete Accounts
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
});
