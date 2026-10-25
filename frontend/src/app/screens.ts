import { lazy } from "react";

export const LandingPage = lazy(async () => ({
  default: (await import("@/features/auth/pages")).LandingPage,
}));
export const AuthPage = lazy(async () => ({
  default: (await import("@/features/auth/pages")).AuthPage,
}));
export const DashboardPage = lazy(async () => ({
  default: (await import("@/features/dashboard/page")).DashboardPage,
}));
export const WelcomePage = lazy(async () => ({
  default: (await import("@/features/discovery/page")).WelcomePage,
}));
export const DiscoveryPage = lazy(async () => ({
  default: (await import("@/features/discovery/page")).DiscoveryPage,
}));
export const CatalogPage = lazy(async () => ({
  default: (await import("@/features/catalog/page")).CatalogPage,
}));
export const RoadmapPage = lazy(async () => ({
  default: (await import("@/features/roadmaps/page")).RoadmapPage,
}));
export const ResultsPage = lazy(async () => ({
  default: (await import("@/features/recommendations/page")).ResultsPage,
}));
export const SettingsPage = lazy(async () => ({
  default: (await import("@/features/profile/page")).SettingsPage,
}));
export const AuthenticatedProfilePage = lazy(async () => ({
  default: (await import("@/features/profile/authenticated-page"))
    .AuthenticatedProfilePage,
}));
export const DesignSystemPage = lazy(async () => ({
  default: (await import("@/features/design-system/page")).DesignSystemPage,
}));
