import { useSettings } from "@/queries/settings";
import { AutoFill } from "./components/autoFill/autoFill";
import { Box } from "@mantine/core";
import { AddQRCode } from "./components/addQRCode/addQRCode";
import { AddAccountsModal } from "./components/addAccountsModal";
import { ScanQRCode } from "./components/scanQRCode/scanQRCode";
import { AddSelector } from "./components/addSelector/addSelector";
import { AddURL } from "./components/addURL/addURL";
import type { RuntimeMessage } from "@/types/runtime";
import { memo, useEffect } from "react";
import { useMessageAtom } from "./jotai/messageAtom";
import { CustomFill } from "./components/customFill/customFill";
import { useHotkeys } from "@mantine/hooks";
import { AskPasswordModal } from "./components/askPasswordModal";

export const Controller = memo(() => {
  const { data: settings } = useSettings();
  const { setMessage, message } = useMessageAtom();

  useEffect(() => {
    console.log("Controller mounted");
  }, []);

  const updateMessage = (event: RuntimeMessage) => {
    setMessage(event);
  };

  useEffect(() => {
    if (message) return;
    chrome.runtime.sendMessage("get-last-message", (event: RuntimeMessage) => {
      console.log("last message", event);
      if (!event) return setMessage({ type: "auto-fill" });
      updateMessage(event);
    });
  }, []);

  useEffect(() => {
    const listener = (event: RuntimeMessage) => {
      updateMessage(event);
    };

    chrome.runtime.onMessage.addListener(listener);

    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  }, []);

  useHotkeys(
    [
      [
        "ctrl+q",
        () => {
          updateMessage({ type: "fill-input" });
        },
        {
          preventDefault: false,
        },
      ],
    ],
    [],
    true
  );

  if (!settings || !message) return null;

  return (
    <Box>
      {message.type === "auto-fill" && <AutoFill />}
      {message.type === "add-accounts" && <AddAccountsModal />}
      {message.type === "ask-password" && <AskPasswordModal />}
      {message.type === "add-qrcode" && <AddQRCode />}
      {message.type === "scan-qrcode" && <ScanQRCode />}
      {message.type === "add-selector" && <AddSelector />}
      {message.type === "add-url" && <AddURL />}
      {message.type === "fill-input" && <CustomFill />}
    </Box>
  );
});
