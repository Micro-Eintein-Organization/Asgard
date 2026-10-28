import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { appRoutes } from "@/lib/routes";
import { StatePanel } from "@/components/shared";
import { coreApi, useCoreMutation, useCoreQuery } from "@/features/core/data";
import { readProfile } from "@/features/profile/api";

export function DashboardScreen() {
  const navigate = useNavigate();
  const dashboard = useCoreQuery(["dashboard"], coreApi.dashboard);
  const preferences = useCoreQuery(["preferences"], coreApi.preferences);
  const profile = useCoreQuery(["profile-context"], () => readProfile());
  const roadmapId = dashboard.data?.learning_state.current_roadmap_id ?? "";
  const activeRoadmapId = dashboard.data?.active_topic?.roadmap_id ?? "";
  const activeRoadmap = useCoreQuery(
    ["roadmap", activeRoadmapId],
    () => coreApi.roadmap(activeRoadmapId),
    !!activeRoadmapId,
  );
  const roadmap = useCoreQuery(
    ["roadmap", roadmapId],
    () => coreApi.roadmap(roadmapId),
    !!roadmapId,
  );
  const careerId = roadmap.data?.career_id ?? "";
  const career = useCoreQuery(
    ["career", careerId],
    () => coreApi.career(careerId),
    !!careerId,
  );
  const progress = useCoreQuery(
    ["progress", roadmapId],
    () => coreApi.progress(roadmapId),
    !!roadmapId,
  );
  const dismiss = useCoreMutation(coreApi.savePreferences);
  const [monthOffset, setMonthOffset] = useState(0);
  const parts = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "2-digit",
    timeZone: preferences.data?.timezone ?? "UTC",
  }).formatToParts(new Date());
  const calendar = new Date(
    Date.UTC(
      Number(parts.find((part) => part.type === "year")?.value),
      Number(parts.find((part) => part.type === "month")?.value) -
        1 +
        monthOffset,
      1,
    ),
  );
  const month = calendar.toISOString().slice(0, 7);
  const activity = useCoreQuery(["activity", month], () =>
    coreApi.activity(month),
  );
  const topic = (id: string) =>
    `${appRoutes.roadmap(careerId)}?roadmap=${roadmapId}&topic=${id}`;
  const [openSections, setOpenSections] = useState({
    notStarted: true,
    inProgress: true,
    complete: true,
  });

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const error =
    dashboard.error ??
    preferences.error ??
    profile.error ??
    activity.error ??
    roadmap.error ??
    career.error ??
    progress.error ??
    activeRoadmap.error;
  if (error)
    return (
      <StatePanel
        kind="error"
        title="Dashboard unavailable"
        action={
          <button
            onClick={() => {
              void dashboard.refetch();
              void preferences.refetch();
              void profile.refetch();
              void activity.refetch();
              if (roadmapId) {
                void roadmap.refetch();
                void progress.refetch();
              }
              if (careerId) void career.refetch();
              if (activeRoadmapId) void activeRoadmap.refetch();
            }}
          >
            Try again
          </button>
        }
      >
        {error.message}
      </StatePanel>
    );
  if (
    !dashboard.data ||
    !preferences.data ||
    !profile.data ||
    !activity.data ||
    (roadmapId && (!roadmap.data || !progress.data || !career.data))
  )
    return (
      <StatePanel kind="loading" title="Loading your Dashboard">
        Reading your saved learning state.
      </StatePanel>
    );
  const overview = dashboard.data;
  const savedPreferences = preferences.data;
  const savedActivity = activity.data;
  const savedProfile = profile.data;
  const allTopics =
    roadmap.data?.milestones
      .filter((item) => !item.retired_at)
      .flatMap((milestone) =>
        milestone.topics.filter((item) => !item.retired_at),
      ) ?? [];
  const topicStates = progress.data ?? [];
  const nextTopic = overview.progress?.next_topic_ids[0];
  const milestone = roadmap.data?.milestones.find(
    (item) => item.id === overview.core_milestone_id,
  );
  const milestoneSummary = overview.progress?.milestones.find(
    (item) => item.milestone_id === milestone?.id,
  );
  const guidance = overview.guidance_id;
  const actionPath =
    guidance === "basic_profile"
      ? appRoutes.profile
      : guidance === "resume_discovery" || guidance === "start_discovery"
        ? appRoutes.discovery
        : appRoutes.careers;
  const days = new Date(
    Date.UTC(calendar.getUTCFullYear(), calendar.getUTCMonth() + 1, 0),
  ).getUTCDate();

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8 bg-white text-gray-900 min-h-screen">
      <h1 className="sr-only">Dashboard</h1>
      <div className="flex flex-wrap gap-4 text-sm">
        <Link to={appRoutes.results} className="underline">
          View saved career suggestions
        </Link>
        <Link to={appRoutes.discovery} className="underline">
          {overview.discovery_draft_id
            ? "Resume Discovery"
            : "Guided Discovery"}
        </Link>
      </div>
      {overview.active_topic && activeRoadmap.data && (
        <p className="border rounded-xl p-4 text-sm">
          You have a topic marked Learning.{" "}
          <Link
            className="underline"
            to={
              appRoutes.roadmap(activeRoadmap.data.career_id) +
              "?roadmap=" +
              activeRoadmapId +
              "&topic=" +
              overview.active_topic.topic_id
            }
          >
            Continue or resolve this topic
          </Link>{" "}
          before switching focus.
        </p>
      )}
      {/* Main Grid: Left Column (Role + Calendar) & Right Column (Milestone Banner + Foundations) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Selected Role Card */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 space-y-3 relative">
            <div className="flex justify-between items-center text-xs font-semibold text-gray-500">
              <span>Role</span>
              <button
                onClick={() => void navigate(appRoutes.careers)}
                className="hover:text-black flex items-center space-x-1 cursor-pointer"
              >
                <span>edit</span>
                <span>✏️</span>
              </button>
            </div>
            <div className="border border-gray-300 rounded-xl p-3 bg-white text-center font-bold text-lg shadow-2xs">
              {career.data?.title ?? "No roadmap selected"}
            </div>
            <p className="text-xs text-gray-500 italic text-center leading-relaxed">
              {roadmap.data
                ? "Your saved learning focus."
                : "Browse careers and explicitly choose a roadmap to begin."}
            </p>
          </div>

          {/* Activity / Streak Calendar Widget */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm">
                {calendar.toLocaleDateString("en", {
                  month: "long",
                  year: "numeric",
                  timeZone: "UTC",
                })}
              </h3>
              <span className="bg-white border border-gray-200 px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 shadow-2xs">
                <span>{savedActivity.streak_days}</span>
                <span>🔥</span>
              </span>
            </div>

            <div className="flex justify-between text-xs">
              <button onClick={() => setMonthOffset(monthOffset - 1)}>
                Previous month
              </button>
              <button
                disabled={monthOffset === 0}
                onClick={() => setMonthOffset(monthOffset + 1)}
              >
                Next month
              </button>
            </div>
            {/* Days Header */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-gray-400">
              <span>S</span>
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>TH</span>
              <span>F</span>
              <span>S</span>
            </div>

            {/* Calendar Heatmap Grid */}
            <div className="grid grid-cols-7 gap-1.5 pt-1">
              {Array.from(
                { length: calendar.getUTCDay() + days },
                (_, index) => {
                  const day = index - calendar.getUTCDay() + 1;
                  const date = month + "-" + String(day).padStart(2, "0");
                  const count =
                    savedActivity.days.find(
                      (entry) => entry.local_date === date,
                    )?.done_count ?? 0;
                  return (
                    <div
                      key={index}
                      title={
                        day > 0 ? date + ": " + count + " Done" : undefined
                      }
                      className={
                        day < 1
                          ? "h-6"
                          : "h-6 rounded-md text-center text-xs " +
                            (count > 1
                              ? "bg-orange-500"
                              : count > 0
                                ? "bg-orange-200"
                                : "bg-gray-200")
                      }
                    >
                      {day > 0 ? day : ""}
                    </div>
                  );
                },
              )}
            </div>
          </div>

          {/* Profile Enrichment Callout & Banner */}
          <div className="relative pt-2">
            {!savedProfile.profile?.first_name && (
              <button
                onClick={() => void navigate(appRoutes.profile)}
                className="w-full bg-black text-white font-semibold py-3 px-6 rounded-full text-xs hover:bg-gray-800 transition-colors shadow-md cursor-pointer"
              >
                Profile Enrichment
              </button>
            )}

            {guidance && (
              <div className="mt-3 bg-blue-600 text-white p-4 rounded-xl text-xs relative shadow-lg space-y-2">
                <div className="absolute -top-2 left-8 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-blue-600" />
                <div className="flex justify-between items-start">
                  <p className="pr-4 leading-relaxed font-medium">
                    {guidance === "resume_discovery"
                      ? "Review your saved Discovery draft."
                      : guidance === "start_discovery"
                        ? "Explore your interests with Guided Discovery."
                        : "Add your name in Settings. This is optional."}{" "}
                    <Link to={actionPath} className="underline">
                      Open
                    </Link>
                  </p>
                  <button
                    aria-label="Dismiss profile guidance"
                    disabled={dismiss.isPending}
                    onClick={() =>
                      dismiss.mutate({
                        expected_version: savedPreferences.version,
                        preferred_category_id:
                          savedPreferences.preferred_category_id,
                        timezone: savedPreferences.timezone,
                        dismissed_guidance: [
                          ...savedPreferences.dismissed_guidance,
                          guidance,
                        ],
                      })
                    }
                    className="text-white opacity-70 hover:opacity-100 text-xs font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
            {dismiss.error && (
              <p role="alert" className="field-error">
                {dismiss.error.message}
              </p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Milestone Hero Banner */}
          <div className="bg-gradient-to-r from-gray-900 to-black text-white rounded-2xl p-8 space-y-6 shadow-md relative overflow-hidden">
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold tracking-tight">
                {milestone?.title ??
                  (roadmapId
                    ? "Your learning progress"
                    : "Choose your first roadmap")}
              </h2>
              <button
                onClick={() =>
                  void navigate(
                    nextTopic
                      ? topic(nextTopic)
                      : careerId
                        ? appRoutes.roadmap(careerId)
                        : appRoutes.careers,
                  )
                }
                className="text-xs text-gray-300 hover:text-white font-medium cursor-pointer"
              >
                continue &gt;
              </button>
            </div>

            <div className="space-y-2 pt-4">
              <div className="flex justify-end text-xs font-bold text-gray-300">
                <span>
                  {milestoneSummary?.percentage == null
                    ? "No milestone percentage yet"
                    : milestoneSummary.percentage + "%"}
                </span>
              </div>
              <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: (milestoneSummary?.percentage ?? 0) + "%" }}
                />
              </div>
            </div>
          </div>

          {/* Software Development Foundations List */}
          <div className="space-y-6">
            <h3 className="font-bold text-lg tracking-tight">
              {roadmap.data?.title ?? "Your learning topics"}
            </h3>

            {/* Not Started Section */}
            <div className="space-y-3">
              <button
                onClick={() => toggleSection("notStarted")}
                aria-expanded={openSections.notStarted}
                className="flex items-center space-x-2 text-xs font-bold text-gray-700 hover:text-black cursor-pointer"
              >
                <span>Not Started</span>
                <span
                  className={`transform transition-transform ${openSections.notStarted ? "rotate-180" : ""}`}
                >
                  ▼
                </span>
              </button>
              <div className="h-px bg-gray-200" />

              {openSections.notStarted && (
                <div className="pl-4 space-y-3 pt-1">
                  {allTopics
                    .filter(
                      (item) =>
                        (topicStates.find((entry) => entry.topic_id === item.id)
                          ?.status ?? "not_started") === "not_started",
                    )
                    .map((item) => (
                      <Link
                        key={item.id}
                        to={topic(item.id)}
                        className="flex items-center space-x-3 text-xs font-semibold text-gray-800 hover:text-emerald-600"
                      >
                        <span className="w-4 h-4 border-2 border-gray-400 rounded-full flex-none" />
                        <span>{item.title}</span>
                      </Link>
                    ))}
                </div>
              )}
            </div>

            {/* In-Progress Section */}
            <div className="space-y-3">
              <button
                onClick={() => toggleSection("inProgress")}
                aria-expanded={openSections.inProgress}
                className="flex items-center space-x-2 text-xs font-bold text-gray-700 hover:text-black cursor-pointer"
              >
                <span>In-Progress</span>
                <span
                  className={`transform transition-transform ${openSections.inProgress ? "rotate-180" : ""}`}
                >
                  ▼
                </span>
              </button>
              <div className="h-px bg-gray-200" />

              {openSections.inProgress && (
                <div className="pl-4 space-y-3 pt-1">
                  {allTopics
                    .filter(
                      (item) =>
                        (topicStates.find((entry) => entry.topic_id === item.id)
                          ?.status ?? "not_started") === "learning",
                    )
                    .map((item) => (
                      <Link
                        key={item.id}
                        to={topic(item.id)}
                        className="flex items-center space-x-3 text-xs font-semibold text-gray-800 hover:text-emerald-600"
                      >
                        <span className="w-4 h-4 border-2 border-gray-400 rounded-full flex-none" />
                        <span>{item.title}</span>
                      </Link>
                    ))}
                </div>
              )}
            </div>

            {/* Complete Section */}
            <div className="space-y-3">
              <button
                onClick={() => toggleSection("complete")}
                aria-expanded={openSections.complete}
                className="flex items-center space-x-2 text-xs font-bold text-gray-700 hover:text-black cursor-pointer"
              >
                <span>Complete</span>
                <span
                  className={`transform transition-transform ${openSections.complete ? "rotate-180" : ""}`}
                >
                  ▼
                </span>
              </button>
              <div className="h-px bg-gray-200" />

              {openSections.complete && (
                <div className="pl-4 space-y-3 pt-1">
                  {allTopics
                    .filter(
                      (item) =>
                        (topicStates.find((entry) => entry.topic_id === item.id)
                          ?.status ?? "not_started") === "done",
                    )
                    .map((item) => (
                      <Link
                        key={item.id}
                        to={topic(item.id)}
                        className="flex items-center space-x-3 text-xs font-semibold text-gray-800 hover:text-emerald-600"
                      >
                        <span className="w-4 h-4 border-2 border-gray-400 rounded-full flex-none" />
                        <span>{item.title}</span>
                      </Link>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
