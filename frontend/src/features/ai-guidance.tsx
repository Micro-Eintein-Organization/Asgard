import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUp, X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router";
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
type Turn = components["schemas"]["GuidanceTurn"];

function useAvailability() {
  return useCoreQuery(["ai-guidance"], async (signal) => {
    const { data } = await api.GET("/api/v1/me/ai-guidance", { signal });
    return data?.available ?? false;
  });
}

type CounselorPageContext = "Dashboard" | "Settings";

type CounselorLauncherProps = { query?: URLSearchParams; page?: CounselorPageContext };

export function CounselorLauncher(props: CounselorLauncherProps) {
  const availability = useAvailability();
  return availability.data === true ? <CounselorDialog {...props} /> : null;
}

function CounselorDialog({ query, page }: CounselorLauncherProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [context, setContext] = useState(() => new URLSearchParams());

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => {
      if (nextOpen) setContext(new URLSearchParams(query));
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
            {open && (
              <CounselorConversation
                key={user.id}
                params={context}
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

function GuidanceAnswer({ data, onFollowSource }: { data: Answer; onFollowSource?: () => void }) {
  return (
    <div className="space-y-3">
      <p className="whitespace-pre-wrap">{data.answer}</p>
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
      {data.web_unavailable && <p>Public web sources were unavailable for this answer.</p>}
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

function CounselorConversation({ params, page, onFollowSource }: {
  params: URLSearchParams;
  page?: CounselorPageContext;
  onFollowSource?: () => void;
}) {
  const inputId = useId();
  const input = useRef<HTMLTextAreaElement>(null);
  const transcript = useRef<HTMLDivElement>(null);
  const latest = useRef<HTMLElement>(null);
  const [question, setQuestion] = useState("");
  const [searchWeb, setSearchWeb] = useState(false);
  const [messages, setMessages] = useState<{ question: string; result: Answer }[]>([]);
  const pageIntro = page ? `I’m on the Asgard ${page} page. ` : "";
  const turn = useMutation({
    gcTime: 0,
    mutationFn: async (text: string) => {
      const history: Turn[] = messages.slice(-3).flatMap(({ question, result }) => [
        { role: "user", text: question }, { role: "assistant", text: result.answer.slice(0, 1800) },
      ]);
      const { data } = await api.POST("/api/v1/me/ai-guidance/counselor", { body: {
        question: pageIntro + text, history, search_web: searchWeb,
        career_ids: [params.get("left"), params.get("right")].filter((id): id is string => !!id),
        roadmap_id: params.get("roadmap"), topic_id: params.get("topic"),
      } });
      if (!data) throw new Error("The counselor couldn’t answer. Try again.");
      return data;
    },
    onSuccess: (result, text) => {
      setMessages((previous) => [...previous, { question: text, result }].slice(-12));
      setQuestion("");
    },
  });
  useEffect(() => {
    if (transcript.current && latest.current) {
      transcript.current.scrollTop = latest.current.offsetTop;
    }
  }, [messages]);

  const prompts = page === "Settings"
    ? ["What happens when I upload a resume?", "How do saved skills affect my career suggestions?"]
    : page === "Dashboard"
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
      <div ref={transcript} className="counselor-transcript" role="log" aria-label="Conversation">
        {messages.length === 0 && (
          <div className="counselor-welcome">
            <img src={snowflake} alt="" />
            <h2>What would you like to learn?</h2>
            <p>Explore a career, understand a topic, or find a first step.</p>
          </div>
        )}
        {messages.map(({ question, result }, index) => (
          <section key={index} ref={index === messages.length - 1 ? latest : undefined} className="counselor-turn">
            <h2>{question}</h2>
            <GuidanceAnswer data={result} onFollowSource={onFollowSource} />
          </section>
        ))}
      </div>
      <form className="counselor-compose" onSubmit={(event) => {
        event.preventDefault();
        if (question.trim() && !turn.isPending) turn.mutate(question.trim());
      }}>
        {messages.length === 0 && !turn.isPending && (
          <div className="counselor-prompts" aria-label="Suggested questions">
            {prompts.map((prompt) => (
              <Button key={prompt} type="button" variant="secondary" onClick={() => {
                setQuestion(prompt);
                input.current?.focus();
              }}>{prompt}</Button>
            ))}
          </div>
        )}
        {turn.isPending && <p role="status">Preparing your answer…</p>}
        {turn.isError && <p role="alert">{turn.error.message}</p>}
        <div className="counselor-composer">
          <label className="sr-only" htmlFor={inputId}>Your question</label>
          <textarea ref={input} id={inputId} rows={2} placeholder="Ask Asgard"
            value={question} maxLength={1000 - pageIntro.length} disabled={turn.isPending}
            onChange={(event) => setQuestion(event.target.value)} />
          <div className="counselor-composer-actions">
            <label><input type="checkbox" checked={searchWeb} disabled={turn.isPending}
              onChange={(event) => setSearchWeb(event.target.checked)} /> Include web sources</label>
            <Button type="submit" size="icon" className="min-h-11 min-w-11"
              aria-label="Send question" disabled={!question.trim() || turn.isPending}>
              <ArrowUp aria-hidden="true" />
            </Button>
          </div>
        </div>
        <p className="counselor-disclosure">Groq receives your question, recent turns, and relevant career or next-step context. Public search uses career names.</p>
      </form>
    </div>
  );
}

export function CounselorPage() {
  const availability = useAvailability();
  const { user } = useAuth();
  const [params] = useSearchParams();
  return (
    <section className="space-y-5">
      <PageHeading title="AI Counselor" description="Ask about career suggestions, tradeoffs, or what to learn next. This conversation clears when you leave." />
      <Link className="underline" to="/careers">Back to careers</Link>
      {availability.isPending ? <p role="status">Opening counselor…</p>
        : availability.data && user ? <CounselorConversation key={user.id + params.toString()} params={params} />
          : <p>The counselor is currently unavailable.</p>}
    </section>
  );
}
