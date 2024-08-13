import type { OTPAccount } from "@/types";
import { generate } from "@/utils/otp";
import { useEffect, useState } from "react";

export const useGenerateOTP = (account?: OTPAccount) => {
  const [token, setToken] = useState<string>();
  const [progress, setProgress] = useState<number>(100);
  const [error, setError] = useState<string>();

  const generateOTP = () => {
    if (!account) return;
    try {
      const token = generate(account);
      setToken(token);
    } catch (error: any) {
      console.error(error);
      setError(error.message);
    }
  };

  useEffect(() => {
    if (!account) return;

    generateOTP();

    const interval = setInterval(() => {
      const seconds = new Date().getSeconds();
      const remaining = seconds % account.period;
      setProgress((remaining / account.period) * 100);
      if (remaining === 0) {
        generateOTP();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [account]);

  return { token, progress, error };
};
