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
import { appRoutes, routes } from "@/lib/routes";
import { StatePanel } from "@/components/shared";
import { useAuth } from "@/auth/context";
import { LogoutBoundary, useLogout } from "./logout";

function Header({ preview }: { preview: boolean }) {
  const { user } = useAuth();
  const signOut = useLogout();
  const pageRoutes = preview ? routes : appRoutes;
  const navigation = [
    { to: pageRoutes.dashboard, label: "Dashboard" },
    { to: pageRoutes.careers, label: "Roadmap" },
    { to: pageRoutes.profile, label: "Settings" },
  ];
  const location = useLocation();
  const { pathname } = location;
  const [open, setOpen] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const menuRef = useRef<HTMLButtonElement>(null);
  async function logOut() {
    setLogoutError("");
    try {
      await signOut();
    } catch (error) {
      setLogoutError(
        error instanceof Error ? error.message : "Could not sign out.",
      );
    }
  }
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
      <Link to={pageRoutes.welcome} onClick={() => setOpen(false)}>
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
          to={
            preview
              ? routes.dashboard
              : user
                ? appRoutes.dashboard
                : routes.home
          }
          className="brand"
          aria-label="Asgard home"
        >
          Asgard
        </Link>
        {preview || user?.email_confirmed_at ? (
          <>
            <nav aria-label="Main navigation" className="desktop-navigation">
              {navigation.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    isActive ||
                    (item.label === "Roadmap" &&
                      (pathname === "/roadmaps" ||
                        pathname.startsWith(
                          preview ? "/preview/roadmaps/" : "/roadmaps/",
                        ))) ||
                    (item.label === "Settings" &&
                      pathname.startsWith(
                        preview ? "/preview/settings/" : "/settings/",
                      ))
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
                  <DropdownMenuLabel>
                    {preview ? "Preview account" : user?.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={pageRoutes.profile}>Edit profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={pageRoutes.account}>Account and security</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {preview ? (
                    <>
                      <DropdownMenuItem disabled>
                        Log out (not connected)
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={routes.home}>Leave preview</Link>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem onSelect={() => void logOut()}>
                      Log out
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        ) : (
          <div className="public-nav">
            {user ? (
              <Link to={appRoutes.dashboard}>Dashboard</Link>
            ) : (
              <>
                <Link to={routes.login}>Log in</Link>
                <Button asChild>
                  <Link to={routes.register}>Get started</Link>
                </Button>
              </>
            )}
          </div>
        )}
      </div>
      {logoutError && (
        <p role="alert" className="field-error text-center">
          {logoutError}
        </p>
      )}
      {open && mobileNavigation()}
    </header>
  );
}

function PageFocus() {
  const { pathname, hash } = useLocation();
  const previousPath = useRef(pathname);
  useEffect(() => {
    document.title = `Asgard | ${pathname.split("/").at(-1)?.replaceAll("-", " ") || "Career exploration"}`;
    if (previousPath.current === pathname && !hash) return;
    previousPath.current = pathname;
    if (hash) {
      const frame = requestAnimationFrame(() => {
        document
          .getElementById(decodeURIComponent(hash.slice(1)))
          ?.scrollIntoView({ block: "start" });
      });
      return () => cancelAnimationFrame(frame);
    }
    const heading =
      document.querySelector<HTMLHeadingElement>("#main-content h1");
    heading?.setAttribute("tabindex", "-1");
    heading?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export function AppShell({ preview = false }: { preview?: boolean }) {
  return (
    <LogoutBoundary>
      <ShellContent preview={preview} />
    </LogoutBoundary>
  );
}

function ShellContent({ preview }: { preview: boolean }) {
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
