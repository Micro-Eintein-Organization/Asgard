import type { ReactNode } from "react";
import { NavLink } from "react-router";
import { UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePageRoutes } from "@/lib/page-routes";

export function SettingsLayout({ children }: { children: ReactNode }) {
  const pageRoutes = usePageRoutes();
  return (
    <div className="settings-layout">
      <aside className="settings-nav">
        <h2>Settings</h2>
        <nav aria-label="Settings sections">
          <NavLink to={pageRoutes.profile}>Profile</NavLink>
          <NavLink to={pageRoutes.account}>Account and security</NavLink>
        </nav>
      </aside>
      <div className="settings-content">{children}</div>
    </div>
  );
}

export function ProfileDetailsCard({ children }: { children: ReactNode }) {
  return (
    <Card className="settings-card">
      <header>
        <h2>Personal details</h2>
        <p>
          Your name is enough to complete a basic profile. A photo is optional.
        </p>
      </header>
      <div className="profile-photo">
        <div className="avatar-placeholder">
          <UserRound size={27} aria-hidden="true" />
        </div>
        <div>
          <Button disabled variant="outline">
            Change photo
          </Button>
          <p className="field-help mt-2">
            Photo uploads are not available yet.
          </p>
        </div>
      </div>
      {children}
    </Card>
  );
}
