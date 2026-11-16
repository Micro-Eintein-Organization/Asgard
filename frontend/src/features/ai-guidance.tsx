import { useCurrentScreen } from "@/features/counselor-context";
import { useSavedProfile } from "@/features/profile/identity";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUp, X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { api } from "@/api/client";
import snowflake from "@/assets/Logo_Standalone_Snowflake.png";
import type { components } from "@/api/generated/schema";
import { useAuth } from "@/auth/context";
import { PageHeading } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCoreQuery } from "@/features/core/data";

type Answer = components["schemas"]["GuidanceAnswer"];
type Messages = { question: string; result: Answer; context?: string }[];
type Session = { messages: Messages; setMessages: React.Dispatch<React.SetStateAction<Messages>>;
  draft: string; setDraft: React.Dispatch<React.SetStateAction<string>>;
  web: boolean; setWeb: React.Dispatch<React.SetStateAction<boolean>>;
  usePage: boolean; setUsePage: React.Dispatch<React.SetStateAction<boolean>>;
  busy: boolean; setBusy: React.Dispatch<React.SetStateAction<boolean>>; controller: React.RefObject<AbortController> };
type Turn = components["schemas"]["GuidanceTurn"];

function useAvailability() {
  return useCoreQuery(["ai-guidance"], async (signal) => {
    const { data } = await api.GET("/api/v1/me/ai-guidance", { signal });
    return data?.available ?? false;
  });
}

type CounselorPageContext = string;

type CounselorLauncherProps = { query?: URLSearchParams; page?: CounselorPageContext };

export function CounselorLauncher(props: CounselorLauncherProps) {
  const availability = useAvailability();
  return availability.data === true ? <CounselorDialog {...props} /> : null;
}

function CounselorDialog({ query, page }: CounselorLauncherProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Messages>([]);
  const [draft, setDraft] = useState("");
  const [web, setWeb] = useState(false);
  const [usePage, setUsePage] = useState(true);
  const [busy, setBusy] = useState(false);
  const controller = useRef(new AbortController());
  useEffect(() => { controller.current = new AbortController(); return () => controller.current.abort(); }, []);


  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => {
      setOpen(nextOpen);
    }}>
      {createPortal(
        <DialogTrigger asChild>
          <button type="button" className="counselor-launcher" aria-label="Open AI Counselor" title="AI Counselor">
            <img src={snowflake} alt="" />
          </button>
        </DialogTrigger>,
        document.body,
      )}
      <DialogPortal>
        <div className="counselor-overlay" aria-hidden="true" />
        <DialogPrimitive.Content className="counselor-panel">
          <div className="counselor-panel-header">
            <div>
              <DialogTitle>AI Counselor</DialogTitle>
              <DialogDescription>
                Ask about careers or what to learn next.
              </DialogDescription>
            </div>
            <DialogClose asChild>
              <Button type="button" size="icon-lg" variant="ghost" className="min-h-11 min-w-11" aria-label="Close AI Counselor">
                <X aria-hidden="true" />
              </Button>
            </DialogClose>
          </div>
          <div className="counselor-panel-body">
            {(
              <CounselorConversation
                key={user.id}
                session={{ messages, setMessages, draft, setDraft, web, setWeb, usePage, setUsePage, busy, setBusy, controller }}
                params={query ?? new URLSearchParams()}
                page={page}
                onFollowSource={() => setOpen(false)}
              />
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}

function AnswerText({ text }: { text: string }) {
  return <div className="space-y-2">{text.split(/\n\s*\n/).map((block, index) => {
    const lines = block.split("\n");
    return lines.every(line => /^\s*(?:[-*]|\d+\.)\s+/.test(line))
      ? <ul key={index} className="list-disc pl-5">{lines.map((line, i) => <li key={i}>{line.replace(/^\s*(?:[-*]|\d+\.)\s+/, "")}</li>)}</ul>
      : <p key={index} className="whitespace-pre-wrap">{block}</p>;
  })}</div>;
}

function GuidanceAnswer({ data, onFollowSource }: { data: Answer; onFollowSource?: () => void }) {
  return (
    <div className="space-y-3">
      {data.answer && <AnswerText text={data.answer} />}
      {data.general_knowledge && <div><h3>General explanation</h3><p className="text-sm text-muted-foreground">From model knowledge; not verified against web sources.</p><AnswerText text={data.general_knowledge} /></div>}
      <GuidanceSources data={data} onFollowSource={onFollowSource} />
    </div>
  );
}

function GuidanceSources({ data, onFollowSource }: { data: Answer; onFollowSource?: () => void }) {
  return (
    <div className="space-y-2">
      {(["asgard", "web"] as const).map((kind) => {
        const sources = data.sources.filter((source) => source.kind === kind);
        if (!sources.length) return null;
        return (
          <div key={kind}>
            <h3>{kind === "asgard" ? "Asgard sources" : "Public web sources"}</h3>
            <ul>{sources.map((source) => (
              <li key={source.url + source.title}>
                {kind === "asgard"
                  ? <Link className="underline" to={source.url} onClick={(event) => {
                    if (!event.defaultPrevented && event.button === 0 &&
                        !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
                      onFollowSource?.();
                    }
                  }}>{source.title}</Link>
                  : <a className="underline" href={source.url} target="_blank" rel="noreferrer">{source.title}</a>}
              </li>
            ))}</ul>
          </div>
        );
      })}
      {data.web_unavailable && <p>Web search was unavailable. This answer uses available app context and model knowledge.</p>}
    </div>
  );
}

export function useComparisonInsight(left: string, right: string, enabled: boolean) {
  const availability = useAvailability();
  const { user } = useAuth();
  const insight = useQuery({
    queryKey: ["account", user?.id, "comparison-insight", left, right],
    enabled: enabled && !!user && availability.data === true,
    retry: false,
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: async ({ signal }) => {
      const { data } = await api.POST("/api/v1/me/ai-guidance/comparison", { body: { left, right }, signal });
      if (!data) throw new Error("Career insight is temporarily unavailable.");
      return data;
    },
  });
  return availability.data === true ? insight : null;
}

function ComparisonRows({ rows, careers }: {
  rows: components["schemas"]["ComparisonRow"][];
  careers: { id: string; title: string }[];
}) {
  return (
    <ul className="divide-y">
      {rows.map((row) => (
        <li key={row.label} className="grid gap-3 py-3 first:pt-0 last:pb-0 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,2fr)]">
          <h4 className="font-medium [overflow-wrap:anywhere]">{row.label}</h4>
          {careers.map((career) => (
            <div key={career.id} className="min-w-0 [overflow-wrap:anywhere]">
              <p className="text-sm font-medium">{career.title}</p>
              <p className="whitespace-pre-line">{row.by_career[career.id]}</p>
            </div>
          ))}
        </li>
      ))}
    </ul>
  );
}

export function ComparisonInsight({ insight, careers }: {
  insight: ReturnType<typeof useComparisonInsight>;
  careers: { id: string; title: string }[];
}) {
  if (!insight) return null;
  const comparison = insight.data;
  if (!comparison) {
    return (
      <div>
        {insight.isPending && <p role="status">Preparing the comparison…</p>}
        {insight.isError && (
          <p role="status">
            The comparison explanation is unavailable.{" "}
            <button type="button" className="underline" onClick={() => void insight.refetch()}>Try again</button>
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="min-w-0 gap-3 p-5">
        <h3 className="text-lg font-semibold">Work comparison</h3>
        <p className="max-w-[75ch] whitespace-pre-line leading-relaxed [overflow-wrap:anywhere]">{comparison.answer}</p>
        {comparison.work.length > 0 && <ComparisonRows rows={comparison.work} careers={careers} />}
        {comparison.handoff && (
          <div className="space-y-1 border-t pt-3">
            <h4 className="font-medium">How the work connects</h4>
            <p className="max-w-[75ch] whitespace-pre-line [overflow-wrap:anywhere]">{comparison.handoff}</p>
          </div>
        )}
      </Card>
      <Card className="gap-3 p-5">
        <h3 className="text-lg font-semibold">Shared skills</h3>
        {comparison.skills.length ? (
          <ComparisonRows rows={comparison.skills} careers={careers} />
        ) : <p>The available sources don’t establish a shared skill for this pair.</p>}
      </Card>
    </div>
  );
}

export function ComparisonCitations({ data }: { data?: Answer }) {
  if (!data || (!data.sources.length && !data.web_unavailable)) return null;
  return <GuidanceSources data={data} />;
}

function CounselorConversation({ params, page, onFollowSource, session }: {
  session?: Session;
  params: URLSearchParams;
  page?: CounselorPageContext;
  onFollowSource?: () => void;
}) {
  const savedProfile = useSavedProfile();
  const screen = useCurrentScreen();
  const [localUsePage, setLocalUsePage] = useState(true);
  const usePage = session?.usePage ?? localUsePage;
  const setUsePage = session?.setUsePage ?? setLocalUsePage;
  const inputId = useId();
  const input = useRef<HTMLTextAreaElement>(null);
  const transcript = useRef<HTMLDivElement>(null);
  const latest = useRef<HTMLElement>(null);
  const [localQuestion, setLocalQuestion] = useState("");
  const [localWeb, setLocalWeb] = useState(false);
  const question = session?.draft ?? localQuestion;
  const setQuestion = session?.setDraft ?? setLocalQuestion;
  const searchWeb = session?.web ?? localWeb;
  const setSearchWeb = session?.setWeb ?? setLocalWeb;
  const [localMessages, setLocalMessages] = useState<Messages>([]);
  const { messages, setMessages } = session ?? { messages: localMessages, setMessages: setLocalMessages };
  const contextLabel = !usePage ? "General questions" : screen?.label ?? (params.has("left") && params.has("right") ? "Selected career pair" : params.has("topic") ? "Selected roadmap topic" : params.has("roadmap") ? "Selected roadmap" : page?.split("/").filter(Boolean).join(" → ") || "Career exploration");
  const turn = useMutation({
    gcTime: 0,
    mutationFn: async (text: string) => {
      session?.setBusy(true);
      const history: Turn[] = messages.slice(-3).flatMap(({ question, result }) => [
        { role: "user", text: question }, { role: "assistant", text: [result.answer, result.general_knowledge].filter(Boolean).join("\n").slice(0, 1800) },
      ]);
      const { data } = await api.POST("/api/v1/me/ai-guidance/counselor", { body: {
        question: text, history, search_web: searchWeb,
        page_context: usePage ? { path: page ?? "/counselor", questionnaire_id: screen?.questionnaire_id, question_id: screen?.question_id, category_id: screen?.category_id, filter: screen?.filter?.slice(0,120), recommendation_run_id: screen?.recommendation_run_id } : null,
        career_ids: (usePage ? screen?.career_ids ?? [params.get("left"), params.get("right")].filter((id): id is string => !!id) : []),
        roadmap_id: usePage ? screen?.roadmap_id ?? params.get("roadmap") : null, topic_id: usePage ? screen?.topic_id ?? params.get("topic") : null,
      }, signal: session?.controller.current.signal });
      if (!data) throw new Error("The counselor couldn’t answer. Try again.");
      return { ...data, turnContext: contextLabel };
    },
    onSettled: () => session?.setBusy(false),
    onSuccess: (result, text) => {
      setMessages((previous) => [...previous, { question: text, result, context: result.turnContext }].slice(-12));
      setQuestion("");
    },
  });
  const readingOlder = useRef(false);
  useEffect(() => {
    if (!readingOlder.current && transcript.current && latest.current) {
      transcript.current.scrollTop = latest.current.offsetTop;
    }
  }, [messages]);
  const pending = turn.isPending || !!session?.busy;

  const prompts = page?.startsWith("/settings")
    ? ["What happens when I upload a resume?", "How do saved skills affect my career suggestions?"]
    : page === "/dashboard"
      ? ["What should I learn next?", "How does my learning streak work?"]
      : params.has("left") && params.has("right")
    ? ["What work do these careers share?", "Give me an exercise to try both roles."]
    : params.has("topic")
      ? ["Explain this topic with an example.", "What could I practise first?"]
      : params.has("roadmap")
        ? ["What should I learn first on this roadmap?", "What would a beginner project look like?"]
        : ["What should I learn next?", "Help me understand my career suggestions."];

  return (
    <div className="counselor-conversation">
      <div className="counselor-context"><span>Using: {contextLabel}</span><label><input type="checkbox" checked={usePage} onChange={event => setUsePage(event.target.checked)} /> Use page context</label><Button type="button" variant="ghost" disabled={pending} onClick={() => { setMessages([]); setQuestion(""); turn.reset(); }}>New conversation</Button></div>
      <div ref={transcript} onScroll={event => { const el = event.currentTarget; readingOlder.current = el.scrollHeight - el.scrollTop - el.clientHeight > 100; }} className="counselor-transcript" role="log" aria-label="Conversation">
        {messages.length === 0 && (
          <div className="counselor-welcome">
            <img src={snowflake} alt="" />
            <h2>What would you like to explore{savedProfile.data?.profile?.first_name ? `, ${savedProfile.data.profile.first_name}` : ""}?</h2>
            <p>Explore a career, understand a topic, or find a first step.</p>
          </div>
        )}
        {messages.map(({ question, result, context }, index) => (
          <section key={index} ref={index === messages.length - 1 ? latest : undefined} className="counselor-turn">
            <p className="counselor-question">{question}</p>
            {context && <p className="text-xs text-muted-foreground">Context: {context}</p>}
            <GuidanceAnswer data={result} onFollowSource={onFollowSource} />
          </section>
        ))}
        {pending && <p className="counselor-question">{turn.variables}</p>}
      </div>
      <form className="counselor-compose" onSubmit={(event) => {
        event.preventDefault();
        if (question.trim() && !pending) turn.mutate(question.trim());
      }}>
        {messages.length === 0 && !pending && (
          <div className="counselor-prompts" aria-label="Suggested questions">
            {prompts.map((prompt) => (
              <Button key={prompt} type="button" variant="secondary" onClick={() => {
                setQuestion(prompt);
                input.current?.focus();
              }}>{prompt}</Button>
            ))}
          </div>
        )}
        {pending && <p role="status">Preparing your answer…</p>}
        {turn.isError && <p role="alert">{turn.error.message}</p>}
        <div className="counselor-composer">
          <label className="sr-only" htmlFor={inputId}>Your question</label>
          <textarea ref={input} id={inputId} rows={2} placeholder="Ask Asgard"
            value={question} maxLength={1000} disabled={pending}
            onChange={(event) => setQuestion(event.target.value)} />
          <div className="counselor-composer-actions">
            <label><input type="checkbox" checked={searchWeb} disabled={pending}
              onChange={(event) => setSearchWeb(event.target.checked)} /> Include web sources</label>
            <Button type="submit" size="icon" className="min-h-11 min-w-11"
              aria-label="Send question" disabled={!question.trim() || pending}>
              <ArrowUp aria-hidden="true" />
            </Button>
          </div>
        </div>
        <p className="counselor-disclosure">Groq receives your question, recent turns, and relevant app context. Public search uses career names.</p>
      </form>
    </div>
  );
}

export function CounselorPage() {
  const availability = useAvailability();
  const { user } = useAuth();
  return (
    <section className="space-y-5">
      <PageHeading title="AI Counselor" description="Ask about career suggestions, tradeoffs, or what to learn next. Your conversation stays available while you explore Asgard." />
      <Link className="underline" to="/careers">Back to careers</Link>
      {availability.isPending ? <p role="status">Opening counselor…</p>
        : availability.data && user ? <p>Open the AI Counselor button to continue your conversation.</p>
          : <p>The counselor is currently unavailable.</p>}
    </section>
  );
}
