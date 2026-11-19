import { lazy } from "react";

export const CareerComparisonPage = lazy(async () => ({ default: (await import("@/features/careers/comparison-page")).CareerComparisonPage }));
export const CareerSourcesPage = lazy(async () => ({ default: (await import("@/features/careers/comparison-page")).CareerSourcesPage }));

export const LandingPage = lazy(async () => ({
  default: (await import("@/features/auth/pages")).LandingPage,
}));
export const AuthPage = lazy(async () => ({
  default: (await import("@/features/auth/pages")).AuthPage,
}));
export const DashboardPage = lazy(async () => ({
  default: (await import("@/screens/DashboardScreen")).DashboardScreen,
}));
export const WelcomePage = lazy(async () => ({
  default: (await import("@/components/discovery/DiscoveryContainer")).default,
}));
export const DiscoveryPage = lazy(async () => ({
  default: (await import("@/components/discovery/DiscoveryWizard"))
    .DiscoveryWizard,
}));
export const CatalogPage = lazy(async () => ({
  default: (await import("@/components/catalog/RoleCatalog")).default,
}));
export const RoadmapPage = lazy(async () => ({
  default: (await import("@/features/roadmaps/page")).RoadmapPage,
}));
export const ResultsPage = lazy(async () => ({
  default: (await import("@/components/discovery/DiscoveryWizard"))
    .DiscoveryResults,
}));
export const AccountSettingsPage = lazy(async () => ({
  default: (await import("@/screens/SettingsScreen")).SettingsScreen,
}));
export const AuthenticatedProfilePage = lazy(async () => ({
  default: (await import("@/screens/SettingsScreen")).SettingsScreen,
}));
export const SkillMatchingPage = lazy(async () => ({
  default: (await import("@/features/skill-matching/page")).default,
}));
export const ProfileSetupPage = lazy(async () => ({
  default: (await import("@/components/profile/OptionalProfileSetup")).default,
}));
