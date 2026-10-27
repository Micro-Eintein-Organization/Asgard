import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "@/auth/context";
import { useLogout } from "@/app/logout";
import { appRoutes } from "@/lib/routes";
import { StatePanel } from "@/components/shared";
import { useProfileEditor } from "@/features/profile/use-profile-editor";
import { ProfileEditorDialogs } from "@/features/profile/profile-editor-dialogs";
import {
  validateFirstName,
  validateSurname,
} from "@/features/profile/validation";

export function SettingsScreen() {
  const { user } = useAuth();
  return user ? <SettingsEditor key={user.id} userId={user.id} /> : null;
}

function SettingsEditor({ userId }: { userId: string }) {
  const navigate = useNavigate();
  const { hash } = useLocation();
  const logout = useLogout();
  const [primaryField, setPrimaryField] = useState("");
  const [logoutError, setLogoutError] = useState("");
  const editor = useProfileEditor(userId, primaryField !== "");
  const { query, mutation, persist, feedback, errorSummary, setReloadOpen } =
    editor;
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = editor.form;
  useEffect(() => {
    if (hash !== "#account-security" || !query.isSuccess) return;
    const frame = requestAnimationFrame(() => {
      const section = document.getElementById("account-security");
      section?.scrollIntoView({ block: "start" });
      section?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [hash, query.isSuccess]);
  async function signOut() {
    setLogoutError("");
    try {
      await logout();
    } catch (error) {
      setLogoutError(
        error instanceof Error ? error.message : "Could not sign out.",
      );
    }
  }
  if (query.isPending)
    return (
      <StatePanel kind="loading" title="Loading your profile">
        Reading your saved name.
      </StatePanel>
    );
  if (query.isError)
    return (
      <StatePanel
        kind="error"
        title="Profile unavailable"
        action={
          <div className="action-row">
            <button onClick={() => void query.refetch()}>Try again</button>
            <button onClick={() => void signOut()}>Log out</button>
          </div>
        }
      >
        {query.error.message}
        {logoutError && <p role="alert">{logoutError}</p>}
      </StatePanel>
    );

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 bg-white text-gray-900 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 border-t pt-6">
        {/* Left Sidebar */}
        <div className="md:col-span-3 space-y-2 border-r pr-6">
          <h2 className="text-xl font-bold mb-6">Settings</h2>
          <button
            onClick={() => void navigate(appRoutes.profile)}
            className="w-full text-left px-4 py-2 rounded-xl bg-gray-200 font-bold text-xs"
          >
            Profile
          </button>
          <Link
            to={appRoutes.profile + "#account-security"}
            className="block px-4 py-2 text-xs"
          >
            Account and security
          </Link>
          <button
            onClick={() => void signOut()}
            className="w-full text-left px-4 py-2 text-xs text-gray-500 hover:text-black cursor-pointer"
          >
            Log out
          </button>
        </div>

        {/* Right Main Content */}
        <div className="md:col-span-9 space-y-10 pl-2">
          {logoutError && (
            <p role="alert" className="field-error">
              {logoutError}
            </p>
          )}
          {/* Profile Section */}
          <section className="space-y-6">
            <h1 className="text-lg font-bold">Profile</h1>

            <form
              onSubmit={handleSubmit(async (values) => {
                await persist(values);
              })}
            >
              {/* Profile Inputs */}
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center border">
                  <span title="Photo uploads are not available yet">✏️</span>
                </div>
                <div className="space-y-3 max-w-sm flex-1">
                  <input
                    type="text"
                    placeholder="First Name"
                    aria-label="First name"
                    aria-invalid={!!errors.firstName}
                    disabled={mutation.isPending}
                    {...register("firstName", { validate: validateFirstName })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 text-xs focus:outline-none focus:border-black"
                  />
                  <input
                    type="text"
                    placeholder="Surname"
                    aria-label="Surname (optional)"
                    aria-invalid={!!errors.surname}
                    disabled={mutation.isPending}
                    {...register("surname", { validate: validateSurname })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 text-xs focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              {(errors.firstName || errors.surname) && (
                <p
                  ref={errorSummary}
                  role="alert"
                  tabIndex={-1}
                  className="field-error"
                >
                  {errors.firstName?.message ?? errors.surname?.message}
                </p>
              )}
              {mutation.error && (
                <div role="alert" className="field-error">
                  {mutation.error.message}{" "}
                  <button type="button" onClick={() => setReloadOpen(true)}>
                    Reload saved profile
                  </button>
                </div>
              )}
              {feedback && !isDirty && <p role="status">{feedback}</p>}
              <div className="flex flex-wrap gap-3 mt-4">
                <button
                  disabled={!isDirty || mutation.isPending}
                  className="bg-black text-white px-5 py-2 rounded-full text-xs"
                >
                  {mutation.isPending ? "Saving…" : "Save profile"}
                </button>
                <button
                  type="button"
                  disabled={!isDirty || mutation.isPending}
                  onClick={editor.discard}
                  className="border px-5 py-2 rounded-full text-xs"
                >
                  Discard changes
                </button>
              </div>
            </form>
            <p className="text-xs text-gray-500">
              Photo uploads are not available yet.
            </p>
            {/* Active Discovery Results Card */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-gray-700">
                Active Discovery Results
              </span>
              <div className="border border-gray-200 rounded-2xl p-5 flex justify-between items-center bg-white shadow-2xs">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                    Sample layout
                  </span>
                  <h4 className="font-bold text-sm">
                    No saved Discovery results
                  </h4>
                  <p className="text-[10px] text-gray-400">
                    Saving and generating suggestions are not connected yet.
                  </p>
                </div>
                <button
                  onClick={() => void navigate(appRoutes.discovery)}
                  className="px-4 py-2 rounded-full border border-gray-300 text-xs font-semibold hover:bg-gray-50 cursor-pointer"
                >
                  Retake Discovery
                </button>
              </div>
            </div>

            {/* Preferred Primary Field Radio Selector */}
            <div className="space-y-2 pt-2 border-t">
              <span className="text-xs font-bold text-gray-700">
                Preferred Primary Field
              </span>
              <p className="text-[10px] text-gray-400">
                Prototype selection only. Preferences are not saved and do not
                change your roadmap.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {[
                  "Software and AI",
                  "Data & Analytics",
                  "UI/UX Design",
                  "Security & Infrastructure",
                ].map((field) => {
                  const isSelected = primaryField === field;
                  return (
                    <button
                      key={field}
                      aria-pressed={isSelected}
                      onClick={() => setPrimaryField(field)}
                      className={`px-4 py-2 rounded-full text-xs font-medium border flex items-center space-x-2 transition-colors cursor-pointer ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-50/50 text-emerald-900 font-bold"
                          : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      <span>{field}</span>
                      <span
                        className={`w-2 h-2 rounded-full ${isSelected ? "bg-emerald-500" : "bg-gray-300"}`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Document Management Card */}
            <div className="space-y-2 pt-2 border-t">
              <span className="text-xs font-bold text-gray-700">
                Academic Profile & Document Management
              </span>
              <p className="text-[10px] text-gray-400">
                PDF upload and analysis are not connected. No document is
                required.
              </p>

              <div className="border border-gray-300 rounded-2xl p-4 flex justify-between items-center bg-white shadow-2xs">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-500 text-white font-bold rounded-lg flex items-center justify-center text-[10px]">
                    PDF
                  </div>
                  <div>
                    <h5 className="font-bold text-xs">No document uploaded</h5>
                    <span className="text-[9px] font-bold text-emerald-600 px-2 py-0.5 rounded-full bg-emerald-50">
                      Unavailable
                    </span>
                  </div>
                </div>
                <div className="flex space-x-3 text-xs font-semibold">
                  <button disabled className="hover:underline cursor-pointer">
                    Replace PDF
                  </button>
                  <button
                    disabled
                    className="text-red-500 hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Account and Security Section */}
          <section
            id="account-security"
            tabIndex={-1}
            className="space-y-4 border-t pt-6 scroll-mt-8"
          >
            <h3 className="text-lg font-bold">Account and Security</h3>
            <p className="text-xs font-semibold text-gray-700">Set up 2FA</p>
            <p className="text-[10px] text-gray-400">
              Choose authentication method
            </p>

            <div className="space-y-3">
              <div className="border border-gray-200 bg-white rounded-xl p-4 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">📱</span>
                  <div>
                    <h5 className="font-bold text-xs">Authenticator App</h5>
                    <p className="text-[10px] text-gray-500">
                      Enrollment and recovery await provider verification.
                    </p>
                  </div>
                </div>
                <button
                  disabled
                  className="text-xs font-bold text-red-500 hover:underline cursor-pointer"
                >
                  Unavailable
                </button>
              </div>

              <div className="border border-gray-200 rounded-xl p-4 flex justify-between items-center bg-white">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">💬</span>
                  <div>
                    <h5 className="font-bold text-xs">SMS Message</h5>
                    <p className="text-[10px] text-gray-400">
                      SMS authentication is not supported.
                    </p>
                  </div>
                </div>
                <button
                  disabled
                  className="text-xs font-semibold px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                >
                  Unavailable
                </button>
              </div>

              <div className="border border-gray-200 rounded-xl p-4 flex justify-between items-center bg-white">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">✉️</span>
                  <div>
                    <h5 className="font-bold text-xs">Email Code</h5>
                    <p className="text-[10px] text-gray-400">
                      Email-code MFA is not supported.
                    </p>
                  </div>
                </div>
                <button
                  disabled
                  className="text-xs font-semibold px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                >
                  Unavailable
                </button>
              </div>

              <div className="border border-gray-200 rounded-xl p-4 flex justify-between items-center bg-white">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">🔔</span>
                  <div>
                    <h5 className="font-bold text-xs">Push Notification</h5>
                    <p className="text-[10px] text-gray-400">
                      Push authentication is not supported.
                    </p>
                  </div>
                </div>
                <button
                  disabled
                  className="text-xs font-semibold px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                >
                  Unavailable
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
      <ProfileEditorDialogs editor={editor} extraDirty={primaryField !== ""} />
    </div>
  );
}
