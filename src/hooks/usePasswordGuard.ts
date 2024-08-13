import { useSettings, useUser } from "@/queries/settings";
import { useMemo } from "react";

export const usePasswordGuard = () => {
  const { data: user } = useUser();
  const { data: settings } = useSettings();

  const guard = useMemo(() => {
    if (!user || !settings) return null;

    return settings.protected && !user.password;
  }, [user, settings]);

  return guard;
};
