import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, expect, it, vi } from "vitest";
import { useCoreQuery } from "@/features/core/data";
import { OccupationalProfile } from "./occupational-profile";

vi.mock("@/features/core/data", () => ({
  useCoreQuery: vi.fn(),
  coreApi: { careerEvidence: vi.fn() },
}));
beforeEach(() => {
  vi.clearAllMocks();
});

it("shows native zero separately, partial topic links, and release-pinned pagination", () => {
  vi.mocked(useCoreQuery).mockReturnValue({
    data: {
      career_id: "career",
      release_id: "release",
      total: 40,
      review_status: "Local test only",
      roles: [
        {
          occupation_id: "role",
          title: "Source role",
          career_level: "unknown",
          source_title: "Source title",
          source_version: "31",
          native_code: "code",
          relationship: "broader",
          source_level_verified: false,
        },
      ],
      limitations: ["Partial scope"],
      items: [
        {
          record_id: "record",
          occupation_id: "role",
          label: "Programming",
          definition: "A source descriptor",
          native_level: "0",
          scale_meaning: "Level (native range 0–7)",
          classification: "core_function",
          decision: "agent_supported",
          rationale: "Partial relationship only",
          locator: "CSV row 1",
          topics: [
            {
              topic_id: "topic",
              roadmap_id: "roadmap",
              title: "Practice HTML",
              coverage: "partial",
            },
          ],
        },
      ],
    },
    isPending: false,
  } as never);
  render(
    <MemoryRouter>
      <OccupationalProfile careerId="career" />
    </MemoryRouter>,
  );
  expect(screen.getByText(/Occupational observation: 0/)).toBeVisible();
  expect(
    screen.getByText("Partial learning coverage", { exact: false }),
  ).toBeVisible();
  expect(screen.getByRole("link", { name: "Practice HTML" })).toHaveAttribute(
    "href",
    "/roadmaps/career?roadmap=roadmap&topic=topic",
  );
  fireEvent.click(screen.getByRole("button", { name: "Next references" }));
  expect(vi.mocked(useCoreQuery).mock.lastCall?.[0]).toEqual([
    "career-evidence",
    "career",
    { offset: 20, release: "release" },
  ]);
  fireEvent.change(screen.getByLabelText("Source role"), {
    target: { value: "role" },
  });
  expect(vi.mocked(useCoreQuery).mock.lastCall?.[0]).toEqual([
    "career-evidence",
    "career",
    { offset: 0, role: "role", release: "release" },
  ]);
});

it("keeps the personal comparison available without an occupational release", () => {
  vi.mocked(useCoreQuery).mockReturnValue({
    data: { release_id: null },
    isPending: false,
  } as never);
  render(
    <MemoryRouter>
      <OccupationalProfile careerId="career" />
    </MemoryRouter>,
  );
  expect(
    screen.getByText(/personal skill comparison remains available/),
  ).toBeVisible();
  expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
});
