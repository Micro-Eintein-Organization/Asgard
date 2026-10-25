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
  AuthenticatedProfilePage,
} from "./screens";
import { appRoutes, routes } from "@/lib/routes";
import { StatePanel } from "@/components/shared";
import { ProtectedRoute } from "@/auth/protected-route";

function featureRoutes(
  paths: Pick<
    typeof appRoutes,
    "dashboard" | "welcome" | "discovery" | "results" | "careers" | "roadmap"
  >,
) {
  return [
    { path: paths.dashboard, element: <DashboardPage /> },
    { path: paths.welcome, element: <WelcomePage /> },
    { path: paths.discovery, element: <DiscoveryPage /> },
    { path: paths.results, element: <ResultsPage /> },
    { path: paths.careers, element: <CatalogPage /> },
    { path: paths.roadmap(":careerId"), element: <RoadmapPage /> },
  ];
}

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
        element: <ProtectedRoute />,
        children: [
          ...featureRoutes(appRoutes),
          {
            path: appRoutes.roadmaps,
            element: <Navigate to={appRoutes.roadmap("frontend")} replace />,
          },
          { path: appRoutes.profile, element: <AuthenticatedProfilePage /> },
          { path: appRoutes.account, element: <SettingsPage account /> },
        ],
      },
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
      ...featureRoutes(routes),
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
