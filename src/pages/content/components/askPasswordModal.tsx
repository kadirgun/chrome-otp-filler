import { memo } from "react";
import { PasswordPrompt } from "@/components/passwordPrompt";
import { useMessageAtom } from "../jotai/messageAtom";
import { Modal } from "@mantine/core";

export const AskPasswordModal = memo(() => {
  const { message: action, setMessage: setAction } = useMessageAtom();

  const onPass = () => {
    setAction(action?.data);
  };

  const onClose = () => {
    setAction(undefined);
  };

  return (
    <Modal centered title="Password Required" opened={true} onClose={onClose}>
      <PasswordPrompt onPass={onPass} />
    </Modal>
  );
});
