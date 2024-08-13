import { memo } from "react";
import { PasswordPrompt } from "@/components/passwordPrompt";
import { useMessageAtom } from "../jotai/messageAtom";
import { Modal, Notification } from "@mantine/core";
import { AskPasswordMessage } from "@/types/runtime";

export const AskPasswordModal = memo(() => {
  const { message, setMessage } = useMessageAtom<AskPasswordMessage>();

  const onPass = () => {
    if (!message) return;
    setMessage(message.data.next);
  };

  const onClose = () => {
    setMessage(undefined);
  };

  if (!message) return null;

  return (
    <Modal centered title="Password Required" opened={true} onClose={onClose}>
      {message.data.prompt && <Notification withCloseButton={false}>{message.data.prompt}</Notification>}
      <PasswordPrompt onPass={onPass} />
    </Modal>
  );
});
