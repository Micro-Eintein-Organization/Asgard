export function validateEmail(value: string) {
  const email = value.trim();
  if (!email) return "Enter your email.";
  if (email.length > 254) return "Use an email address of 254 characters or fewer.";
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || "Enter a valid email address.";
}
