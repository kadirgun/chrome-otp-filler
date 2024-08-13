import { atom, useAtom } from "jotai";

const overlayAtom = atom<boolean>(false);

export const useOverlayAtom = () => {
  const [overlay, setOverlay] = useAtom(overlayAtom);

  return { overlay, setOverlay };
};
