import { readFileSync } from "node:fs";
import { render, screen, within } from "@testing-library/react";
import { expect, it } from "vitest";
import { PhilippineSalaryComparison } from "./ph-salary";
import { salaryForCareer, salarySources } from "./ph-salary-data";

const frontend = { id: "79cfc498-d637-5dee-a28a-6544a3f9c5a0", title: "Frontend Developer" };
const analyst = { id: "0f8f854e-4b87-5c2c-9d99-5a557fe304de", title: "Data Analyst" };

it("keeps each starting range and its basis attached to the career after reversal", () => {
  const view = render(<PhilippineSalaryComparison careers={[frontend, analyst]} />);
  const frontendCard = screen.getByRole("heading", { name: frontend.title }).parentElement!;
  expect(within(frontendCard).getByText("₱30,000–₱40,000")).toBeVisible();
  expect(within(frontendCard).getByRole("link")).toHaveAttribute("href", salarySources.web.url);
  view.rerender(<PhilippineSalaryComparison careers={[analyst, frontend]} />);
  expect(screen.getAllByRole("heading").map((heading) => heading.textContent)).toEqual([analyst.title, frontend.title]);
  const analystCard = screen.getByRole("heading", { name: analyst.title }).parentElement!;
  expect(within(analystCard).getByText("₱35,000–₱45,000")).toBeVisible();
  expect(within(analystCard).getByRole("link")).toHaveAttribute("href", salarySources.analyst.url);
  expect(screen.getByText(/not a measured national average/)).toBeVisible();
});

it("covers every current canonical career with a bounded starting estimate and source", () => {
  const csv = readFileSync("../backend/app/content/occupational/v1/careers.csv", "utf8");
  const expansion = readFileSync("../supabase/content/20261104_guide_expansion_11_careers.sql", "utf8");
  const ids = new Set([
    ...csv.trim().split(/\r?\n/).slice(1).map((row) => row.split(",")[0]),
    ...[...expansion.matchAll(/INSERT INTO asgard_catalog\.careers .*?VALUES \('([a-f0-9-]{36})'/g)].map((match) => match[1]),
  ]);
  expect(ids.size).toBeGreaterThanOrEqual(23);
  for (const id of ids) {
    const salary = salaryForCareer(id);
    expect(salary, id).toBeDefined();
    expect(salary!.lowPhp).toBeGreaterThan(0);
    expect(salary!.highPhp).toBeGreaterThan(salary!.lowPhp);
    expect(salarySources[salary!.source].url).toMatch(/^https:\/\//);
  }
});

it("does not invent a starting estimate for an unknown future career", () => {
  render(<PhilippineSalaryComparison careers={[{ id: "unknown-future-career", title: "Future career" }, analyst]} />);
  const unavailable = screen.getByRole("heading", { name: "Future career" }).parentElement!;
  expect(within(unavailable).getByText("Salary reference unavailable")).toBeVisible();
  expect(unavailable.textContent).not.toContain("₱");
  expect(within(unavailable).queryByRole("link")).not.toBeInTheDocument();
  expect(salaryForCareer("toString")).toBeUndefined();
});

it("discloses broad family estimates and DevOps experience rather than imply exact graduate averages", () => {
  render(<PhilippineSalaryComparison careers={[
    { id: "f1756a96-98af-5abe-8439-423486b168d1", title: "Penetration Tester" },
    { id: "24068b09-7695-5744-88ca-9e678a40e06b", title: "DevOps Engineer" },
  ]} />);
  expect(screen.getByText(/not a dedicated penetration-testing average/)).toBeVisible();
  expect(screen.getByText("Junior DevOps Engineer (1–3 years)")).toBeVisible();
  expect(screen.getByText(/prior development or operations experience/)).toBeVisible();
});
