import { AccountSelectList } from "@/components/accountSelectList";
import { useAccounts } from "@/queries/accounts";
import type { OTPAccount } from "@/types";
import { imageDataFromURL, scanQRCode } from "@/utils/otp";
import { Button, Center, FileButton, Group, List, Loader, Paper, Stack, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useEventListener } from "@reactuses/core";
import {
  IconClick,
  IconClipboard,
  IconDeviceMobileShare,
  IconDragDrop,
  IconScan,
  IconUpload,
} from "@tabler/icons-react";
import { memo, useRef, useState } from "react";

export type QRCodeFormProps = {
  action: "create" | "update";
  onSubmit: (account: OTPAccount[]) => void;
};

export const QRCodeForm = memo(({ action, onSubmit }: QRCodeFormProps) => {
  const resetRef = useRef<() => void>(null);
  const { data: oldAccounts } = useAccounts();
  const [accounts, setAccounts] = useState<OTPAccount[]>([]);
  const [step, setStep] = useState<"upload" | "scanning" | "select-accounts">("upload");
  const [dragging, setDragging] = useState(false);

  const handleScan = async (files: File[]) => {
    if (!files) return;
    if (!Array.isArray(files)) files = [files];

    resetRef.current?.();

    const scannedAccounts: OTPAccount[] = [];
    setStep("scanning");
    for (const file of files) {
      try {
        const url = URL.createObjectURL(file);
        const image = await imageDataFromURL(url);
        const result = await scanQRCode(image);
        scannedAccounts.push(...result);
      } catch (error) {
        console.error(`Failed to scan ${file.name}:`, error);
      }
    }

    if (scannedAccounts.length === 0) {
      showNotification({
        title: "No accounts found",
        message: "No OTP accounts were found in the scanned QR Code",
        color: "red",
      });
      handleClear();
    } else {
      const newAccounts: OTPAccount[] = [];

      scannedAccounts.forEach((account) => {
        if (action === "create") {
          if (oldAccounts?.some((a) => a.secret === account.secret)) return;
        }
        if (newAccounts.some((a) => a.secret === account.secret)) return;
        newAccounts.push(account);
      });

      if (newAccounts.length === 0) {
        showNotification({
          title: "No new accounts found",
          message: "Accounts in the scanned QR Code already exist",
          color: "blue",
        });
        return handleClear();
      } else {
        setAccounts(newAccounts);
        setStep("select-accounts");
      }
    }
  };

  const handleSelectAccounts = (selected: OTPAccount[]) => {
    onSubmit(selected);
  };

  useEventListener("paste", (event) => {
    if (!event.clipboardData) return;
    const files: File[] = Array.from(event.clipboardData.files).filter((file) => file.type.startsWith("image/"));
    handleScan(files);
  });

  useEventListener("drop", (event) => {
    setDragging(false);
    if (!event.dataTransfer) return;
    event.preventDefault();
    const files: File[] = Array.from(event.dataTransfer.files).filter((file) => file.type.startsWith("image/"));
    handleScan(files);
  });

  useEventListener(
    "dragover",
    (event) => {
      event.stopPropagation();
      event.preventDefault();
      setDragging(true);
    },
    document
  );

  useEventListener(
    "dragleave",
    (event: DragEvent) => {
      if (event.x != 0) return;
      event.stopPropagation();
      setDragging(false);
    },
    document
  );

  const handleUpload = (files: File | File[] | null) => {
    if (!files) return;
    if (!Array.isArray(files)) files = [files];
    handleScan(files);
  };

  const handleClear = () => {
    setAccounts([]);
    setStep("upload");
  };

  return (
    <Stack>
      {step === "upload" && (
        <Stack>
          <Paper
            style={{
              userSelect: "none",
            }}
          >
            <Stack justify="space-between" align="center" py={100}>
              {dragging ? <IconDragDrop size={100} /> : <IconScan size={100} />}
              <Text fw={500}>Scan QR Code</Text>
              <List center spacing="sm" size="sm">
                <List.Item icon={<IconClick size={16} />}>Click to upload QR Code images</List.Item>
                <List.Item icon={<IconDragDrop size={16} />}>Drag and drop images here</List.Item>
                <List.Item icon={<IconClipboard size={16} />}>Paste images from clipboard</List.Item>
              </List>
            </Stack>
          </Paper>

          <Group gap="xs" justify="end">
            <Button leftSection={<IconDeviceMobileShare size={16} />} color="gray">
              Upload with Mobile
            </Button>
            <FileButton resetRef={resetRef} onChange={handleUpload} accept="image/*" multiple={action === "create"}>
              {(props) => (
                <Button {...props} leftSection={<IconUpload size={16} />}>
                  Upload
                </Button>
              )}
            </FileButton>
          </Group>
        </Stack>
      )}

      {step === "select-accounts" && (
        <AccountSelectList
          multiple={action === "create"}
          onConfirm={handleSelectAccounts}
          accounts={accounts}
          message={
            action === "create" ? "Select OTP accounts to import" : "Select OTP account to update current account"
          }
        />
      )}

      {step === "scanning" && (
        <Center p={100}>
          <Loader size="xl" />
        </Center>
      )}

      {step !== "upload" && (
        <Button onClick={handleClear} variant="light" color="gray">
          Cancel
        </Button>
      )}
    </Stack>
  );
});
