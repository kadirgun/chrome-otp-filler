import { RuntimeMessage } from "@/types/runtime";
import { handleQRCode } from "./qrCode";

const connectedTabs: Record<number, number> = {};
const lastMessages: Record<number, RuntimeMessage> = {};

const saveAndSendMessage = async (tabId: number, message: RuntimeMessage) => {
  if (!connectedTabs[tabId]) {
    lastMessages[tabId] = message;
    console.log("tab not connected", tabId, message);
    return;
  }

  chrome.tabs.sendMessage<RuntimeMessage>(tabId, message).catch((error) => {
    console.log("failed to send message", error);
    lastMessages[tabId] = message;
  });
};

export const registerContextMenu = () => {
  chrome.contextMenus.create({
    id: "otp-filler",
    title: "OTP Filler",
    contexts: ["all"],
  });

  chrome.contextMenus.create({
    id: "scan-qrcode",
    title: "Scan QR Code",
    contexts: ["all"],
    parentId: "otp-filler",
  });

  chrome.contextMenus.create({
    id: "add-qrcode",
    title: "Add to OTP Filler",
    contexts: ["image"],
    parentId: "otp-filler",
  });

  chrome.contextMenus.create({
    id: "add-selector",
    title: "Add Selector",
    contexts: ["editable"],
    parentId: "otp-filler",
  });

  chrome.contextMenus.create({
    id: "add-url",
    title: "Add URL",
    contexts: ["all"],
    parentId: "otp-filler",
  });

  chrome.contextMenus.create({
    id: "fill-input",
    title: "Fill Input",
    contexts: ["editable"],
    parentId: "otp-filler",
  });

  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (!tab || !tab.id) return;

    if (info.menuItemId === "add-qrcode") {
      saveAndSendMessage(tab.id, await handleQRCode(info));
    } else if (info.menuItemId.toString().startsWith("add-selector")) {
      saveAndSendMessage(tab.id, {
        type: "add-selector",
        data: undefined,
      });
    } else if (info.menuItemId.toString().startsWith("add-url")) {
      saveAndSendMessage(tab.id, {
        type: "add-url",
        data: undefined,
      });
    } else if (info.menuItemId === "scan-qrcode") {
      chrome.tabs.captureVisibleTab(tab.windowId, { format: "png" }, (dataUrl) => {
        if (!tab.id) return;
        saveAndSendMessage(tab.id, {
          type: "scan-qrcode",
          data: dataUrl,
        });
      });
    } else if (info.menuItemId.toString().startsWith("fill-input")) {
      saveAndSendMessage(tab.id, {
        type: "fill-input",
        data: undefined,
      });
    }
  });
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!sender.tab?.id) return;
  if (message === "get-last-message") {
    sendResponse(lastMessages[sender.tab.id]);
    delete lastMessages[sender.tab.id];
  } else if (message === "content-script-sync") {
    const tabId = sender.tab.id;
    connectedTabs[tabId] = Date.now();
  }
});

setInterval(() => {
  const now = Date.now();
  for (const tabId in connectedTabs) {
    if (now - connectedTabs[tabId] > 5000) {
      console.log("tab disconnected", tabId);
      delete connectedTabs[tabId];
    }
  }
}, 1000);
