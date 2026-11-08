import { describe, expect, it } from "vitest";
import { validateHostedEnvironment } from "./hosting";

const settings = {
  VITE_DEPLOYMENT_ENVIRONMENT: "staging",
  VITE_API_BASE_URL: "https://api.example.test",
  VITE_SUPABASE_URL: "https://auth.example.test",
  VITE_AUTH_ENABLED: "true",
  VITE_SUPABASE_ANON_KEY: "synthetic-public",
};
describe("hosted build settings", () => {
  it("requires an explicit API origin instead of the development proxy", () => {
    expect(() => validateHostedEnvironment(settings)).not.toThrow();
    expect(() => validateHostedEnvironment({ ...settings, VITE_API_BASE_URL: "" })).toThrow();
    expect(() => validateHostedEnvironment({ ...settings, VITE_API_BASE_URL: "http://localhost:8000" })).toThrow();
  });
});
