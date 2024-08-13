import { type User, type UserSettings } from "@/types";
import { uuid } from "@/utils/uuid";
import { deepMerge } from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const defaultSettings: UserSettings = {
  algorithm: "SHA1",
  digits: 6,
  period: 30,
  autofill: true,
  autofillDelay: 0,
  selectors: [],
  protected: false,
  password: "",
  salt: uuid(),
};

const getSettings = async (): Promise<UserSettings> => {
  const data = await chrome.storage.local.get("settings");
  const settings = deepMerge(defaultSettings, data["settings"] || {});

  return settings;
};

const setSettings = async (settings: UserSettings) => {
  return chrome.storage.local.set({ settings });
};

export const useSettings = () => {
  return useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  });
};

export const useUpdateSettings = () => {
  const client = useQueryClient();
  return useMutation({
    mutationKey: ["updateSettings"],
    mutationFn: async (values: Partial<UserSettings>) => {
      const oldSettings = await getSettings();
      const newSettings = deepMerge(oldSettings, values);
      await setSettings(newSettings);

      return newSettings;
    },
    onSuccess(data) {
      client.setQueryData<UserSettings>(["settings"], data);
    },
  });
};

const getUser = async () => {
  const data = await chrome.storage.local.get("user");
  return (data["user"] || {}) as User;
};

const setUser = async (user: User) => {
  return chrome.storage.local.set({ user });
};

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });
};

export const useUpdateUser = () => {
  const client = useQueryClient();

  return useMutation({
    mutationKey: ["updateUser"],
    mutationFn: async (value: Partial<User>) => {
      const oldUser = await getUser();
      const newUser = deepMerge(oldUser, value);
      await setUser(newUser);

      return newUser;
    },
    onSuccess(data) {
      client.setQueryData<User>(["user"], data);
    },
  });
};
