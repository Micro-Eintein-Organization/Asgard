import { z } from "zod";

const supportedName = z
  .string()
  .refine(
    (value) =>
      !Array.from(value).some((character) => {
        const code = character.codePointAt(0) ?? 0;
        return code < 32 || (code >= 127 && code <= 159);
      }),
    "Remove control characters from your name.",
  )
  .transform((value) => value.trim())
  .refine(
    (value) => Array.from(value).length <= 100,
    "Use 100 characters or fewer.",
  );

const firstName = supportedName.refine(
  (value) => value.length > 0,
  "Enter your first name.",
);

export function validateFirstName(value: string) {
  const result = firstName.safeParse(value);
  return result.success || result.error.issues[0].message;
}

export function validateSurname(value: string) {
  const result = supportedName.safeParse(value);
  return result.success || result.error.issues[0].message;
}
