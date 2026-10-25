import type { ReactNode } from "react";
import { NavLink } from "react-router";
import { UserRound } from "lucide-react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePageRoutes } from "@/lib/page-routes";
import { validateFirstName, validateSurname } from "./validation";

type NameFields = { firstName: string; surname: string };

export function ProfileNameFields({
  register,
  errors,
  disabled = false,
}: {
  register: UseFormRegister<NameFields>;
  errors: FieldErrors<NameFields>;
  disabled?: boolean;
}) {
  return (
    <div className="name-fields">
      <div className="field">
        <Label htmlFor="first-name">First name</Label>
        <Input
          id="first-name"
          autoComplete="given-name"
          disabled={disabled}
          aria-invalid={!!errors.firstName}
          aria-describedby={errors.firstName ? "first-name-error" : undefined}
          {...register("firstName", { validate: validateFirstName })}
        />
        {errors.firstName && (
          <p id="first-name-error" role="alert" className="field-error">
            {errors.firstName.message}
          </p>
        )}
      </div>
      <div className="field">
        <Label htmlFor="surname">
          Surname <span className="muted font-normal">(optional)</span>
        </Label>
        <Input
          id="surname"
          autoComplete="family-name"
          disabled={disabled}
          aria-invalid={!!errors.surname}
          aria-describedby={errors.surname ? "surname-error" : undefined}
          {...register("surname", { validate: validateSurname })}
        />
        {errors.surname && (
          <p id="surname-error" role="alert" className="field-error">
            {errors.surname.message}
          </p>
        )}
      </div>
    </div>
  );
}

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
