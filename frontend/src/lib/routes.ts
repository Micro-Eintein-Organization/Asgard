export const routes = {
  home: "/",
  login: "/sign-in",
  register: "/create-account",
  recovery: "/password-recovery",
  verify: "/check-email",
  status: "/status",
  dashboard: "/preview/dashboard",
  welcome: "/preview/welcome",
  discovery: "/preview/discovery",
  results: "/preview/results",
  careers: "/preview/careers",
  profile: "/preview/settings/profile",
  account: "/preview/settings/account",
  components: "/preview/components",
  roadmap: (id: string) => `/preview/roadmaps/${id}`,
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
