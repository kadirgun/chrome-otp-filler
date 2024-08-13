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
import { usePasswordRequired } from "@/hooks/usePasswordRequired";
import { AskPasswordModal } from "./components/askPasswordModal";

export const Controller = memo(() => {
  const { data: settings } = useSettings();
  const { message: action, setMessage: setAction } = useMessageAtom();
  const password = usePasswordRequired();

  const updateAction = (message: RuntimeMessage) => {
    console.log(message, password);
    if (password?.ask) {
      setAction({ type: "ask-password", data: message });
    } else {
      setAction(message);
    }
  };

  useEffect(() => {
    if (action) return;
    chrome.runtime.sendMessage("get-last-message", (message: RuntimeMessage) => {
      console.log("last message", message);
      if (!message) return;
      updateAction(message);
    });
  }, []);

  useEffect(() => {
    const listener = (message: RuntimeMessage) => {
      console.log("message", message);
      updateAction(message);
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
          updateAction({ type: "fill-input" });
        },
        {
          preventDefault: false,
        },
      ],
    ],
    [],
    true
  );

  if (!settings) return null;

  return (
    <Box>
      {settings.autofill && <AutoFill />}
      {action?.type === "add-accounts" && <AddAccountsModal />}
      {action?.type === "ask-password" && <AskPasswordModal />}
      {action?.type === "add-qrcode" && <AddQRCode />}
      {action?.type === "scan-qrcode" && <ScanQRCode />}
      {action?.type === "add-selector" && <AddSelector />}
      {action?.type === "add-url" && <AddURL />}
      {action?.type === "fill-input" && <CustomFill />}
    </Box>
  );
});
