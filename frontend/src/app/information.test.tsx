import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { expect, it, vi } from "vitest";
import { FooterLinks, InformationPage } from "./information";
import { routes } from "@/lib/routes";
vi.mock("@/auth/context", () => ({ useAuth: () => ({ user: null, loading: false, error: null, mfa: "ready" }) }));
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
    expect(screen.queryByText(/Draft for review|under development/)).not.toBeInTheDocument();
  if (page === "licenses")
    expect(screen.getByText(/Copyright \(c\) 2023 shadcn/)).toBeInTheDocument();
});
it("pairs the approved portraits with alphabetized team names and one founder role", () => {
  const { container } = render(<MemoryRouter><InformationPage page="credits" /></MemoryRouter>);
  const figures = Array.from(container.querySelectorAll(".team-grid figure"));
  expect(figures.map(figure => figure.querySelector("figcaption")?.firstChild?.textContent)).toEqual([
    "Coulison", "Hzmth", "Lamb-OH", "Ranzzzz", "YakisobaNissin", "约翰·马可",
  ]);
  ["coulison.png", "hzmth.png", "lamb-oh.png", "ranz.jpg", "yakisobanissin.png", "founder.png"].forEach((filename, index) => {
    expect(figures[index].querySelector("img")?.getAttribute("src")).toContain(filename);
    expect(figures[index].querySelector("img")).toHaveAttribute("alt", "");
  });
  expect(screen.getAllByText("CEO and Founder")).toHaveLength(1);
  expect(screen.getByText(/Thank you for trying out our university project/)).toBeInTheDocument();
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
