export function resendCooldown() {
  return Math.max(
    0,
    Math.ceil(
      (Number(sessionStorage.getItem("asgard.resend-at")) - Date.now()) / 1000,
    ),
  );
}

export function startResendCooldown() {
  sessionStorage.setItem("asgard.resend-at", String(Date.now() + 60_000));
  return 60;
}
