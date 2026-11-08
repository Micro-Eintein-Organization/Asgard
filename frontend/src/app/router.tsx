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
  AuthenticatedProfilePage,
  ProfileSetupPage,
  CareerComparisonPage,
  CareerSourcesPage,
} from "./screens";
import { appRoutes, routes } from "@/lib/routes";
import { StatePanel } from "@/components/shared";
import { ProtectedRoute } from "@/auth/protected-route";
import { CareerDestination } from "./career-navigation";
import { EscoReferencePage } from "@/features/catalog/esco";

import { CounselorPage } from "@/features/ai-guidance";

export const router = createBrowserRouter([
  {
    errorElement: (
      <main className="page-container">
        <StatePanel
          kind="error"
          title="This page could not be loaded"
          action={<Link to={routes.home}>Return to Asgard</Link>}
        >
          An unexpected error prevented this screen from opening.
        </StatePanel>
      </main>
    ),
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
          { path: "/counselor", element: <CounselorPage /> },
          { path: appRoutes.careers, element: <CatalogPage /> },
          { path: "/catalog/esco", element: <EscoReferencePage /> },
          { path: "/careers/compare", element: <CareerComparisonPage /> },
          { path: "/careers/:careerId/sources", element: <CareerSourcesPage /> },
          { path: appRoutes.roadmap(":careerId"), element: <RoadmapPage /> },
          {
            path: appRoutes.roadmaps,
            element: <CareerDestination />,
          },
          { path: appRoutes.profile, element: <AuthenticatedProfilePage /> },
          {
            path: appRoutes.account,
            element: (
              <Navigate to={appRoutes.profile + "#account-security"} replace />
            ),
          },
          {
            path: "/catalog",
            element: <Navigate to={appRoutes.careers} replace />,
          },
          {
            path: "/settings",
            element: <Navigate to={appRoutes.profile} replace />,
          },
          {
            path: appRoutes.profileSetup,
            element: <ProfileSetupPage />,
          },
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
