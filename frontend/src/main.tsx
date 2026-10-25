import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";
import { router } from "./app/router";
import { queryClient } from "./app/query-client";
import "./styles.css";
import { AuthProvider } from "./auth/provider";

if (import.meta.env.DEV) {
  void import("./auth/dev-security-checks").then(({ installDevSecurityChecks }) =>
    installDevSecurityChecks(),
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
