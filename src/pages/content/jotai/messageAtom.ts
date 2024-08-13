import type { RuntimeMessage } from "@/types/runtime";
import { atom, useAtom } from "jotai";

const messageAtom = atom<RuntimeMessage>();

export const useMessageAtom = <T = RuntimeMessage>() => {
  const [message, setMessage] = useAtom(messageAtom);

  return { message: message as T | undefined, setMessage };
};
