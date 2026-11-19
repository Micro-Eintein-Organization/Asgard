import { expect, it } from "vitest";
import { MIN_PASSWORD_LENGTH, validateNewPassword } from "./password";

it("accepts passwords at the configured minimum length", () => {
  expect(MIN_PASSWORD_LENGTH).toBe(8);
  expect(validateNewPassword("12345678")).toBe(true);
});

it("rejects passwords shorter than the configured minimum", () => {
  expect(validateNewPassword("1234567")).toBe("Use at least 8 characters.");
});

it("bounds UTF-8 bytes without trimming passwords", () => {
  expect(validateNewPassword("a".repeat(72))).toBe(true);
  expect(validateNewPassword("a".repeat(73))).not.toBe(true);
  expect(validateNewPassword("😀".repeat(18))).toBe(true);
  expect(validateNewPassword("😀".repeat(19))).not.toBe(true);
  expect(validateNewPassword("        ")).toBe(true);
});
