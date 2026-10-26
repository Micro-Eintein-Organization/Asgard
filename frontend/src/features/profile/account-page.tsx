import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeading, Unavailable } from "@/components/shared";
import { SettingsLayout } from "./settings-layout";

export function AccountSettingsPage() {
  return (
    <SettingsLayout>
      <PageHeading
        title="Account and security"
        description="Manage how you access Asgard and what happens to your account."
      />
      <Card className="settings-card">
        <header>
          <h2>Sign-in methods</h2>
          <p>You are signed in with email and password.</p>
        </header>
        <Button disabled variant="outline">
          Link Google
        </Button>
        <Unavailable>
          Google linking requires provider compatibility verification and proof
          of existing-account access.
        </Unavailable>
      </Card>
      <Card className="settings-card">
        <header>
          <h2>Authenticator app</h2>
          <p>
            Optional two-factor authentication adds a second verification step.
          </p>
        </header>
        <Button disabled variant="outline">
          Set up authenticator
        </Button>
        <Unavailable>
          Enrollment and provider-managed recovery are not enabled or verified.
        </Unavailable>
      </Card>
      <Card className="settings-card">
        <header>
          <h2>Delete account</h2>
          <p>
            After identity verification, deletion ends account access and begins
            removal of personal records. There is no user-facing restoration
            period.
          </p>
        </header>
        <Button disabled variant="destructive">
          Delete account
        </Button>
        <Unavailable>Account deletion is not available yet.</Unavailable>
      </Card>
    </SettingsLayout>
  );
}
