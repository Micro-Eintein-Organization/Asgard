import { CounselorContextProvider } from "@/features/counselor-context";
import { AccountAvatar, useSavedProfile } from "@/features/profile/identity";
import { Suspense, useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
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
import { LogoutBoundary } from "./logout-boundary";
import { useLogout } from "./logout";
import { BrandLogo } from "@/components/brand-logo";
import { CounselorLauncher } from "@/features/ai-guidance";
import { CareerNavigation } from "./career-navigation";
import { GuidanceBanner } from "./guidance";
import { PageMotion } from "@/components/page-motion";
import { FooterLinks } from "./information";

const onboardingPaths = new Set([
  appRoutes.welcome,
  appRoutes.discovery,
  appRoutes.results,
  appRoutes.profileSetup,
]);

function Header() {
  const { user } = useAuth();
  const savedProfile = useSavedProfile();
  const displayName = [savedProfile.data?.profile?.first_name, savedProfile.data?.profile?.surname].filter(Boolean).join(" ");
  const signOut = useLogout();
  const pageRoutes = appRoutes;
  const navigation = [
    { to: pageRoutes.dashboard, label: "Dashboard" },
    { to: pageRoutes.roadmaps, label: "Career" },
    { to: pageRoutes.profile, label: "Settings" },
  ];
  const location = useLocation();
  const { pathname } = location;
  const publicPage = Object.values(routes).includes(pathname);
  const showAppNavigation = !!user?.email_confirmed_at && !publicPage;
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
      {navigation.map((item) =>
        item.label === "Career" ? (
          <CareerNavigation key={item.to} />
        ) : (
          <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)}>
            {item.label}
          </NavLink>
        ),
      )}
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
          to={showAppNavigation ? appRoutes.dashboard : routes.home}
          className="brand"
          aria-label="Asgard home"
        >
          <BrandLogo />
        </Link>
        {showAppNavigation ? (
          <>
            <nav aria-label="Main navigation" className="desktop-navigation">
              {navigation.map((item) =>
                item.label === "Career" ? (
                  <CareerNavigation key={item.to} />
                ) : (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      isActive ||
                      (item.label === "Settings" &&
                        pathname.startsWith("/settings/"))
                        ? "active"
                        : ""
                    }
                  >
                    {item.label}
                  </NavLink>
                ),
              )}
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
                    <AccountAvatar />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="account-menu">
                  <DropdownMenuLabel>{displayName && <span className="block">{displayName}</span>}<span className="block text-sm">{user?.email}</span></DropdownMenuLabel>
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
            <Link to={routes.login}>Log in</Link>
            <Button asChild>
              <Link to={routes.register}>Get started</Link>
            </Button>
          </div>
        )}
      </div>
      {logoutError && (
        <p role="alert" className="field-error text-center">
          {logoutError}
        </p>
      )}
      {showAppNavigation && open && mobileNavigation()}
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
  const { user } = useAuth();
  return (
    <CounselorContextProvider key={user?.id ?? "anonymous"}><LogoutBoundary>
      <ShellContent />
    </LogoutBoundary></CounselorContextProvider>
  );
}

function ShellContent() {
  const { user, mfa } = useAuth();
  const { pathname, search } = useLocation();
  const pagePath = pathname.replace(/\/+$/, "");
  const onboarding = onboardingPaths.has(pagePath);
  const showCounselor = mfa === "ready" && user?.email_confirmed_at &&
    !Object.values(routes).includes(pagePath);
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      {!onboarding && <Header key={pathname} />}
      <main
        id="main-content"
        tabIndex={-1}
        className={
          onboarding
            ? "page-container onboarding-page-container"
            : "page-container"
        }
      >
        {onboarding && <BrandLogo className="onboarding-logo" />}
        <Suspense
          fallback={
            <StatePanel kind="loading" title="Opening this page">
              Loading the requested screen.
            </StatePanel>
          }
        >
          {(!onboarding || pathname === appRoutes.results) &&
            user?.email_confirmed_at &&
            mfa === "ready" &&
            !Object.values(routes).includes(pathname) && <GuidanceBanner />}
          <Outlet />
          <PageMotion />
          <PageFocus />
        </Suspense>
      </main>
      {showCounselor && (
        <CounselorLauncher key={user.id} query={new URLSearchParams(search)} page={pagePath} />
      )}
      {!onboarding && (
        <footer className="site-footer">
          <span>
            Asgard
            <span className="footer-purpose">
              Career exploration, at your pace.
            </span>
          </span>
          <FooterLinks />
        </footer>
      )}
    </>
  );
}
