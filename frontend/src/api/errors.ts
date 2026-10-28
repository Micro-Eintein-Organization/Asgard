import type { components } from "./generated/schema";

export class APIRequestError extends Error {
  constructor(
    readonly status: number,
    readonly body: components["schemas"]["ErrorBody"],
    readonly retryAfter: number | null = null,
  ) {
    super(body.message);
    this.name = "APIRequestError";
  }
}

// Feature adapters pass the generated error body; never display raw transport/provider text.
export function requestError(
  response: Response,
  body: components["schemas"]["ErrorBody"] | undefined,
) {
  const retry = Number(response.headers.get("Retry-After"));
  return new APIRequestError(
    response.status,
    body ?? {
      code: "request_failed",
      message: "Could not complete the request. Try again.",
      request_id: response.headers.get("X-Request-ID") ?? "",
    },
    response.headers.has("Retry-After") && Number.isFinite(retry)
      ? Math.max(0, retry)
      : null,
  );
}
