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
    !(selected.length > 1 && options.some((item) => item.exclusive)) &&
    !options.some((item) => item.excludes.some((id) => selected.includes(id)))
  );
}

export function useDiscoveryEditor(initial: Session, definition: Definition) {
  const { user } = useAuth();
  const userId = user?.id ?? "";
  const navigate = useNavigate();
  const [saved, setSaved] = useState(initial);
  const [drafts, setDrafts] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(
      initial.answers.map((answer) => [answer.question_id, answer.option_ids]),
    ),
  );
  const [index, setIndex] = useState(() =>
    initial.source_session_id && initial.revision === 1
      ? 0
      : Math.max(
          0,
          initial.active_question_ids.indexOf(
            initial.next_question_id ?? "goals",
          ),
        ),
  );
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [busy, setBusy] = useState(false);
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
  const dirty = Object.entries(drafts).some(
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
    setDrafts((previous) => ({ ...previous, [question.question_id]: next }));
    setError("");
    setFeedback(
      !selected.includes(id) &&
        selected.length > 0 &&
        !selected.every((value) => next.includes(value))
        ? "Conflicting selections were cleared. Your changes are not saved yet."
        : "Your changes are not saved yet.",
    );
  }

  async function saveAll() {
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
    if (!same(drafts.interests, savedAnswers.interests)) {
      const first = definition.questions.find(
        (item) => item.question_id === "interests",
      )!;
      if (!valid(first, drafts.interests ?? []))
        throw new Error("Choose an interest or uncertainty before saving.");
      await save([{ question_id: "interests", option_ids: drafts.interests }]);
    }
    const baseline = Object.fromEntries(
      result.answers.map((answer) => [answer.question_id, answer.option_ids]),
    );
    const changes = Object.entries(drafts).filter(
      ([id, values]) => id !== "interests" && !same(values, baseline[id]),
    );
    if (changes.some(([id]) => !result.active_question_ids.includes(id)))
      throw new Error(
        "There are unsaved edits on an inactive question. Return to that branch to save them, or leave without saving.",
      );
    if (
      changes.some(
        ([id, values]) =>
          !valid(
            definition.questions.find((item) => item.question_id === id)!,
            values,
          ),
      )
    )
      throw new Error(
        "An edited question needs an answer or uncertainty. Return to it, or leave without saving.",
      );
    if (changes.length)
      await save(
        changes.map(([question_id, option_ids]) => ({
          question_id,
          option_ids,
        })),
      );
    setFeedback("Your active answers are saved.");
    return result;
  }

  async function saveCurrent() {
    if (same(selected, savedAnswers[question.question_id])) return saved;
    const result = await checkpoint.mutateAsync({
      id: saved.id,
      body: {
        expected_version: saved.revision,
        answers: [{ question_id: question.question_id, option_ids: selected }],
      },
    });
    if (!isCurrentAccount(userId))
      throw new Error("Your account changed. Reopen Discovery.");
    setSaved(result);
    setFeedback("This answer is saved.");
    return result;
  }

  async function perform(action: () => Promise<void>) {
    if (writing.current || !isCurrentAccount(userId)) return;
    writing.current = true;
    setBusy(true);
    setError("");
    try {
      await action();
    } catch (failure) {
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
      const finalStep =
        direction > 0 && index === saved.active_question_ids.length - 1;
      const result = finalStep ? await saveAll() : await saveCurrent();
      if (direction < 0 && index === 0) {
        const baseline = Object.fromEntries(
          result.answers.map((answer) => [
            answer.question_id,
            answer.option_ids,
          ]),
        );
        bypass.current = !Object.entries(drafts).some(
          ([id, value]) => !same(value, baseline[id]),
        );
        void navigate(appRoutes.welcome);
      } else if (
        direction > 0 &&
        index === result.active_question_ids.length - 1
      ) {
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
      } else setIndex(index + direction);
    });
  }

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
      setIndex(
        Math.max(
          0,
          current.draft.active_question_ids.indexOf(
            current.draft.next_question_id ?? "goals",
          ),
        ),
      );
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
    selected,
    index,
    total: saved.active_question_ids.length,
    saved,
    error,
    feedback,
    busy,
    dirty,
    toggle,
    move,
    skip,
    leaveWithoutSaving,
    reload,
    blocker,
    saveAndLeave,
  };
}
