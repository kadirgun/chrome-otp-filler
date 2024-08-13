import type { RuntimeMessage } from "@/types/runtime";
import { atom, useAtom } from "jotai";

const actionAtom = atom<RuntimeMessage>();

export const useActionAtom = <T = RuntimeMessage>() => {
  const [action, setAction] = useAtom(actionAtom);

  return { action: action as T, setAction };
};
