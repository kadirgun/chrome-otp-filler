export const getActiveTabUrl = async (): Promise<string> => {
  if (!chrome.tabs) return location.href;
  return chrome.tabs.query({ active: true, lastFocusedWindow: true }).then((tabs) => tabs[0]?.url || "");
};
