import { createHashRouter } from "react-router-dom";
import { Layout } from "./layout";
import { AccountsPage } from "./pages/accounts/accounts";
import { SettingsPage } from "./pages/settings/settings";

export const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <AccountsPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
]);
