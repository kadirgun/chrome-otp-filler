import { useSettings, useUser } from "@/queries/settings";
import { useMemo } from "react";

export const usePasswordRequired = () => {
  const { data: user } = useUser();
  const { data: settings } = useSettings();

  const required = useMemo(() => {
    if (!user || !settings) return;

    return settings.protected && !user.password;
  }, [user, settings]);

  if (!user || !settings) return;

  return {
    ask: required,
  };
};
