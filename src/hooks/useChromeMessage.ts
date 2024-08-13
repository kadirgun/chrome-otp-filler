import type { RuntimeMessage } from "@/types/runtime";
import { useEffect } from "react";

export type UseChromeMessageCallback<T = unknown> = (message: T) => void;
export const useChromeMessage = <T = unknown>(type: RuntimeMessage["type"], callback: UseChromeMessageCallback<T>) => {
  useEffect(() => {
    const listener = (message: { type: string; data: T }) => {
      if (type && message.type === type) {
        callback(message.data);
      }
    };

    chrome.runtime.onMessage.addListener(listener);

    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  }, [type, callback]);
};
