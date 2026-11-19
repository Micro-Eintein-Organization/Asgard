export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_BYTES = 72;

export function validateNewPassword(value: string) {
  if (new TextEncoder().encode(value).length > MAX_PASSWORD_BYTES)
    return "Use a password of 72 UTF-8 bytes or fewer. Accented characters and emoji can use multiple bytes.";
  return (
    Array.from(value).length >= MIN_PASSWORD_LENGTH ||
    `Use at least ${MIN_PASSWORD_LENGTH} characters.`
  );
}
