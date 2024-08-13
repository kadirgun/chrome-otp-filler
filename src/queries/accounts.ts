import type { OTPAccount } from "@/types";
import { decryptAccount, encryptAccount, mergeAccount } from "@/utils/account";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePassword, useSettings } from "./settings";
import { useMemo } from "react";
import { deepMerge } from "@mantine/core";

const getAccounts = async (): Promise<OTPAccount[]> => {
  const data = await chrome.storage.local.get("account-storage");
  const accounts = (data["account-storage"] || []) as OTPAccount[];

  return accounts.map((account) => mergeAccount(account));
};

const useProtectedAccounts = () => {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: getAccounts,
  });
};

export const useAccounts = () => {
  const { data: unprotected, ...rest } = useProtectedAccounts();
  const { data: settings } = useSettings();
  const { password } = usePassword();

  const accounts = useMemo(() => {
    if (!unprotected || !settings) return;
    if (!settings.protected) return unprotected;
    if (!password) return;

    try {
      return unprotected.map((account) => decryptAccount(account, password));
    } catch (error) {
      console.error(error);
      return unprotected;
    }
  }, [unprotected, settings, password]);

  return { data: accounts, ...rest };
};

export const useAddAccount = () => {
  const client = useQueryClient();
  const { data: settings } = useSettings();
  const { password } = usePassword();

  return useMutation({
    mutationKey: ["addAccount"],
    mutationFn: async (request: OTPAccount | OTPAccount[]) => {
      if (!settings || !password) return;
      if (!Array.isArray(request)) request = [request];

      const oldAccounts = await getAccounts();
      const newAccounts = [
        ...oldAccounts,
        ...request.map((account) => {
          if (!settings.protected) return account;
          return encryptAccount(account, password);
        }),
      ];

      await chrome.storage.local.set({ "account-storage": newAccounts });

      return newAccounts;
    },
    onSuccess() {
      client.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
};

export const useRemoveAccount = () => {
  const client = useQueryClient();
  return useMutation({
    mutationKey: ["removeAccount"],
    mutationFn: async (id: string | string[]) => {
      if (!Array.isArray(id)) id = [id];

      const oldAccounts = await getAccounts();
      const newAccounts = oldAccounts.filter((account) => !id.includes(account.id));
      await chrome.storage.local.set({ "account-storage": newAccounts });

      return newAccounts;
    },
    onSuccess() {
      client.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
};

export const useUpdateAccount = (protect: boolean = true) => {
  const client = useQueryClient();
  const { data: settings } = useSettings();
  const { password } = usePassword();

  return useMutation({
    mutationKey: ["updateAccount"],
    mutationFn: async (request: OTPAccount | OTPAccount[]) => {
      if (!settings || password === undefined) return;
      if (!Array.isArray(request)) request = [request];

      const oldAccounts = await getAccounts();
      const newAccounts = oldAccounts.map((oldAccount) => {
        const newAccount = request.find((account) => account.id === oldAccount.id);
        if (!newAccount) return oldAccount;
        if (!settings.protected || !protect) return deepMerge(oldAccount, newAccount);
        return deepMerge(oldAccount, encryptAccount(newAccount, password));
      });

      await chrome.storage.local.set({ "account-storage": newAccounts });

      return newAccounts;
    },
    onSuccess() {
      client.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
};
