import { usePreferredDark } from "@reactuses/core";

export const useLogo = () => {
  const isDark = usePreferredDark(false);

  return isDark ? "/logo.png" : "/logo-dark.png";
};
