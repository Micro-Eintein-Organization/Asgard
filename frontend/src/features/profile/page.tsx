import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeading, StatePanel, Unavailable } from "@/components/shared";
import { UnsavedPreviewDialog } from "@/components/unsaved-preview-dialog";
import { categories } from "@/fixtures/catalog";
import { useIsPreview, usePageRoutes } from "@/lib/page-routes";
import { SettingsLayout, ProfileDetailsCard } from "./settings-layout";
import { validateFirstName, validateSurname } from "./validation";

export function SettingsPage({ account = false }: { account?: boolean }) {
  const preview = useIsPreview();
  const pageRoutes = usePageRoutes();
  const {
    register,
    formState: { errors, isDirty },
  } = useForm<{ firstName: string; surname: string }>({
    mode: "onBlur",
    defaultValues: { firstName: "", surname: "" },
  });
  const preferences = useForm<{ field: string }>();
  return (
    <SettingsLayout>
      <UnsavedPreviewDialog when={isDirty || preferences.formState.isDirty} />
      <PageHeading
        title={account ? "Account and security" : "Your profile."}
        description={
          account
            ? "Manage how you access Asgard and what happens to your account."
            : "A little about you, on your terms. A photo and background document are always optional."
        }
      />
      {account ? (
        <>
          <Card className="settings-card">
            <header>
              <h2>Sign-in methods</h2>
              <p>
                {preview
                  ? "No account is connected to this preview."
                  : "You are signed in with email and password."}
              </p>
            </header>
            <Button disabled variant="outline">
              Link Google
            </Button>
            <Unavailable>
              Google linking requires provider compatibility verification and
              proof of existing-account access.
            </Unavailable>
          </Card>
          <Card className="settings-card">
            <header>
              <h2>Authenticator app</h2>
              <p>
                Optional two-factor authentication adds a second verification
                step.
              </p>
            </header>
            <Button disabled variant="outline">
              Set up authenticator
            </Button>
            <Unavailable>
              Enrollment and provider-managed recovery are not enabled or
              verified.
            </Unavailable>
          </Card>
          <Card className="settings-card">
            <header>
              <h2>Delete account</h2>
              <p>
                After identity verification, deletion ends account access and
                begins removal of personal records. There is no user-facing
                restoration period.
              </p>
            </header>
            <Button disabled variant="destructive">
              Delete account
            </Button>
            <Unavailable>Account deletion is not available yet.</Unavailable>
          </Card>
        </>
      ) : (
        <>
          <section>
            <ProfileDetailsCard>
              <form
                className="form-grid"
                onSubmit={(event) => event.preventDefault()}
              >
                <div className="name-fields">
                  <div className="field">
                    <Label htmlFor="first-name">First name</Label>
                    <Input
                      id="first-name"
                      autoComplete="given-name"
                      aria-invalid={!!errors.firstName}
                      aria-describedby={
                        errors.firstName ? "first-name-error" : undefined
                      }
                      {...register("firstName", {
                        validate: validateFirstName,
                      })}
                    />
                    {errors.firstName && (
                      <p
                        className="field-error"
                        id="first-name-error"
                        role="alert"
                      >
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div className="field">
                    <Label htmlFor="surname">
                      Surname{" "}
                      <span className="muted font-normal">(optional)</span>
                    </Label>
                    <Input
                      id="surname"
                      autoComplete="family-name"
                      aria-invalid={!!errors.surname}
                      aria-describedby={
                        errors.surname ? "surname-error" : undefined
                      }
                      {...register("surname", { validate: validateSurname })}
                    />
                    {errors.surname && (
                      <p
                        className="field-error"
                        id="surname-error"
                        role="alert"
                      >
                        {errors.surname.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <Button disabled>Save profile</Button>
                  <Unavailable>
                    Saving and photo uploads are not connected. Typed values are
                    unsaved preview input.
                  </Unavailable>
                </div>
              </form>
            </ProfileDetailsCard>
          </section>
          <section>
            <Card className="settings-card">
              <header>
                <h2>Career background</h2>
                <p>
                  Optionally add a resume, academic record or project summary.
                  No document is required to browse or learn.
                </p>
              </header>
              <div className="upload-placeholder">
                <FileText size={28} aria-hidden="true" />
                <h3>Add a PDF when you're ready.</h3>
                <p>
                  A future analysis will extract explicitly stated background
                  for career suggestions. Review the provider and privacy notice
                  before uploading.
                </p>
                <Button disabled variant="outline">
                  Choose PDF
                </Button>
                <p>
                  Selectable-text PDF, up to 10 MB. Scanned or encrypted
                  documents are unsupported.
                </p>
              </div>
              <Unavailable>
                Upload, analysis, replacement and removal are not connected. No
                files are accepted by this preview.
              </Unavailable>
            </Card>
          </section>
          <section>
            <Card className="settings-card">
              <header>
                <h2>Saved Discovery suggestions</h2>
                <p>Discovery results are separate from your current roadmap.</p>
              </header>
              <StatePanel
                kind="empty"
                title="No saved suggestions"
                action={
                  <Button asChild variant="outline">
                    <Link to={pageRoutes.welcome}>Open Discovery preview</Link>
                  </Button>
                }
              >
                There are no account results in this preview. You can review the
                questionnaire layout without saving answers.
              </StatePanel>
            </Card>
          </section>
          <section>
            <Card className="settings-card">
              <header>
                <h2>Preferred primary field</h2>
                <p>
                  In the completed app, this sets the catalog's default
                  category. It does not change your current roadmap or
                  recommendations.
                </p>
              </header>
              <form
                onSubmit={(event) => event.preventDefault()}
                className="form-grid"
              >
                <fieldset>
                  <legend className="sr-only">Preferred primary field</legend>
                  <div className="preference-list">
                    {categories.map((category) => (
                      <label key={category.id}>
                        <input
                          type="radio"
                          value={category.id}
                          {...preferences.register("field")}
                        />
                        {category.title}
                      </label>
                    ))}
                  </div>
                </fieldset>
                <div>
                  <Button disabled>Save preferences</Button>
                  <Unavailable>
                    This choice is only a preview. Preferences cannot be saved
                    yet.
                  </Unavailable>
                </div>
              </form>
            </Card>
          </section>
        </>
      )}
    </SettingsLayout>
  );
}
