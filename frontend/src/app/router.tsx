import { createBrowserRouter, Link, Navigate } from "react-router";
import { FoundationStatus } from "./status";
import { AppShell } from "./shell";
import {
  LandingPage,
  AuthPage,
  DashboardPage,
  WelcomePage,
  DiscoveryPage,
  CatalogPage,
  RoadmapPage,
  ResultsPage,
  SettingsPage,
  DesignSystemPage,
} from "./screens";
import { routes } from "@/lib/routes";
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
  {
    path: "/preview",
    element: <AppShell preview />,
    children: [
      { index: true, element: <Navigate to={routes.dashboard} replace /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "welcome", element: <WelcomePage /> },
      { path: "discovery", element: <DiscoveryPage /> },
      { path: "results", element: <ResultsPage /> },
      { path: "careers", element: <CatalogPage /> },
      { path: "roadmaps/:careerId", element: <RoadmapPage /> },
      { path: "settings", element: <Navigate to={routes.profile} replace /> },
      { path: "settings/profile", element: <SettingsPage key="profile" /> },
      {
        path: "settings/account",
        element: <SettingsPage key="account" account />,
      },
      { path: "components", element: <DesignSystemPage /> },
    ],
  },
]);
