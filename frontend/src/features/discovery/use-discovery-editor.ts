import { useRef, useState } from "react";
import { useBeforeUnload, useBlocker, useNavigate } from "react-router";
import type { components } from "@/api/generated/schema";
import { useAuth } from "@/auth/context";
import { isCurrentAccount } from "@/auth/transport";
import { useLogoutGuard } from "@/app/logout";
import { coreApi, useCoreMutation } from "@/features/core/data";
import { appRoutes } from "@/lib/routes";

type Session = components["schemas"]["DiscoverySession"];
type Definition = components["schemas"]["Questionnaire"];
type Question = Definition["questions"][number];

function same(left: string[] = [], right: string[] = []) {
  return [...left].sort().join("|") === [...right].sort().join("|");
}

function valid(question: Question, selected: string[]) {
  const options = question.options.filter((item) => selected.includes(item.id));
  return (
    selected.length > 0 &&
    options.length === selected.length &&
    (question.multiple || selected.length === 1) &&
    selected.length <= (question.max_selections ?? Infinity) &&
    !(selected.length > 1 && options.some((item) => item.exclusive)) &&
    !options.some((item) => item.excludes.some((id) => selected.includes(id)))
  );
}

export function useDiscoveryEditor(initial: Session, definition: Definition, intakeDirty = false, intakeBusy = false) {
  const { user } = useAuth();
  const userId = user?.id ?? "";
  const navigate = useNavigate();
  const [saved, setSaved] = useState(initial);
  const [drafts, setDrafts] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(
      initial.answers.map((answer) => [answer.question_id, answer.option_ids]),
    ),
  );
  const [cursor, setCursor] = useState(() => initial.next_question_id ?? initial.active_question_ids[0]);
  const activeId = saved.active_question_ids.includes(cursor) ? cursor : saved.next_question_id ?? saved.active_question_ids[0];
  const index = saved.active_question_ids.indexOf(activeId);
  const setIndex = (next: number) => setCursor(saved.active_question_ids[next] ?? saved.active_question_ids[0]);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [busy, setBusy] = useState(false);
  const [pendingLabel, setPendingLabel] = useState("Saving answers...");
  const writing = useRef(false);
  const bypass = useRef(false);
  const checkpoint = useCoreMutation(coreApi.saveDiscovery);
  const completion = useCoreMutation(coreApi.completeDiscovery);
  const question = definition.questions.find(
    (item) => item.question_id === saved.active_question_ids[index],
  )!;
  const selected = drafts[question.question_id] ?? [];
  const savedAnswers = Object.fromEntries(
    saved.answers.map((answer) => [answer.question_id, answer.option_ids]),
  );
  const dirty = intakeDirty || Object.entries(drafts).some(
    ([id, value]) => !same(value, savedAnswers[id]),
  );
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      !bypass.current &&
      isCurrentAccount(userId) &&
      (dirty || writing.current || busy) &&
      currentLocation.pathname !== nextLocation.pathname,
  );
  useBeforeUnload((event) => {
    if (dirty || busy || writing.current) {
      event.preventDefault();
      event.returnValue = "";
    }
  });
  useLogoutGuard(() => {
    if (writing.current || busy) {
      window.alert(
        "Wait for your Discovery save to finish before logging out.",
      );
      return false;
    }
    return (
      !dirty ||
      window.confirm(
        "Discard unsaved Discovery edits and log out? Saved answers remain on your account.",
      )
    );
  });

  function toggle(id: string) {
    if (busy || writing.current) return;
    const option = question.options.find((item) => item.id === id)!;
    let next: string[];
    if (!question.multiple) next = [id];
    else if (selected.includes(id))
      next = selected.filter((value) => value !== id);
    else if (option.exclusive) next = [id];
    else
      next = [
        ...selected.filter((value) => {
          const old = question.options.find((item) => item.id === value)!;
          return (
            !old.exclusive &&
            !option.excludes.includes(value) &&
            !old.excludes.includes(id)
          );
        }),
        id,
      ];
    if (question.max_selections && next.length > question.max_selections) {
      setFeedback(`Choose up to ${question.max_selections} options. Deselect one to change your choices.`);
      return;
    }
    setDrafts((previous) => ({ ...previous, [question.question_id]: next }));
    setError("");
    setFeedback(
      question.multiple && !selected.includes(id) &&
        selected.length > 0 &&
        !selected.every((value) => next.includes(value))
        ? "Conflicting selections were cleared. Your changes are not saved yet."
        : "Your changes are not saved yet.",
    );
  }

  async function saveAll() {
    if (intakeDirty) throw new Error("Save your experience input or discard it before leaving Discovery.");
    let result = saved;
    const save = async (
      answers: { question_id: string; option_ids: string[] }[],
    ) => {
      result = await checkpoint.mutateAsync({
        id: result.id,
        body: { expected_version: result.revision, answers },
      });
      if (!isCurrentAccount(userId))
        throw new Error("Your account changed. Reopen Discovery.");
      setSaved(result);
    };
    // Checkpoint in route order: an earlier edit can retire later questions.
    const visited = new Set<string>();
    while (true) {
      const baseline = Object.fromEntries(
        result.answers.map((answer) => [answer.question_id, answer.option_ids]),
      );
      const id = result.active_question_ids.find(
        key => !visited.has(key) && drafts[key] !== undefined && !same(drafts[key], baseline[key]),
      );
      if (!id) break;
      const edited = definition.questions.find(item => item.question_id === id)!;
      if (!valid(edited, drafts[id]))
        throw new Error("An edited question needs an answer or uncertainty. Return to it, or leave without saving.");
      await save([{ question_id: id, option_ids: drafts[id] }]);
      visited.add(id);
    }
    setFeedback("Your active answers are saved.");
    return result;
  }

  async function saveCurrent(values = selected) {
    if (same(values, savedAnswers[question.question_id])) return saved;
    const result = await checkpoint.mutateAsync({
      id: saved.id,
      body: {
        expected_version: saved.revision,
        answers: [{ question_id: question.question_id, option_ids: values }],
      },
    });
    if (!isCurrentAccount(userId))
      throw new Error("Your account changed. Reopen Discovery.");
    setSaved(result);
    setFeedback("Your previous choices are saved.");
    return result;
  }

  async function perform(action: () => Promise<void>) {
    if (intakeBusy) return;
    if (writing.current || !isCurrentAccount(userId)) return;
    writing.current = true;
    setBusy(true);
    setPendingLabel("Saving answers...");
    setError("");
    try {
      await action();
    } catch (failure) {
      if ((failure as {body?: {code?: string}})?.body?.code === "experience_changed") {
        try {
          const current = await coreApi.discovery();
          if (isCurrentAccount(userId) && current.draft?.id === saved.id) setSaved(current.draft);
        } catch {
          // Keep local input and the original error if the recovery read also fails.
        }
      }
      if (isCurrentAccount(userId))
        setError(
          failure instanceof Error
            ? failure.message
            : "Could not save your answers.",
        );
    } finally {
      writing.current = false;
      setBusy(false);
    }
  }

  function move(direction: number) {
    return perform(async () => {
      if (direction < 0 && !valid(question, selected)) {
        if (index > 0) {
          setIndex(index - 1);
          setFeedback(
            "Your unfinished edit is kept in this tab and has not been saved.",
          );
        } else {
          writing.current = false;
          setBusy(false);
          void navigate(appRoutes.welcome);
        }
        return;
      }
      if (!valid(question, selected))
        throw new Error("Choose an answer or 'I'm not sure yet' to continue.");
      const result = direction > 0 ? await saveAll() : await saveCurrent();
      const savedIndex = result.active_question_ids.indexOf(question.question_id);
      if (direction < 0 && index === 0) {
        const baseline = Object.fromEntries(
          result.answers.map((answer) => [answer.question_id, answer.option_ids]),
        );
        bypass.current = !Object.entries(drafts).some(
          ([id, value]) => !same(value, baseline[id]),
        );
        void navigate(appRoutes.welcome);
      } else if (direction < 0) {
        setCursor(result.active_question_ids[Math.max(0, savedIndex - 1)]);
      } else if (result.flow?.experience_changed) {
        throw new Error("Your experience changed. Choose whether to use updated experience before continuing.");
      } else if (result.next_question_id) {
        setCursor(result.next_question_id);
      } else {
        setPendingLabel("Finishing Discovery...");
        const completed = await completion.mutateAsync({
          id: result.id,
          body: { expected_revision: result.revision },
        });
        if (!isCurrentAccount(userId)) return;
        bypass.current = true;
        void navigate(appRoutes.results, {
          replace: true,
          state: { generateFor: completed.id },
        });
      }
    });
  }

  const refreshExperience = () => perform(async () => {
    const result = await checkpoint.mutateAsync({ id: saved.id, body: {
      expected_version: saved.revision, refresh_experience: true,
      answers: [{question_id: "experience_preference", option_ids: ["use_experience"]}],
    }});
    if (!isCurrentAccount(userId)) return;
    setSaved(result);
    setCursor(result.next_question_id ?? result.active_question_ids[0]);
  });
  const startBasics = () => perform(async () => {
    const result = await checkpoint.mutateAsync({ id: saved.id, body: {
      expected_version: saved.revision,
      answers: [{question_id: "experience_preference", option_ids: ["basics"]}],
    }});
    if (!isCurrentAccount(userId)) return;
    setSaved(result);
    setDrafts(previous => ({...previous, experience_preference: ["basics"]}));
    setCursor(result.next_question_id ?? result.active_question_ids[0]);
  });
  const skipExperience = () =>
    perform(async () => {
      if (question.kind !== "experience_preference") return;
      const result = await saveCurrent(["unsure"]);
      setDrafts(previous => ({ ...previous, [question.question_id]: ["unsure"] }));
      setCursor(result.active_question_ids[result.active_question_ids.indexOf(question.question_id) + 1]);
    });

  const skip = () =>
    perform(async () => {
      await saveAll();
      bypass.current = true;
      void navigate(appRoutes.careers);
    });
  const leaveWithoutSaving = () => {
    if (!busy) void navigate(appRoutes.careers);
  };
  const reload = () =>
    perform(async () => {
      if (
        dirty &&
        !window.confirm(
          "Discard local edits and reload the saved Discovery answers?",
        )
      )
        return;
      const current = await coreApi.discovery();
      if (!isCurrentAccount(userId)) return;
      if (!current.draft || current.draft.id !== saved.id) {
        bypass.current = true;
        void navigate(appRoutes.results);
        return;
      }
      setSaved(current.draft);
      setDrafts(
        Object.fromEntries(
          current.draft.answers.map((answer) => [
            answer.question_id,
            answer.option_ids,
          ]),
        ),
      );
      setCursor(current.draft.next_question_id ?? current.draft.active_question_ids[0]);
      checkpoint.reset();
      completion.reset();
      setFeedback("Saved answers reloaded.");
    });
  const saveAndLeave = () =>
    perform(async () => {
      await saveAll();
      if (blocker.state === "blocked") blocker.proceed();
    });
  return {
    question,
    refreshExperience,
    startBasics,
    selected,
    index,
    total: saved.active_question_ids.length,
    saved,
    error,
    feedback,
    busy,
    pendingLabel,
    readyToComplete: !saved.next_question_id && !saved.flow?.experience_changed && !intakeDirty &&
      saved.active_question_ids.every(id => same(drafts[id] ?? savedAnswers[id], savedAnswers[id])),
    dirty,
    toggle,
    move,
    skip,
    skipExperience,
    leaveWithoutSaving,
    reload,
    blocker,
    saveAndLeave,
  };
}
