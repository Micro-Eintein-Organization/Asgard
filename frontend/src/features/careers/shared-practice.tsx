import { Link } from "react-router";
import type { components } from "@/api/generated/schema";
import { Card } from "@/components/ui/card";
import data from "./shared-practice-data.json";

type Example = { skillId: string; topicId: string; example: string };
const themes: {
  title: string;
  careers: Record<string, Example | undefined>;
}[] = data;

export function SharedPractice({
  careers,
}: {
  careers: components["schemas"]["CareerColumn"][];
}) {
  const shared = themes.flatMap((theme) => {
    const examples = careers.flatMap(({ career, experience }) => {
      const entry = theme.careers[career.id];
      if (!entry) return [];
      const topic = experience
        .find((skill) => skill.id === entry.skillId)
        ?.topics.find(
          (topic) =>
            topic.topic_id === entry.topicId &&
            career.roadmap_ids.includes(topic.roadmap_id),
        );
      return topic ? [{ career, topic, example: entry.example }] : [];
    });
    return examples.length === 2 ? [{ title: theme.title, examples }] : [];
  });
  return (
    <details>
      <summary className="cursor-pointer font-medium">Practice examples for both careers</summary>
      {shared.length ? (
        <div className="mt-3 space-y-3">
          {shared.map(({ title, examples }) => (
            <Card key={title} className="p-5 space-y-3">
              <h3 className="font-semibold">{title}</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {examples.map(({ career, topic, example }) => (
                  <div key={career.id} className="space-y-1">
                    <h4 className="font-semibold">{career.title}</h4>
                    <p>{example}</p>
                    <Link
                      className="underline"
                      to={`/roadmaps/${career.id}?${new URLSearchParams({ roadmap: topic.roadmap_id, topic: topic.topic_id })}`}
                    >
                      {topic.title}
                    </Link>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <p className="mt-2">No shared practice has been mapped for this pair yet.</p>
      )}
    </details>
  );
}
