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
import { useActionAtom } from "./jotai/actionAtom";
import { CustomFill } from "./components/customFill/customFill";
import { useHotkeys } from "@mantine/hooks";

export const Controller = memo(() => {
  const { data: settings } = useSettings();
  const { action, setAction } = useActionAtom();

  useEffect(() => {
    if (action) return;
    chrome.runtime.sendMessage("get-last-message", (message: RuntimeMessage) => {
      console.log("last message", message);
      if (!message) return;
      setAction(message);
    });
  }, []);

  useEffect(() => {
    const listener = (message: RuntimeMessage) => {
      console.log("message", message);
      setAction(message);
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
          setAction({ type: "fill-input", data: undefined });
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
      <AddAccountsModal />
      {settings.autofill && <AutoFill />}
      {action?.type === "add-qrcode" && <AddQRCode />}
      {action?.type === "scan-qrcode" && <ScanQRCode />}
      {action?.type === "add-selector" && <AddSelector />}
      {action?.type === "add-url" && <AddURL />}
      {action?.type === "fill-input" && <CustomFill />}
    </Box>
  );
});
