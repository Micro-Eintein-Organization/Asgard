import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useBlocker, useBeforeUnload } from "react-router";
import { isCurrentAccount } from "@/auth/transport";
import { useLogoutGuard } from "@/app/logout";
import { readProfile, saveProfile } from "./api";

export function useProfileEditor(
  userId: string,
  extraDirty = false,
  extraPending = false,
) {
  const queryClient = useQueryClient();
  const key = ["profile", userId];
  const query = useQuery({
    queryKey: key,
    queryFn: ({ signal }) => readProfile(signal),
  });
  const form = useForm<{ firstName: string; surname: string }>({
    defaultValues: { firstName: "", surname: "" },
    mode: "onSubmit",
    shouldFocusError: false,
  });
  const {
    reset,
    formState: { errors, isDirty, submitCount },
  } = form;
  const mutation = useMutation({ mutationFn: saveProfile });
  const [feedback, setFeedback] = useState("");
  const [reloadOpen, setReloadOpen] = useState(false);
  const errorSummary = useRef<HTMLParagraphElement>(null);
  const lastSubmission = useRef(0);
  const writing = useRef(false);
  const baseVersion = useRef(0);
  const dirty = isDirty || extraDirty;

  useEffect(() => {
    if (submitCount === lastSubmission.current) return;
    lastSubmission.current = submitCount;
    if (errors.firstName || errors.surname) {
      const frame = requestAnimationFrame(() => errorSummary.current?.focus());
      return () => cancelAnimationFrame(frame);
    }
  }, [submitCount, errors.firstName, errors.surname]);
  useEffect(() => {
    if (query.data && !isDirty) {
      baseVersion.current = query.data.profile?.version ?? 0;
      reset({
        firstName: query.data.profile?.first_name ?? "",
        surname: query.data.profile?.surname ?? "",
      });
    }
  }, [query.data, reset, isDirty]);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isCurrentAccount(userId) &&
      (dirty || extraPending || writing.current || mutation.isPending) &&
      currentLocation.pathname !== nextLocation.pathname,
  );
  useLogoutGuard(() => {
    if (writing.current || mutation.isPending || extraPending) {
      window.alert("Wait for your save to finish before logging out.");
      return false;
    }
    return (
      !dirty ||
      window.confirm("Discard your unsaved changes and log out?")
    );
  });
  useBeforeUnload((event) => {
    if (dirty || extraPending || writing.current || mutation.isPending) {
      event.preventDefault();
      event.returnValue = "";
    }
  });

  function discard() {
    baseVersion.current = query.data?.profile?.version ?? 0;
    reset({
      firstName: query.data?.profile?.first_name ?? "",
      surname: query.data?.profile?.surname ?? "",
    });
    mutation.reset();
    setFeedback("");
  }
  async function reload() {
    setReloadOpen(false);
    const result = await query.refetch();
    if (!result.isSuccess || !isCurrentAccount(userId)) return;
    baseVersion.current = result.data.profile?.version ?? 0;
    reset({
      firstName: result.data.profile?.first_name ?? "",
      surname: result.data.profile?.surname ?? "",
    });
    mutation.reset();
    setFeedback("");
  }
  async function persist(values: { firstName: string; surname: string }) {
    if (!query.data || writing.current || !isCurrentAccount(userId))
      return false;
    writing.current = true;
    setFeedback("");
    try {
      const data = await mutation.mutateAsync({
        first_name: values.firstName,
        surname: values.surname,
        expected_version: baseVersion.current,
      });
      if (!isCurrentAccount(userId)) return false;
      baseVersion.current = data.profile?.version ?? 0;
      queryClient.setQueryData(key, data);
      void queryClient.invalidateQueries({ queryKey: ["account", userId] });
      reset({
        firstName: data.profile?.first_name ?? "",
        surname: data.profile?.surname ?? "",
      });
      setFeedback("Profile saved.");
      return true;
    } catch {
      return false;
    } finally {
      writing.current = false;
    }
  }
  return {
    form,
    query,
    mutation,
    feedback,
    reloadOpen,
    setReloadOpen,
    errorSummary,
    blocker,
    persist,
    discard,
    reload,
  };
}
