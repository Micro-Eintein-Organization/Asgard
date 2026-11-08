import { Link } from "react-router";
import type { components } from "@/api/generated/schema";
import { SavedCareerEditor } from "./saved-career";
type Guide = components["schemas"]["Exploration"];
export function WorkExamples({ guide }: { guide: Guide }) {
  return (
    <div className="space-y-4">
      <p>{guide.purpose}</p>
      <dl className="space-y-2">
        {[
          ["What you work on", guide.work_on],
          ["What you produce", guide.produce],
          ["How you check it", guide.check],
        ].map(([title, value]) => (
          <div key={title}>
            <dt className="font-semibold">{title}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <h3 className="font-semibold">Examples of the work</h3>
      <ul className="space-y-3">
        {guide.activities.map((activity) => (
          <li key={activity.action}>
            <strong>{activity.action}</strong>
            <p>Example result: {activity.result}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
export function LearningExamples({
  guide,
  careerId,
}: {
  guide: Guide;
  careerId: string;
}) {
  return (
    <div className="space-y-4">
      {guide.learning_groups.map((group) => (
        <section key={group.title}>
          <h3 className="font-semibold">{group.title}</h3>
          <p>{group.explanation}</p>
          <Link
            className="underline"
            to={`/roadmaps/${careerId}?roadmap=${group.roadmap_id}&topic=${group.topic_id}`}
          >
            Start with {group.topic_title}
          </Link>
        </section>
      ))}
      <section className="rounded-xl border p-4 space-y-2">
        <h3 className="font-semibold">Try a beginner activity</h3>
        <p>{guide.starter.instructions}</p>
        <p>
          <strong>Check your result:</strong> {guide.starter.expected_result}
        </p>
        <Link
          className="underline"
          to={`/roadmaps/${careerId}?roadmap=${guide.starter.roadmap_id}&topic=${guide.starter.topic_id}`}
        >
          Open activity: {guide.starter.title}
        </Link>
        <p className="text-sm">
          This is an opportunity to explore, not a test of career suitability.
          Opening it does not record experience or completion.
        </p>
      </section>
    </div>
  );
}
export function CareerExploration({
  id,
  title,
  guide,
}: {
  id: string;
  title: string;
  guide: Guide;
}) {
  return (
    <section className="space-y-5">
      <h2>What would you do in this career?</h2>
      <WorkExamples guide={guide} />
      <h2>What could you try first?</h2>
      <LearningExamples guide={guide} careerId={id} />
      <details>
        <summary>Save this career or add a private note</summary>
        <SavedCareerEditor id={id} title={title} />
      </details>
      <details>
        <summary>Sources and limitations</summary>
        <p>{guide.source_scope}</p>
        <p>{guide.limitation}</p>
        <Link className="underline" to={`/careers/${id}/sources`}>
          View full sources
        </Link>
      </details>
    </section>
  );
}
