import type { ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { appRoutes as pageRoutes } from "@/lib/routes";
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

export function SettingsLayout({ children, accountAnchor, action }: {
  children: ReactNode;
  accountAnchor?: string;
  action?: ReactNode;
}) {
  const { hash } = useLocation();
  const accountActive = !!accountAnchor && hash === accountAnchor;
  return (
    <div className="settings-layout">
      <aside className="settings-nav">
        <h2>Settings</h2>
        <nav aria-label="Settings sections">
          {accountAnchor ? <>
            <Link to={pageRoutes.profile} aria-current={!accountActive ? "page" : undefined}>Profile</Link>
            <Link to={pageRoutes.profile + accountAnchor} aria-current={accountActive ? "page" : undefined}>Account and security</Link>
          </> : <>
            <NavLink to={pageRoutes.profile}>Profile</NavLink>
            <NavLink to={pageRoutes.account}>Account and security</NavLink>
          </>}
        </nav>
        {action}
      </aside>
      <div className="settings-content">{children}</div>
    </div>
  );
}

export function ProfileDetailsCard({ children, photo }: { children: ReactNode; photo: ReactNode }) {
  return (
    <section className="settings-identity" aria-label="Personal details">
      {photo}
      {children}
    </section>
  );
}
