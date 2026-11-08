import { useCallback, useEffect, useRef, useState } from "react";
import { FileText } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "@/auth/context";
import { useLogout } from "@/app/logout";
import { appRoutes } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeading, StatePanel, Unavailable } from "@/components/shared";
import { coreApi, useCoreMutation, useCoreQuery } from "@/features/core/data";
import { isCurrentAccount } from "@/auth/transport";
import { ProfileDocuments } from "@/features/profile/documents";
import { useProfileEditor } from "@/features/profile/use-profile-editor";
import { ProfileEditorDialogs } from "@/features/profile/profile-editor-dialogs";
import { ProfileDetailsCard, ProfileNameFields, SettingsLayout } from "@/features/profile/settings-layout";

export function SettingsScreen() {
  const { user } = useAuth();
  return user ? <SettingsEditor key={user.id} userId={user.id} /> : null;
}

function AccountCards() {
  return <>
    <Card className="settings-card">
      <header><h2>Sign-in methods</h2><p>You are signed in with email and password.</p></header>
      <Button disabled variant="outline">Link Google</Button>
      <Unavailable>Google linking is not available yet.</Unavailable>
    </Card>
    <Card className="settings-card">
      <header><h2>Authenticator app</h2><p>Optional two-factor authentication adds a second verification step.</p></header>
      <Button disabled variant="outline">Set up authenticator</Button>
      <Unavailable>Enrollment and recovery are not available yet.</Unavailable>
    </Card>
    <Card className="settings-card">
      <header><h2>Delete account</h2><p>Account deletion and removal of personal records are not available yet.</p></header>
      <Button disabled variant="destructive">Delete account</Button>
      <Unavailable>Account deletion is not available yet.</Unavailable>
    </Card>
  </>;
}

function SettingsEditor({ userId }: { userId: string }) {
  const navigate = useNavigate();
  const { hash } = useLocation();
  const accountView = hash === "#account-security";
  const logout = useLogout();
  const [primaryField, setPrimaryField] = useState<string | null>(null);
  const [timezoneDraft, setTimezoneDraft] = useState<string | null>(null);
  const preferenceVersion = useRef<number | null>(null);
  const preferences = useCoreQuery(["preferences"], coreApi.preferences);
  const categories = useCoreQuery(["categories"], coreApi.categories);
  const discovery = useCoreQuery(["discovery"], coreApi.discovery);
  const recommendations = useCoreQuery(["recommendations"], coreApi.recommendations);
  const preferenceSave = useCoreMutation(coreApi.savePreferences);
  const retake = useCoreMutation(coreApi.retakeDiscovery);
  const preferenceDirty = primaryField !== null || timezoneDraft !== null;
  const [documentGuard, setDocumentGuard] = useState({ dirty: false, pending: false });
  const onDocumentGuardChange = useCallback((dirty: boolean, pending: boolean) => {
    setDocumentGuard(previous => previous.dirty === dirty && previous.pending === pending ? previous : { dirty, pending });
  }, []);
  const [logoutError, setLogoutError] = useState("");
  const editor = useProfileEditor(userId, preferenceDirty || documentGuard.dirty, preferenceSave.isPending || documentGuard.pending);
  const { query, mutation, persist, feedback, errorSummary, setReloadOpen } = editor;
  const { register, handleSubmit, formState: { errors, isDirty } } = editor.form;
  useEffect(() => {
    if (!hash || !query.isSuccess) return;
    const frame = requestAnimationFrame(() => {
      const section = document.getElementById(hash.slice(1));
      section?.scrollIntoView({ block: "start" });
      const target = section?.querySelector("h1") ?? section;
      target?.setAttribute("tabindex", "-1");
      (target as HTMLElement | null)?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [hash, query.isSuccess]);

  async function signOut() {
    setLogoutError("");
    try { await logout(); } catch (error) {
      setLogoutError(error instanceof Error ? error.message : "Could not sign out.");
    }
  }
  const editing = isDirty || preferenceDirty || documentGuard.dirty;
  const saving = mutation.isPending || preferenceSave.isPending || documentGuard.pending;
  async function openDiscovery() {
    if (editing || saving || retake.isPending || discovery.isPending || discovery.isError) return;
    if (discovery.data?.latest_completed && !discovery.data.draft) {
      try {
        await retake.mutateAsync({
          source_session_id: discovery.data.latest_completed.id,
          expected_revision: discovery.data.latest_completed.revision,
        });
      } catch { return; }
    }
    if (isCurrentAccount(userId)) void navigate(appRoutes.discovery);
  }
  async function savePreferences() {
    const saved = preferences.data;
    if (!saved) return;
    try {
      await preferenceSave.mutateAsync({
        preferred_category_id: (primaryField ?? saved.preferred_category_id) || null,
        timezone: timezoneDraft ?? saved.timezone,
        dismissed_guidance: saved.dismissed_guidance,
        expected_version: preferenceVersion.current ?? saved.version,
      });
      if (isCurrentAccount(userId)) {
        preferenceVersion.current = null;
        setPrimaryField(null);
        setTimezoneDraft(null);
      }
    } catch { /* The saved error remains beside the unchanged draft. */ }
  }
  async function reloadPreferences() {
    if (preferenceDirty && !window.confirm("Discard preference edits and reload saved preferences?")) return;
    const loaded = await preferences.refetch();
    void categories.refetch();
    if (loaded.isSuccess && isCurrentAccount(userId)) {
      preferenceVersion.current = null;
      setPrimaryField(null);
      setTimezoneDraft(null);
      preferenceSave.reset();
    }
  }
  if (query.isPending) return <StatePanel kind="loading" title="Loading your profile">Reading your saved name.</StatePanel>;
  if (query.isError) return <StatePanel kind="error" title="Profile unavailable" action={<div className="action-row"><Button onClick={() => void query.refetch()}>Try again</Button><Button variant="outline" onClick={() => void signOut()}>Log out</Button></div>}>
    {query.error.message}{logoutError && <span role="alert">{logoutError}</span>}
  </StatePanel>;
  const savedRun = recommendations.data?.current?.status === "completed"
    ? recommendations.data.current : recommendations.data?.previous_eligible_success;
  const preferenceError = preferences.error ?? categories.error ?? preferenceSave.error;
  return <>
    <SettingsLayout accountAnchor="#account-security" action={<Button className="mt-3" variant="ghost" onClick={() => void signOut()}>Log out</Button>}>
      <div id={accountView ? "account-security" : undefined} className="settings-page-heading">
        <PageHeading title={accountView ? "Account and security" : "Your profile."}
          description={accountView ? "Manage how you access Asgard and what happens to your account." : "A little about you, on your terms. A photo and background document are always optional."} />
      </div>
      {logoutError && <p role="alert" className="field-error">{logoutError}</p>}
      <div className="settings-profile-content" hidden={accountView}>
        <ProfileDetailsCard>
          <form className="form-grid" onSubmit={handleSubmit(async values => { await persist(values); })}>
            {(errors.firstName || errors.surname) && <p ref={errorSummary} role="alert" tabIndex={-1} className="field-error">Check the name fields below.</p>}
            <ProfileNameFields register={register} errors={errors} disabled={mutation.isPending} />
            {mutation.error && <div role="alert" className="field-error"><p>{mutation.error.message}</p><Button type="button" variant="outline" onClick={() => setReloadOpen(true)}>Reload saved profile</Button></div>}
            {feedback && !isDirty && <p role="status">{feedback}</p>}
            <div className="action-row">
              <Button type="submit" disabled={!isDirty || mutation.isPending}>{mutation.isPending ? "Saving…" : "Save profile"}</Button>
              <Button type="button" variant="outline" disabled={!isDirty || mutation.isPending} onClick={editor.discard}>Discard changes</Button>
            </div>
          </form>
        </ProfileDetailsCard>
        <Card className="settings-card">
          <header><h2>Career background</h2><p>Optionally add a resume, academic record or project summary. No document is required to browse or learn.</p></header>
          <div className="upload-placeholder">
            <FileText size={28} aria-hidden="true" />
            <h3>Add a PDF when you're ready.</h3>
            <p>PDF upload and analysis are coming later.</p>
            <Button disabled variant="outline">Choose PDF</Button>
          </div>
          <ProfileDocuments compact onGuardChange={onDocumentGuardChange} />
        </Card>
        <Card className="settings-card" id="saved-discovery" tabIndex={-1}>
          <header><h2>Saved Discovery suggestions</h2><p>Discovery results are separate from your current roadmap.</p></header>
          {discovery.isPending || recommendations.isPending ? <p role="status">Loading saved Discovery.</p>
            : discovery.error || recommendations.error ? <p role="alert" className="field-error">{(discovery.error ?? recommendations.error)?.message} <Button variant="outline" onClick={() => { void discovery.refetch(); void recommendations.refetch(); }}>Reload Discovery</Button></p>
            : savedRun ? <p>{savedRun.items.length} saved career {savedRun.items.length === 1 ? "suggestion" : "suggestions"}.{savedRun.outdated && " Your saved context has changed."}</p>
            : <p>{discovery.data?.latest_completed ? "Your Discovery answers are saved. No successful suggestions are saved yet." : discovery.data?.draft ? "You have an unfinished saved Discovery draft." : "No saved suggestions yet. Discovery is optional."}</p>}
          <div className="action-row">
            <Button disabled={editing || saving || retake.isPending || discovery.isPending || discovery.isError} onClick={() => void openDiscovery()}>
              {retake.isPending ? "Opening…" : discovery.data?.draft ? "Resume Discovery" : discovery.data?.latest_completed ? "Retake Discovery" : "Start Discovery"}
            </Button>
            {discovery.data?.latest_completed && <Button asChild variant="outline"><Link to={appRoutes.results}>View saved career suggestions</Link></Button>}
          </div>
          {retake.error && <p role="alert" className="field-error">{retake.error.message} <Button variant="outline" onClick={() => void discovery.refetch()}>Reload Discovery</Button></p>}
          {editing && <p className="field-help">Save or discard your edits before opening Discovery.</p>}
        </Card>
        <Card className="settings-card">
          <header><h2>Preferred primary field</h2><p>This sets the catalog's default category. It does not change your current roadmap or recommendations.</p></header>
          <fieldset disabled={!preferences.data || preferenceSave.isPending}>
            <legend className="sr-only">Preferred primary field</legend>
            <div className="preference-list">
              {[{ id: "", title: "No preference" }, ...(categories.data ?? [])].map(field => <label key={field.id}>
                <input type="radio" name="preferred-field" checked={(primaryField ?? preferences.data?.preferred_category_id ?? "") === field.id}
                  onChange={() => { preferenceVersion.current ??= preferences.data?.version ?? null; setPrimaryField(field.id); }} />
                {field.title}
              </label>)}
            </div>
          </fieldset>
          <div className="field">
            <Label htmlFor="profile-timezone">Timezone for future activity</Label>
            <Input id="profile-timezone" value={timezoneDraft ?? preferences.data?.timezone ?? "UTC"}
              disabled={!preferences.data || preferenceSave.isPending}
              onChange={event => { preferenceVersion.current ??= preferences.data?.version ?? null; setTimezoneDraft(event.target.value); }} />
            <p className="field-help">Use an IANA timezone such as Asia/Manila. Historical activity dates stay unchanged.</p>
          </div>
          <div className="action-row">
            <Button disabled={!preferences.data || !preferenceDirty || preferenceSave.isPending} onClick={() => void savePreferences()}>{preferenceSave.isPending ? "Saving…" : "Save preferences"}</Button>
            <Button variant="outline" disabled={!preferenceDirty || preferenceSave.isPending} onClick={() => { preferenceVersion.current = null; setPrimaryField(null); setTimezoneDraft(null); preferenceSave.reset(); }}>Discard preference changes</Button>
          </div>
          {preferenceSave.isSuccess && !preferenceDirty && <p role="status">Preferences saved.</p>}
          {preferenceError && <p role="alert" className="field-error">{preferenceError.message} <Button variant="outline" disabled={preferenceSave.isPending} onClick={() => void reloadPreferences()}>Reload preferences</Button></p>}
        </Card>
      </div>
      <section className="settings-account-content" aria-label="Account and security settings" hidden={!accountView}>
        <AccountCards />
      </section>
    </SettingsLayout>
    <ProfileEditorDialogs editor={editor} extraDirty={preferenceDirty || documentGuard.dirty} extraPending={preferenceSave.isPending || documentGuard.pending} />
  </>;
}
