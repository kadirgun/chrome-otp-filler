import type { RuntimeMessage } from "@/types/runtime";
import { registerContextMenu } from "./menu";
import { parseURL } from "./menu/qrCode";

registerContextMenu();

chrome.runtime.onMessage.addListener((message: RuntimeMessage<string>, _, respond) => {
  if (message.type == "get-data-url") {
    parseURL(message.data).then(respond);
  }

  return true;
});
