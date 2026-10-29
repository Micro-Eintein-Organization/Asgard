import { expect, it } from "vitest";
import { dismissGuidance } from "./guidance-preferences";

it("sends only writable fields and preserves the read revision", () => {
  const saved = { preferred_category_id: null, timezone: "UTC", version: 7,
    dismissed_guidance: Array.from({ length: 20 }, (_, i) => "guidance-" + i) };
  const value = dismissGuidance(saved, "guidance-19");
  expect(value).toEqual({
    preferred_category_id: null, timezone: "UTC", expected_version: 7,
    dismissed_guidance: saved.dismissed_guidance,
  });
  expect(dismissGuidance(saved, "new").dismissed_guidance).toHaveLength(20);
});
