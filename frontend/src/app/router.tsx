import { createBrowserRouter, Link } from "react-router";
import { FoundationStatus } from "./status";
import { AppShell } from "./shell";
import { LandingPage, AuthPage } from "./screens";

import DiscoveryContainer from "../components/discovery/DiscoveryContainer";
import RoleCatalog from "../components/catalog/RoleCatalog";
import OptionalProfileSetup from "../components/profile/OptionalProfileSetup";
import { DashboardScreen } from "../screens/DashboardScreen";
import { SettingsScreen } from "../screens/SettingsScreen";

import { appRoutes, routes } from "@/lib/routes";
import { StatePanel } from "@/components/shared";

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: routes.home, element: <LandingPage /> },
      { path: routes.login, element: <AuthPage mode="login" /> },
      { path: routes.register, element: <AuthPage mode="register" /> },
      { path: routes.recovery, element: <AuthPage mode="recovery" /> },
      { path: routes.verify, element: <AuthPage mode="verify" /> },
      { path: routes.status, element: <FoundationStatus /> },
      
      { path: "/discovery", element: <DiscoveryContainer /> },
      { path: appRoutes.discovery, element: <DiscoveryContainer /> },
      { path: "/catalog", element: <RoleCatalog /> },
      { path: appRoutes.careers, element: <RoleCatalog /> },
      { path: "/profile-setup", element: <OptionalProfileSetup /> },
      { path: appRoutes.profile, element: <SettingsScreen /> },
      { path: "/dashboard", element: <DashboardScreen /> },
      { path: appRoutes.dashboard, element: <DashboardScreen /> },
      { path: "/settings", element: <SettingsScreen /> },

      {
        path: "*",
        element: (
          <StatePanel
            kind="error"
            title="Page unavailable"
            action={<Link to={routes.home}>Return to Asgard</Link>}
          >
            This page could not be found.{" "}
            <Link to={routes.status}>Foundation status</Link>
          </StatePanel>
        ),
      },
    ],
  },
]);