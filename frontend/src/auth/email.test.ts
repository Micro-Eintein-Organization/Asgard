import { expect, it } from "vitest";
import { validateEmail } from "./email";

it("validates trimmed emails and length boundaries", () => {
  expect(validateEmail(" user+tag@example.test ")).toBe(true);
  for (const email of ["", "name", "a@@example.test", "a b@example.test", "a@example"])
    expect(validateEmail(email)).not.toBe(true);
  const address = "a@" + "b".repeat(248) + ".com";
  expect(address.length).toBe(254);
  expect(validateEmail(address)).toBe(true);
  expect(validateEmail("a" + address)).not.toBe(true);
});
