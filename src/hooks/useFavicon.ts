import { usePreferredDark } from "@reactuses/core";

export const useFavicon = () => {
  const isDark = usePreferredDark(false);

  return isDark ? "/icon-34.png" : "/icon-dark-34.png";
};
