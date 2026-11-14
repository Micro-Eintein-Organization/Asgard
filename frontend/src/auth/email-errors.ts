export function emailDeliveryError(code: string | undefined, fallback: string) {
  if (code === "over_email_send_rate_limit")
    return "The demo email limit has been reached. Wait before requesting another code; repeated requests will not send it sooner.";
  if (code === "email_address_not_authorized")
    return "This demo can send email only to approved project addresses. Ask the project owner which address to use.";
  if (code === "over_request_rate_limit")
    return "Too many requests. Wait before trying again.";
  return fallback;
}
