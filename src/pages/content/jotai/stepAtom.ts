import { atom, useAtom } from "jotai";

export type Step = "idle" | "select-attributes" | "select-account" | "set-url" | "update-account" | "fill" | "finish";

const stepAtom = atom<Step>("idle");

export const useStepAtom = () => {
  const [step, setStep] = useAtom(stepAtom);

  return { step, setStep };
};
