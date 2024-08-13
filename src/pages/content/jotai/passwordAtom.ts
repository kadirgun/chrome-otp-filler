import { atom, useAtom } from "jotai";
import pDefer, { type DeferredPromise } from "p-defer";

type PasswordAtom = {
  show: boolean;
  promise: DeferredPromise<boolean>;
};

const passwordPromptAtom = atom<PasswordAtom>();

export const usePasswordPromptAtom = () => {
  const [passwordPrompt, setPasswordPrompt] = useAtom(passwordPromptAtom);

  const showPasswordPrompt = () => {
    const deferred = pDefer<boolean>();
    setPasswordPrompt({ show: true, promise: deferred });
    return deferred.promise;
  };

  return { passwordPrompt, showPasswordPrompt, setPasswordPrompt };
};
