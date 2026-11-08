export const MIN_PASSWORD_LENGTH = 8;

export function validateNewPassword(value: string) {
  return (
    Array.from(value).length >= MIN_PASSWORD_LENGTH ||
    `Use at least ${MIN_PASSWORD_LENGTH} characters.`
  );
}
