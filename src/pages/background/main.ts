import type { RuntimeMessage } from "@/types/runtime";
import { registerContextMenu } from "./menu";
import { parseURL } from "./menu/qrCode";

chrome.runtime.onMessage.addListener((message: RuntimeMessage<string>, _, respond) => {
  if (message.type == "get-data-url") {
    parseURL(message.data).then(respond);
  }

  return true;
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll();
  registerContextMenu();
  console.log("Extension installed");
});
