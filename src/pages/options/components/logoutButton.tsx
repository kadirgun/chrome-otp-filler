import { useSettings, useUpdateUser, useUser } from "@/queries/settings";
import { ActionIcon } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { memo } from "react";

export const LogoutButton = memo(() => {
  const { data: user } = useUser();
  const { data: settings } = useSettings();
  const { mutateAsync: updateUser, isPending } = useUpdateUser();

  const handleLogout = () => {
    updateUser({
      password: "",
    });
  };

  if (!user || !settings) return null;
  if (!settings.protected || !user.password) return null;

  return (
    <ActionIcon size={36} color="red" onClick={handleLogout} loading={isPending}>
      <IconLogout size={20} />
    </ActionIcon>
  );
});
