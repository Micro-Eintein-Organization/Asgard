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
  AccountSettingsPage,
  AuthenticatedProfilePage,
} from "./screens";
import { appRoutes, routes } from "@/lib/routes";
import { StatePanel } from "@/components/shared";
import { ProtectedRoute } from "@/auth/protected-route";

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
          { path: appRoutes.dashboard, element: <DashboardPage /> },
          { path: appRoutes.welcome, element: <WelcomePage /> },
          { path: appRoutes.discovery, element: <DiscoveryPage /> },
          { path: appRoutes.results, element: <ResultsPage /> },
          { path: appRoutes.careers, element: <CatalogPage /> },
          { path: appRoutes.roadmap(":careerId"), element: <RoadmapPage /> },
          {
            path: appRoutes.roadmaps,
            element: <Navigate to={appRoutes.roadmap("frontend")} replace />,
          },
          { path: appRoutes.profile, element: <AuthenticatedProfilePage /> },
          { path: appRoutes.account, element: <AccountSettingsPage /> },
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
]);
