import { expect, it } from "vitest";
import { validateFirstName, validateSurname } from "./validation";

it("accepts mononyms and 100 Unicode code points, including characters outside the BMP", () => {
  expect(validateFirstName("  Li  ")).toBe(true);
  expect(validateSurname("𐐀".repeat(100))).toBe(true);
  expect(validateFirstName("𐐀".repeat(100))).toBe(true);
});

it("distinguishes optional surname from required first name and rejects invalid name input", () => {
  expect(validateSurname("")).toBe(true);
  expect(validateFirstName("  ")).not.toBe(true);
  expect(validateSurname("x".repeat(101))).not.toBe(true);
  expect(validateFirstName("a\u0000b")).not.toBe(true);
  expect(validateFirstName("\nAda")).not.toBe(true);
  expect(validateSurname("A\u0085B")).not.toBe(true);
});
