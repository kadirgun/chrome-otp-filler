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
  return deepMerge(defaultSettings, data["settings"] || {});
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
      await chrome.storage.local.set({ settings: newSettings });

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

const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });
};

const useUpdateUser = () => {
  const client = useQueryClient();

  return useMutation({
    mutationKey: ["updateUser"],
    mutationFn: async (value: Partial<User>) => {
      const oldUser = await getUser();
      const newUser = deepMerge(oldUser, value);
      await chrome.storage.local.set({ user: newUser });

      return newUser;
    },
    onSuccess(data) {
      console.log(data);
      client.setQueryData<User>(["user"], data);
    },
  });
};

export const usePassword = () => {
  const { data: user } = useUser();
  const { mutate: updateUser } = useUpdateUser();

  const setPassword = (password: string) => {
    updateUser({ password });
  };

  return { password: user?.password, setPassword };
};
