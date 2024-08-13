import { memo } from "react";
import { Protect } from "./security/protect";
import { Unprotect } from "./security/unProtect";
import { useSettings } from "@/queries/settings";

export const SecuritySettings = memo(() => {
  const { data: settings } = useSettings();

  if (!settings) return null;
  return settings.protected ? <Unprotect /> : <Protect />;
});
