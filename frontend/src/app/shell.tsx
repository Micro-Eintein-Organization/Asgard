import { Suspense, useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import { Menu, UserRound, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { routes } from "@/lib/routes";
import { StatePanel } from "@/components/shared";

const navigation = [
  { to: routes.dashboard, label: "Dashboard" },
  { to: routes.careers, label: "Roadmap" },
  { to: routes.profile, label: "Settings" },
];

function Header({ preview }: { preview: boolean }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLButtonElement>(null);
  const mobileNavigation = () => (
    <nav
      id="mobile-navigation"
      aria-label="Main navigation"
      className="mobile-navigation"
    >
      {navigation.map((item) => (
        <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)}>
          {item.label}
        </NavLink>
      ))}
      <Link to={routes.welcome} onClick={() => setOpen(false)}>
        Discovery
      </Link>
    </nav>
  );
  return (
    <header
      className="site-header"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          menuRef.current?.focus();
        }
      }}
    >
      <div className="header-inner">
        <Link
          to={preview ? routes.dashboard : routes.home}
          className="brand"
          aria-label="Asgard home"
        >
          Asgard
        </Link>
        {preview ? (
          <>
            <nav aria-label="Main navigation" className="desktop-navigation">
              {navigation.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    isActive ||
                    (item.label === "Roadmap" &&
                      pathname.startsWith("/preview/roadmaps/")) ||
                    (item.label === "Settings" &&
                      pathname.startsWith("/preview/settings/"))
                      ? "active"
                      : ""
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="header-actions">
              <Button
                ref={menuRef}
                variant="ghost"
                className="mobile-menu-button"
                aria-expanded={open}
                aria-controls="mobile-navigation"
                onClick={() => setOpen(!open)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    setOpen(false);
                    menuRef.current?.focus();
                  }
                }}
              >
                {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
                Menu
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="account-trigger"
                    aria-label="Account menu"
                  >
                    <UserRound aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="account-menu">
                  <DropdownMenuLabel>Preview account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={routes.profile}>Edit profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={routes.account}>Account and security</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled>
                    Log out (not connected)
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={routes.home}>Leave preview</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        ) : (
          <div className="public-nav">
            <Link to={routes.login}>Sign in</Link>
            <Button asChild>
              <Link to={routes.register}>Create an account</Link>
            </Button>
          </div>
        )}
      </div>
      {preview && open && mobileNavigation()}
    </header>
  );
}

function PageFocus() {
  const location = useLocation();
  const pathname = location.pathname;
  const previousPath = useRef(pathname);
  useEffect(() => {
    document.title = `Asgard | ${pathname.split("/").at(-1)?.replaceAll("-", " ") || "Career exploration"}`;
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    const heading =
      document.querySelector<HTMLHeadingElement>("#main-content h1");
    heading?.setAttribute("tabindex", "-1");
    heading?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function AppShell({ preview = false }: { preview?: boolean }) {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header preview={preview} />
      {preview && (
        <div className="preview-bar">
          <div>
            <strong>UI preview</strong>
            <span>
              Sample content. No account, answers or progress are saved.
            </span>
            <Link to={routes.home}>Leave preview</Link>
          </div>
        </div>
      )}
      <main id="main-content" tabIndex={-1} className="page-container">
        <Suspense
          fallback={
            <StatePanel kind="loading" title="Opening this page">
              Loading the requested screen.
            </StatePanel>
          }
        >
          <Outlet />
          <PageFocus />
        </Suspense>
      </main>
      <footer className="site-footer">
        <span>
          Asgard
          <span className="footer-purpose">
            Career exploration, at your pace.
          </span>
        </span>
        <div>
          {preview && <Link to={routes.components}>UI components</Link>}
          <Link to={routes.status}>Service status</Link>
        </div>
      </footer>
    </>
  );
}
