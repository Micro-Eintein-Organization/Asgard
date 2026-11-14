import { expect, it } from "vitest";
import { emailDeliveryError } from "./email-errors";
it("explains demo limits without exposing provider internals", () => {
  expect(emailDeliveryError("over_email_send_rate_limit", "failed")).toContain("demo email limit");
  expect(emailDeliveryError("email_address_not_authorized", "failed")).toContain("approved project addresses");
  expect(emailDeliveryError("over_request_rate_limit", "failed")).toContain("Wait");
  expect(emailDeliveryError("unknown", "failed")).toBe("failed");
});
