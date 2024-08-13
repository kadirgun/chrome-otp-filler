import { useAccountContext } from "@/pages/options/contexts/account";
import { useRemoveAccount } from "@/queries/accounts";
import { Menu, Text } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconTrash } from "@tabler/icons-react";
import { memo } from "react";

export const AccountDeleteButton = memo(() => {
  const { account } = useAccountContext();
  const { mutate: removeAccount } = useRemoveAccount();

  const handleDelete = () => {
    removeAccount(account.id);

    showNotification({
      title: "Account deleted",
      message: "Account was successfully deleted",
      color: "orange",
    });
  };

  const handleClick = () => {
    openConfirmModal({
      title: "Delete account",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this OTP account? This action is irreversible and account data will be lost.
        </Text>
      ),
      labels: { confirm: "Delete account", cancel: "No don't delete it" },
      confirmProps: { color: "red" },
      onConfirm: () => handleDelete(),
    });
  };

  return (
    <Menu.Item leftSection={<IconTrash size={14} />} color="red" onClick={handleClick}>
      Delete
    </Menu.Item>
  );
});
