export const routes = {
  home: "/",
  login: "/sign-in",
  register: "/create-account",
  recovery: "/password-recovery",
  resetPassword: "/reset-password",
  verify: "/check-email",
  status: "/status",
  licenses: "/licenses",
  credits: "/credits",
  terms: "/terms",
  mfaSetup: "/set-up-2fa",
  mfaChallenge: "/verify-2fa",
};

export const appRoutes = {
  dashboard: "/dashboard",
  welcome: "/welcome",
  discovery: "/discovery",
  results: "/recommendations",
  profileSetup: "/profile-setup",
  careers: "/careers",
  profile: "/settings/profile",
  account: "/settings/account",
  roadmaps: "/roadmaps",
  roadmap: (id: string) => `/roadmaps/${id}`,
  skillComparison: (careerId: string, roadmapId: string) =>
    `/roadmaps/${encodeURIComponent(careerId)}?${new URLSearchParams({
      roadmap: roadmapId, reviewSkills: "1",
    })}`,
  resumeReview: (careerId: string, roadmapId: string) =>
    `/settings/profile?${new URLSearchParams({
      reviewCareer: careerId, reviewRoadmap: roadmapId,
    })}#resume-skill-review`,
};
