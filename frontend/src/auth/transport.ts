import type { Session } from "@supabase/supabase-js";

let token: string | null = null;
let owner: string | null = null;
let controller = new AbortController();
let unauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null) {
  unauthorized = handler;
}

export function isCurrentAccount(userId: string) {
  return owner === userId;
}

export function rejectCurrentSession(request: Request) {
  if (token && request.headers.get("Authorization") === `Bearer ${token}`)
    unauthorized?.();
}

export function setTransportSession(session: Session | null) {
  const nextOwner = session?.user.id ?? null;
  const changed = nextOwner !== owner;
  if (changed) {
    controller.abort();
    controller = new AbortController();
  }
  owner = nextOwner;
  token = session?.access_token ?? null;
  return changed;
}

export function authenticatedRequest(request: Request) {
  const headers = new Headers(request.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  else headers.delete("Authorization");
  return new Request(request, {
    headers,
    signal: AbortSignal.any([request.signal, controller.signal]),
  });
}

export function endAcceptedDeletion() {
  unauthorized?.();
  setTransportSession(null);
}
