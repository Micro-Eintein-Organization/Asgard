import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { MemoryRouter, useLocation } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { coreApi, useCoreMutation, useCoreQuery } from "@/features/core/data";
import { useProfileEditor } from "@/features/profile/use-profile-editor";
import { SettingsScreen } from "./SettingsScreen";

vi.mock("@/auth/context", () => ({ useAuth: () => ({ user: { id: "owner" } }) }));
vi.mock("@/auth/transport", () => ({ isCurrentAccount: () => true }));
vi.mock("@/app/logout", () => ({ useLogout: () => vi.fn() }));
vi.mock("@/features/core/data", () => ({ coreApi: { savePreferences: vi.fn(), retakeDiscovery: vi.fn() }, useCoreQuery: vi.fn(), useCoreMutation: vi.fn() }));
vi.mock("@/features/profile/use-profile-editor", () => ({ useProfileEditor: vi.fn() }));
vi.mock("@/features/profile/profile-editor-dialogs", () => ({ ProfileEditorDialogs: () => null }));
vi.mock("@/features/profile/documents", () => ({ ProfileDocuments: () => <p>Saved document controls</p> }));

const persist = vi.fn();
const savePreferences = vi.fn();
const retake = vi.fn();
function useMockEditor() {
  const form = useForm({ defaultValues: { firstName: "Saved", surname: "Name" } });
  return {
    form, query: { isPending: false, isSuccess: true },
    mutation: { isPending: false }, feedback: "", errorSummary: { current: null },
    setReloadOpen: vi.fn(), persist,
    discard: () => form.reset({ firstName: "Saved", surname: "Name" }),
  } as unknown as ReturnType<typeof useProfileEditor>;
}
function Location() { const location = useLocation(); return <output data-testid="location">{location.pathname}{location.hash}</output>; }
function open() { render(<MemoryRouter initialEntries={["/settings/profile"]}><SettingsScreen /><Location /></MemoryRouter>); }

beforeEach(() => {
  persist.mockReset().mockResolvedValue(true);
  savePreferences.mockReset().mockResolvedValue({});
  retake.mockReset().mockResolvedValue({});
  vi.mocked(useProfileEditor).mockImplementation(useMockEditor);
  vi.mocked(useCoreMutation).mockImplementation(save => ({ mutateAsync: save === coreApi.retakeDiscovery ? retake : savePreferences, isPending: false, reset: vi.fn() }) as never);
  const data: Record<string, unknown> = {
    preferences: { preferred_category_id: "software", timezone: "UTC", version: 3, dismissed_guidance: [] },
    categories: [{ id: "software", title: "Software and AI" }, { id: "data", title: "Data & Analytics" }],
    discovery: { latest_completed: { id: "completed", revision: 7 }, draft: null },
    recommendations: { current: null, previous_eligible_success: null },
  };
  vi.mocked(useCoreQuery).mockImplementation(key => ({ data: data[String(key[0])], isPending: false, isError: false }) as never);
});

describe("Cabusao Settings with connected controllers", () => {
  it("restores the shared personal/background/suggestions/preferences cards", () => {
    open();
    for (const name of ["Personal details", "Career background", "Saved Discovery suggestions", "Preferred primary field"]) {
      expect(screen.getByRole("heading", { name }).closest('[data-slot="card"]')).toHaveClass("settings-card");
    }
    expect(screen.getByRole("button", { name: "Change photo" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Choose PDF" })).toBeDisabled();
    expect(screen.getByRole("textbox", { name: "First name" })).toHaveValue("Saved");
  });
  it("keeps profile and preference writes separate with the saved preference revision", async () => {
    open();
    fireEvent.change(screen.getByRole("textbox", { name: "First name" }), { target: { value: "Changed" } });
    fireEvent.click(screen.getByRole("button", { name: "Save profile" }));
    await waitFor(() => expect(persist).toHaveBeenCalledWith({ firstName: "Changed", surname: "Name" }));
    expect(savePreferences).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("radio", { name: "Data & Analytics" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Timezone for future activity" }), { target: { value: "Asia/Manila" } });
    fireEvent.click(screen.getByRole("button", { name: "Save preferences" }));
    await waitFor(() => expect(savePreferences).toHaveBeenCalledWith({ preferred_category_id: "data", timezone: "Asia/Manila", expected_version: 3, dismissed_guidance: [] }));
  });
  it("restores account cards without enabling features or losing hidden profile edits", () => {
    open();
    fireEvent.change(screen.getByRole("textbox", { name: "First name" }), { target: { value: "Unsaved" } });
    const nav = screen.getByRole("navigation", { name: "Settings sections" });
    fireEvent.click(within(nav).getByRole("link", { name: "Account and security" }));
    expect(screen.queryByRole("heading", { name: "Personal details" })).not.toBeInTheDocument();
    for (const name of ["Link Google", "Set up authenticator", "Delete account"]) expect(screen.getByRole("button", { name })).toBeDisabled();
    expect(within(nav).getByRole("link", { name: "Account and security" })).toHaveAttribute("aria-current", "page");
    fireEvent.click(within(nav).getByRole("link", { name: "Profile" }));
    expect(screen.getByRole("textbox", { name: "First name" })).toHaveValue("Unsaved");
  });
  it("blocks retake while editing and uses the existing versioned blank-draft command", async () => {
    open();
    fireEvent.change(screen.getByRole("textbox", { name: "First name" }), { target: { value: "Unsaved" } });
    expect(screen.getByRole("button", { name: "Retake Discovery" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Discard changes" }));
    fireEvent.click(screen.getByRole("button", { name: "Retake Discovery" }));
    await waitFor(() => expect(retake).toHaveBeenCalledWith({ source_session_id: "completed", expected_revision: 7 }));
    await waitFor(() => expect(screen.getByTestId("location")).toHaveTextContent("/discovery"));
  });
});
