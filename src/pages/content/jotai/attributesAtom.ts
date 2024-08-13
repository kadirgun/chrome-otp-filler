import { atom, useAtom } from "jotai";

export type SelectorAttribute = {
  name: string;
  value: string;
  tag: string;
};

const attributesAtom = atom<SelectorAttribute[]>([]);

export const useAttributesAtom = () => {
  const [attributes, setAttributes] = useAtom(attributesAtom);

  return { attributes, setAttributes };
};
