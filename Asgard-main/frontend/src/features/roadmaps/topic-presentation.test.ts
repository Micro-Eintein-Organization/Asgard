import { describe, expect, it } from "vitest";
import { topicPresentation } from "./topic-presentation";

describe("published guide text presentation", () => {
  it("formats the converter's CRLF sections without inventing or duplicating content", () => {
    const text = "Overview\r\nIntro.\r\n\r\nWhat you'll learn\r\n- One\r\n\r\nSubtopics\r\nA detail.\r\n\r\nLearning outcome\r\nAuthored outcome.\r\n\r\nTools and setup\r\nA real tool.\r\n\r\nPractice\r\nA practice task.\r\n\r\nCompletion check\r\nAn authored check.";
    const parts = topicPresentation(text);
    expect(parts.overview).toBe("Intro.\n\nWhat you'll learn\n- One\n\nSubtopics\nA detail.");
    expect(parts.outcome).toBe("Authored outcome.");
    expect(parts.setup).toBe("A real tool.");
    expect(parts.practice).toBe("A practice task.");
    expect(parts.completion).toBe("An authored check.");
  });
  it("preserves legacy free-form text and leaves missing sections absent", () => {
    const parts = topicPresentation("A legacy explanation.\n\nKeep this entire paragraph.");
    expect(parts.overview).toBe("A legacy explanation.\n\nKeep this entire paragraph.");
    expect(parts.outcome).toBeUndefined();
    expect(parts.setup).toBeUndefined();
  });
  it("keeps unrecognized guidance and repeated authored sections", () => {
    const parts = topicPresentation("Overview\nIntro.\n\nExtra guidance\nKeep this.\n\nLearning outcome\nFirst.\n\nLearning outcome\nSecond.");
    expect(parts.overview).toContain("Extra guidance\nKeep this.");
    expect(parts.outcome).toBe("First.\n\nSecond.");
  });
});
