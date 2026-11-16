import { useScreenContext } from "@/features/counselor-context";
import { ProfileSkills } from "@/features/competencies/profile-skills";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "@/auth/context";
import { useLogout } from "@/app/logout";
import { appRoutes } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatePanel, Unavailable } from "@/components/shared";
import { LoadingIndicator } from "@/components/loading-indicator";
import { coreApi, useCoreMutation, useCoreQuery } from "@/features/core/data";
import { isCurrentAccount } from "@/auth/transport";
import { ProfileDocuments } from "@/features/profile/documents";
import { useProfileEditor } from "@/features/profile/use-profile-editor";
import { ProfileEditorDialogs } from "@/features/profile/profile-editor-dialogs";
import { ProfileDetailsCard, ProfileNameFields, SettingsLayout } from "@/features/profile/settings-layout";
import { ProfilePhoto } from "@/features/profile/profile-photo";
import { AuthenticatorSetting } from "@/features/auth/mfa-page";

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
    <AuthenticatorSetting />
    <Card className="settings-card">
      <header><h2>Delete account</h2><p>Account deletion and removal of personal records are not available yet.</p></header>
      <Button disabled variant="destructive">Delete account</Button>
      <Unavailable>Account deletion is not available yet.</Unavailable>
    </Card>
  </>;
}

function SettingsEditor({ userId }: { userId: string }) {
  const navigate = useNavigate();
  const { hash, search } = useLocation();
  const review = new URLSearchParams(search);
  const accountView = hash === "#account-security";
  useScreenContext({ label: accountView ? "Settings → Account and security" : "Settings → Profile" });
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
  const [skillGuard, setSkillGuard] = useState({ dirty: false, pending: false });
  const onSkillGuardChange = useCallback((dirty: boolean, pending: boolean) => {
    setSkillGuard(previous => previous.dirty === dirty && previous.pending === pending ? previous : { dirty, pending });
  }, []);
  const [documentGuard, setDocumentGuard] = useState({ dirty: false, pending: false });
  const onDocumentGuardChange = useCallback((dirty: boolean, pending: boolean) => {
    setDocumentGuard(previous => previous.dirty === dirty && previous.pending === pending ? previous : { dirty, pending });
  }, []);
  const [logoutError, setLogoutError] = useState("");
  const editor = useProfileEditor(userId, preferenceDirty || documentGuard.dirty || skillGuard.dirty, preferenceSave.isPending || documentGuard.pending || skillGuard.pending);
  const { query, mutation, persist, feedback, errorSummary, setReloadOpen } = editor;
  const { register, handleSubmit, formState: { errors } } = editor.form;
  const isDirty = editor.profileDirty;
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
  const editing = isDirty || preferenceDirty || documentGuard.dirty || skillGuard.dirty;
  const saving = mutation.isPending || preferenceSave.isPending || documentGuard.pending || skillGuard.pending;
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
      <h1 className="settings-page-heading">{accountView ? "Account and security" : "Profile"}</h1>
      {logoutError && <p role="alert" className="field-error">{logoutError}</p>}
      <div className="settings-profile-content" hidden={accountView}>
        <ProfileDetailsCard photo={<ProfilePhoto
          enabled={query.data?.photo_enabled === true}
          savedVersion={query.data?.profile?.has_photo ? query.data.profile.version : null}
          draft={editor.photoDraft}
          onChange={editor.setPhotoDraft}
          disabled={mutation.isPending}
        />}>
          <form className="form-grid" onSubmit={handleSubmit(async values => { await persist(values); })}>
            {(errors.firstName || errors.surname) && <p ref={errorSummary} role="alert" tabIndex={-1} className="field-error">Check the name fields below.</p>}
            <ProfileNameFields register={register} errors={errors} disabled={mutation.isPending} />
            {mutation.error && <div role="alert" className="field-error"><p>{mutation.error.message}</p><Button type="button" variant="outline" onClick={() => setReloadOpen(true)}>Reload saved profile</Button></div>}
            {feedback && !isDirty && <p role="status" className="save-feedback">{feedback}</p>}
            <div className="action-row">
              <Button type="submit" disabled={!isDirty || mutation.isPending}>{mutation.isPending && <LoadingIndicator />}{mutation.isPending ? "Saving…" : "Save profile"}</Button>
              <Button type="button" variant="outline" disabled={!isDirty || mutation.isPending} onClick={editor.discard}>Discard changes</Button>
            </div>
          </form>
        </ProfileDetailsCard>
        <Card className="settings-card settings-discovery" id="saved-discovery" tabIndex={-1}>
          <header><h2>Guided Discovery</h2><p>Explore careers based on the work you’d like to try.</p></header>
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
          {discovery.data?.latest_completed && !discovery.data.draft && (
            <p className="field-help">Retake Discovery to answer the whole questionnaire again. Your previous answers stay saved.</p>
          )}
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
          <details className="settings-timezone">
            <summary>Activity timezone</summary>
            <div className="field">
            <Label htmlFor="profile-timezone">Timezone for future activity</Label>
            <Input id="profile-timezone" value={timezoneDraft ?? preferences.data?.timezone ?? "UTC"}
              disabled={!preferences.data || preferenceSave.isPending}
              onChange={event => { preferenceVersion.current ??= preferences.data?.version ?? null; setTimezoneDraft(event.target.value); }} />
            <p className="field-help">Use an IANA timezone such as Asia/Manila. Historical activity dates stay unchanged.</p>
            </div>
          </details>
          <div className="action-row">
            <Button disabled={!preferences.data || !preferenceDirty || preferenceSave.isPending} onClick={() => void savePreferences()}>{preferenceSave.isPending && <LoadingIndicator />}{preferenceSave.isPending ? "Saving…" : "Save preferences"}</Button>
            <Button variant="outline" disabled={!preferenceDirty || preferenceSave.isPending} onClick={() => { preferenceVersion.current = null; setPrimaryField(null); setTimezoneDraft(null); preferenceSave.reset(); }}>Discard preference changes</Button>
          </div>
          {preferenceSave.isSuccess && !preferenceDirty && <p role="status" className="save-feedback">Preferences saved.</p>}
          {preferenceError && <p role="alert" className="field-error">{preferenceError.message} <Button variant="outline" disabled={preferenceSave.isPending} onClick={() => void reloadPreferences()}>Reload preferences</Button></p>}
        </Card>
        <ProfileSkills key={userId} active={!accountView} onGuardChange={onSkillGuardChange}
          reviewCareer={review.get("reviewCareer") ?? undefined}
          reviewRoadmap={review.get("reviewRoadmap") ?? undefined}
          documents={<ProfileDocuments compact onGuardChange={onDocumentGuardChange} />} />
      </div>
      <section id="account-security" tabIndex={-1} className="settings-account-content" aria-label="Account and security" hidden={!accountView}>
        <AccountCards />
      </section>
    </SettingsLayout>
    <ProfileEditorDialogs editor={editor} extraDirty={preferenceDirty || documentGuard.dirty || skillGuard.dirty} extraPending={preferenceSave.isPending || documentGuard.pending || skillGuard.pending} />
  </>;
}
