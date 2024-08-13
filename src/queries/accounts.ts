import type { OTPAccount } from "@/types";
import { decryptAccount, encryptAccount, mergeAccount } from "@/utils/account";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSettings, useUser } from "./settings";
import { useMemo } from "react";
import { deepMerge } from "@mantine/core";

const getAccounts = async (): Promise<OTPAccount[]> => {
  const data = await chrome.storage.local.get("accounts");
  const accounts = (data["accounts"] || []) as OTPAccount[];

  return accounts.map((account) => mergeAccount(account));
};

const setAccounts = async (accounts: OTPAccount[]) => {
  return chrome.storage.local.set({ accounts });
};

const useProtectedAccounts = () => {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: getAccounts,
  });
};

export const useAccounts = () => {
  const { data: protectedAccounts, ...rest } = useProtectedAccounts();
  const { data: settings } = useSettings();
  const { data: user } = useUser();

  const accounts = useMemo(() => {
    if (!protectedAccounts || !settings) return;
    if (!settings.protected) return protectedAccounts;
    if (!user) return;

    try {
      return protectedAccounts.map((account) => decryptAccount(account, user.password));
    } catch (error) {
      console.error(error);
      return protectedAccounts;
    }
  }, [protectedAccounts, settings, user]);

  return { data: accounts, ...rest };
};

export const useAddAccount = () => {
  const client = useQueryClient();
  const { data: settings } = useSettings();
  const { data: user } = useUser();

  return useMutation({
    mutationKey: ["addAccount"],
    mutationFn: async (request: OTPAccount | OTPAccount[]) => {
      if (!settings || !user) return;
      if (!Array.isArray(request)) request = [request];

      const oldAccounts = await getAccounts();
      const newAccounts = [
        ...oldAccounts,
        ...request.map((account) => {
          if (!settings.protected) return account;
          return encryptAccount(account, user.password);
        }),
      ];

      await setAccounts(newAccounts);

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
      await setAccounts(newAccounts);

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
  const { data: user } = useUser();

  return useMutation({
    mutationKey: ["updateAccount"],
    mutationFn: async (request: OTPAccount | OTPAccount[]) => {
      if (!settings || !user) return;
      if (!Array.isArray(request)) request = [request];

      const oldAccounts = await getAccounts();
      const newAccounts = oldAccounts.map((oldAccount) => {
        const newAccount = request.find((account) => account.id === oldAccount.id);
        if (!newAccount) return oldAccount;
        if (!settings.protected || !protect) return deepMerge(oldAccount, newAccount);
        return deepMerge(oldAccount, encryptAccount(newAccount, user.password));
      });

      console.log("newAccounts", newAccounts);

      await setAccounts(newAccounts);

      return newAccounts;
    },
    onSuccess() {
      client.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
};
