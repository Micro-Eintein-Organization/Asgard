import { afterEach, expect, it, vi } from "vitest";
import type { Session } from "@supabase/supabase-js";
import {
  authenticatedRequest,
  isCurrentAccount,
  rejectCurrentSession,
  setTransportSession,
  setUnauthorizedHandler,
} from "./transport";

const session = (id: string, token: string) =>
  ({ user: { id }, access_token: token }) as Session;
afterEach(() => {
  setTransportSession(null);
  setUnauthorizedHandler(null);
});
it("aborts old account requests and never carries one account's token into another", () => {
  setTransportSession(session("A", "token-a"));
  const first = authenticatedRequest(
    new Request("http://app.test/api/v1/me/profile"),
  );
  expect(first.headers.get("Authorization")).toBe("Bearer token-a");
  setTransportSession(session("B", "token-b"));
  expect(isCurrentAccount("A")).toBe(false);
  expect(isCurrentAccount("B")).toBe(true);
  expect(first.signal.aborted).toBe(true);
  const next = authenticatedRequest(
    new Request("http://app.test/api/v1/me/profile"),
  );
  expect(next.headers.get("Authorization")).toBe("Bearer token-b");
  setTransportSession(null);
  expect(next.signal.aborted).toBe(true);
  expect(
    authenticatedRequest(
      new Request("http://app.test/api/v1/me/profile"),
    ).headers.has("Authorization"),
  ).toBe(false);
});
it("does not sign a new account out because an old request returned 401", () => {
  const onUnauthorized = vi.fn();
  setUnauthorizedHandler(onUnauthorized);
  setTransportSession(session("A", "token-a"));
  const old = authenticatedRequest(
    new Request("http://app.test/api/v1/me/profile"),
  );
  setTransportSession(session("B", "token-b"));
  rejectCurrentSession(old);
  expect(onUnauthorized).not.toHaveBeenCalled();
  rejectCurrentSession(
    authenticatedRequest(new Request("http://app.test/api/v1/me/profile")),
  );
  expect(onUnauthorized).toHaveBeenCalledOnce();
});
