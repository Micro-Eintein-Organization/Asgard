import { describe, expect, it } from "vitest";
import {
  appRoutes,
  isCareerNavigationActive,
  routes,
  routesWithoutFooter,
  routesWithoutNavbar,
} from "@/lib/routes";

describe("navbar route configuration", () => {
  it("hides the navbar on sign-in, Welcome, Discovery, and recommendations only", () => {
    expect([...routesWithoutNavbar]).toEqual([
      routes.login,
      appRoutes.welcome,
      appRoutes.discovery,
      appRoutes.results,
    ]);
    for (const route of [
      appRoutes.dashboard,
      appRoutes.careers,
      appRoutes.roadmaps,
      appRoutes.roadmap("frontend"),
      appRoutes.profile,
      appRoutes.account,
    ]) {
      expect(routesWithoutNavbar.has(route)).toBe(false);
    }
  });

  it("marks Career active on Careers and roadmap pages only", () => {
    expect(isCareerNavigationActive(appRoutes.careers)).toBe(true);
    expect(isCareerNavigationActive(appRoutes.roadmaps)).toBe(true);
    expect(isCareerNavigationActive(appRoutes.roadmap("frontend"))).toBe(true);
    expect(isCareerNavigationActive(appRoutes.dashboard)).toBe(false);
  });

  it("hides the footer only on Discovery entry, questions, and results", () => {
    expect([...routesWithoutFooter]).toEqual([
      appRoutes.welcome,
      appRoutes.discovery,
      appRoutes.results,
    ]);
    for (const route of [
      routes.home,
      routes.login,
      appRoutes.dashboard,
      appRoutes.careers,
      appRoutes.roadmaps,
      appRoutes.profile,
    ]) {
      expect(routesWithoutFooter.has(route)).toBe(false);
    }
  });
});
