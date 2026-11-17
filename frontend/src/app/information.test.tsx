import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { expect, it } from "vitest";
import { FooterLinks, InformationPage } from "./information";
import { routes } from "@/lib/routes";
it.each([
  ["Licenses", routes.licenses, "licenses"],
  ["Credits", routes.credits, "credits"],
  ["Terms and conditions", routes.terms, "terms"],
] as const)("opens public %s from the footer", (title, path, page) => {
  render(
    <MemoryRouter>
      <FooterLinks />
      <Routes>
        <Route path="/" element={<p>Home</p>} />
        <Route path={path} element={<InformationPage page={page} />} />
      </Routes>
    </MemoryRouter>,
  );
  fireEvent.click(screen.getByRole("link", { name: title }));
  expect(
    screen.getByRole("heading", { level: 1, name: title }),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Back to Asgard" })).toHaveAttribute(
    "href",
    "/",
  );
  if (page === "terms")
    expect(screen.getByText("Draft for review")).toBeInTheDocument();
  if (page === "licenses")
    expect(screen.getByText(/Copyright \(c\) 2023 shadcn/)).toBeInTheDocument();
});
it("links to existing public status", () => {
  render(
    <MemoryRouter>
      <FooterLinks />
    </MemoryRouter>,
  );
  expect(screen.getByRole("link", { name: "Service status" })).toHaveAttribute(
    "href",
    routes.status,
  );
});
