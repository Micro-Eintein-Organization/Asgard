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
