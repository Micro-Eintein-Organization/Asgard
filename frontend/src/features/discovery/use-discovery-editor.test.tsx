import { act, renderHook } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import type { components } from "@/api/generated/schema";
import { useDiscoveryEditor } from "./use-discovery-editor";

const mocks = vi.hoisted(() => ({ save: vi.fn(), complete: vi.fn(), navigate: vi.fn(), read: vi.fn() }));
vi.mock("@/auth/context", () => ({ useAuth: () => ({ user: { id: "owner" } }) }));
vi.mock("@/auth/transport", () => ({ isCurrentAccount: () => true }));
vi.mock("@/app/logout", () => ({ useLogoutGuard: vi.fn() }));
vi.mock("react-router", () => ({
  useNavigate: () => mocks.navigate,
  useBeforeUnload: vi.fn(),
  useBlocker: () => ({ state: "unblocked" }),
}));
vi.mock("@/features/core/data", () => ({
  coreApi: { saveDiscovery: "save", completeDiscovery: "complete", discovery: () => mocks.read() },
  useCoreMutation: (method: string) => ({ mutateAsync: method === "save" ? mocks.save : mocks.complete, reset: vi.fn() }),
}));

type Session = components["schemas"]["DiscoverySession"];
type Definition = components["schemas"]["Questionnaire"];
const question = (id: string): Definition["questions"][number] => ({ question_id: id, position: 0, prompt: id, helper: "", stage: "activities", interest_option_id: null, multiple: false, options: [
  { id: "a", label: "A", description: "", excludes: [], exclusive: false }, { id: "b", label: "B", description: "", excludes: [], exclusive: false },
] });
const definition: Definition = { id: "questionnaire", version: 4, questions: ["interests", "work", "clarify", "other"].map(question) };
function session(route = ["interests", "work"], answers: Record<string, string[]> = { interests: ["a"] }, next: string | null = "work", revision = 1) {
  return { id: "attempt", revision, active_question_ids: route, next_question_id: next,
    answers: Object.entries(answers).map(([question_id, option_ids]) => ({ question_id, option_ids })),
  } as Session;
}
beforeEach(() => { vi.clearAllMocks(); mocks.complete.mockResolvedValue({ id: "attempt" }); });

it.each([1, 2, 3, 4])("uses the saved route when the last visible answer activates a question (v%s)", async version => {
  const { result } = renderHook(() => useDiscoveryEditor(session(), { ...definition, version }));
  act(() => result.current.toggle("a"));
  expect(result.current.readyToComplete).toBe(false);
  mocks.save.mockResolvedValue(session(["interests", "work", "clarify"], { interests: ["a"], work: ["a"] }, "clarify", 2));
  await act(() => result.current.move(1));
  expect(result.current.question.question_id).toBe("clarify");
  expect(mocks.complete).not.toHaveBeenCalled();
  expect(mocks.navigate).not.toHaveBeenCalled();
});

it("finishes immediately when the saved answer leaves no unanswered question", async () => {
  const { result } = renderHook(() => useDiscoveryEditor(session(), definition));
  act(() => result.current.toggle("a"));
  mocks.save.mockResolvedValue(session(undefined, { interests: ["a"], work: ["a"] }, null, 2));
  await act(() => result.current.move(1));
  expect(mocks.complete).toHaveBeenCalledWith({ id: "attempt", body: { expected_revision: 2 } });
  expect(mocks.navigate).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ state: { generateFor: "attempt" } }));
});

it("offers completion on a fully saved resumed draft without saving or adding questions", async () => {
  const { result } = renderHook(() => useDiscoveryEditor(session(undefined, { interests: ["a"], work: ["a"] }, null), definition));
  expect(result.current.readyToComplete).toBe(true);
  await act(() => result.current.move(1));
  expect(mocks.save).not.toHaveBeenCalled();
  expect(mocks.complete).toHaveBeenCalledOnce();
});

it("retains input and position after a failed checkpoint or stale revision", async () => {
  const { result } = renderHook(() => useDiscoveryEditor(session(), definition));
  act(() => result.current.toggle("b"));
  mocks.save.mockRejectedValue(new Error("Reload saved answers"));
  await act(() => result.current.move(1));
  expect(result.current.question.question_id).toBe("work");
  expect(result.current.selected).toEqual(["b"]);
  expect(result.current.error).toBe("Reload saved answers");
  expect(result.current.busy).toBe(false);
  expect(mocks.complete).not.toHaveBeenCalled();
});

it("keeps completion failures on a saved draft and prevents duplicate submission", async () => {
  const { result } = renderHook(() => useDiscoveryEditor(session(undefined, { interests: ["a"], work: ["a"] }, null), definition));
  let reject!: (error: Error) => void;
  mocks.complete.mockReturnValue(new Promise((_, fail) => { reject = fail; }));
  let first!: Promise<void>;
  act(() => { first = result.current.move(1); });
  await act(() => result.current.move(1));
  expect(mocks.complete).toHaveBeenCalledOnce();
  await act(async () => { reject(new Error("Try again")); await first; });
  expect(result.current.readyToComplete).toBe(true);
  expect(result.current.error).toBe("Try again");
  expect(mocks.navigate).not.toHaveBeenCalled();
});

it("recomputes the route before saving dependent edits, preserving abandoned input locally", async () => {
  const initial = session(["interests", "work"], { interests: ["a"], work: ["a"] }, "work");
  const { result } = renderHook(() => useDiscoveryEditor(initial, { ...definition, questions: definition.questions.map(q => q.question_id === "work" ? { ...q, multiple: true } : q) }));
  act(() => result.current.toggle("a"));
  await act(() => result.current.move(-1));
  act(() => result.current.toggle("b"));
  mocks.save.mockResolvedValue(session(["interests", "other"], { interests: ["b"], work: ["b"] }, "other", 3));
  await act(() => result.current.move(1));
  expect(mocks.save).toHaveBeenCalledOnce();
  expect(mocks.save.mock.calls[0][0].body.answers).toEqual([{ question_id: "interests", option_ids: ["b"] }]);
  expect(result.current.question.question_id).toBe("other");
  expect(mocks.complete).not.toHaveBeenCalled();
});

it("blocks completion while experience requires an explicit refresh choice", async () => {
  const initial = session(undefined, { interests: ["a"], work: ["a"] }, null);
  initial.flow = { planner_version: "discovery-planner-4", phases: [], progress_by_question: {}, experience_changed: true, completed: false };
  const { result } = renderHook(() => useDiscoveryEditor(initial, definition));
  expect(result.current.readyToComplete).toBe(false);
  await act(() => result.current.move(1));
  expect(mocks.complete).not.toHaveBeenCalled();
  expect(result.current.error).toContain("experience changed");
});
