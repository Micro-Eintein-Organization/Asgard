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
import {
  appRoutes,
  isCareerNavigationActive,
  routes,
  routesWithoutNavbar,
} from "@/lib/routes";
import { StatePanel } from "@/components/shared";
import { useAuth } from "@/auth/context";
import { LogoutBoundary } from "./logout-boundary";
import { useLogout } from "./logout";

function Header() {
  const { user } = useAuth();
  const signOut = useLogout();
  const pageRoutes = appRoutes;
  const navigation = [
    { to: pageRoutes.dashboard, label: "Dashboard" },
    { to: pageRoutes.careers, label: "Career" },
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
          to={user ? appRoutes.dashboard : routes.home}
          className="brand"
          aria-label="Asgard home"
        >
          Asgard
        </Link>
        {user?.email_confirmed_at ? (
          <>
            <nav aria-label="Main navigation" className="desktop-navigation">
              {navigation.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    isActive ||
                    (item.label === "Career" &&
                      isCareerNavigationActive(pathname)) ||
                    (item.label === "Settings" &&
                      pathname.startsWith("/settings/"))
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
                  <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={pageRoutes.profile}>Edit profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={pageRoutes.account}>Account and security</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => void logOut()}>
                    Log out
                  </DropdownMenuItem>
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

export function AppShell() {
  return (
    <LogoutBoundary>
      <ShellContent />
    </LogoutBoundary>
  );
}

function ShellContent() {
  const { pathname } = useLocation();
  const hideHeader = routesWithoutNavbar.has(pathname);
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      {!hideHeader && <Header />}
      <main
        id="main-content"
        tabIndex={-1}
        className={`page-container${hideHeader ? " page-container-no-header" : ""}`}
      >
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
          <Link to={routes.status}>Service status</Link>
        </div>
      </footer>
    </>
  );
}
