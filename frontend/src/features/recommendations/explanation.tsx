import { useMutation } from "@tanstack/react-query";
import { api } from "@/api/client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth/context";
import { isCurrentAccount } from "@/auth/transport";

export function ExplainRecommendation({ run, career, roadmap }: { run: string; career: string; roadmap: string }) {
  const { user } = useAuth();
  const explanation = useMutation({ mutationFn: async () => {
    const owner = user?.id;
    const { data } = await api.POST("/api/v1/me/ai-guidance/counselor", { body: {
      question: "Explain why this saved career and its authored roadmap were suggested. Connect the supplied answers and experience to the work, explain uncertainties and alternatives, and preserve the roadmap's authored order.",
      history: [], search_web: false, career_ids: [career], roadmap_id: roadmap,
      page_context: { path: "/recommendations", recommendation_run_id: run },
    } });
    if (!owner || !isCurrentAccount(owner)) throw new Error("Your account changed. Reopen suggestions.");
    if (!data) throw new Error("The explanation is unavailable. Your saved suggestions remain available.");
    return data;
  } });
  return <div className="space-y-3">
    <Button variant="outline" disabled={explanation.isPending} onClick={() => explanation.mutate()}>
      {explanation.isPending ? "Explaining…" : "Explain in more detail"}
    </Button>
    {explanation.error && <p role="alert">{explanation.error.message}</p>}
    {explanation.data && <p className="whitespace-pre-line">{explanation.data.answer}</p>}
  </div>;
}
