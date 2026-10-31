export const routes = {
  home: "/",
  login: "/sign-in",
  register: "/create-account",
  recovery: "/password-recovery",
  verify: "/check-email",
  status: "/status",
};

export const appRoutes = {
  dashboard: "/dashboard",
  welcome: "/welcome",
  discovery: "/discovery",
  results: "/recommendations",
  careers: "/careers",
  profile: "/settings/profile",
  account: "/settings/account",
  roadmaps: "/roadmaps",
  roadmap: (id: string) => `/roadmaps/${id}`,
};

export const routesWithoutNavbar = new Set([
  routes.login,
  appRoutes.welcome,
  appRoutes.discovery,
  appRoutes.results,
]);

export const routesWithoutFooter = new Set([
  appRoutes.welcome,
  appRoutes.discovery,
  appRoutes.results,
]);

export function isCareerNavigationActive(pathname: string) {
  return (
    pathname === appRoutes.careers ||
    pathname === appRoutes.roadmaps ||
    pathname.startsWith(`${appRoutes.roadmaps}/`)
  );
}
