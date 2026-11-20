"""Authored scenarios and deterministic routes for Discovery v3."""

from itertools import combinations
from uuid import NAMESPACE_URL, uuid5

from app.modules.discovery.schemas import Questionnaire

ID = uuid5(NAMESPACE_URL, "asgard/content/questionnaire/3")

SCENARIOS = {
    "build": (
        "A useful app needs a new feature. What would you take on?",
        [
            ("web", "Make the screens work", "Build accessible pages and interactions."),
            ("backend", "Make the service reliable", "Design APIs, validation and data storage."),
            ("full_stack", "Connect the whole feature", "Work across screens and services."),
            (
                "mobile",
                "Build it for a phone",
                "Work with touch, device features and mobile screens.",
            ),
            (
                "games",
                "Turn it into a playable experience",
                "Build game rules, controls and feedback.",
            ),
            (
                "ai_features",
                "Add a model-powered feature",
                "Connect and evaluate an AI feature in a product.",
            ),
        ],
    ),
    "data": (
        "A team has data but no clear answer. What would you investigate?",
        [
            (
                "analyze",
                "Explain what changed",
                "Explore records, check patterns and explain a finding.",
            ),
            (
                "dashboards",
                "Make recurring decisions easier",
                "Design reports people return to regularly.",
            ),
            (
                "pipelines",
                "Make the data dependable",
                "Clean, organize and move data between systems.",
            ),
            (
                "statistics",
                "Test an explanation",
                "Use statistics to compare ideas and predictions.",
            ),
            (
                "train_models",
                "Improve a predictive model",
                "Train, evaluate and compare model behavior.",
            ),
        ],
    ),
    "security": (
        "A service may be vulnerable. Which investigation interests you?",
        [
            (
                "test_security",
                "Find how it could be exploited",
                "Test weaknesses with permission and report a safe reproduction.",
            ),
            (
                "respond",
                "Trace suspicious activity",
                "Investigate alerts and logs, then contain an incident.",
            ),
            (
                "cloud_security",
                "Prevent exposed cloud services",
                "Review access rules, identities and configurations.",
            ),
        ],
    ),
    "design": (
        "People struggle to use a product. Where would you start?",
        [
            (
                "layouts",
                "Make the interface clearer",
                "Improve visual hierarchy, layouts and controls.",
            ),
            (
                "research",
                "Understand where people struggle",
                "Observe tasks and test changes with users.",
            ),
        ],
    ),
    "infrastructure": (
        "A service keeps failing. What would you work on?",
        [
            (
                "networks",
                "Trace the connection",
                "Investigate how devices and services communicate.",
            ),
            ("servers", "Restore the machines", "Manage operating systems, accounts and services."),
            (
                "cloud",
                "Improve its cloud environment",
                "Set up reliable infrastructure and capacity.",
            ),
            ("releases", "Make releases safer", "Automate builds, checks and deployments."),
        ],
    ),
    "devices": (
        "A connected device behaves unexpectedly. What would you explore?",
        [
            ("circuits", "Test the electronics", "Measure signals and improve the circuit."),
            (
                "embedded",
                "Change the device software",
                "Program sensors, timing and hardware interactions.",
            ),
            (
                "linux",
                "Investigate the underlying system",
                "Explore Linux processes, drivers and system behavior.",
            ),
        ],
    ),
}


def definition(base):
    questions = [
        q.model_dump()
        for q in base.questions
        if q.question_id in ("experience_preference", "interests", "activities_general")
    ]
    questions[0]["helper"] = (
        "Choose experience to connect your background to the work you want to explore."
    )

    def add(key, prompt, helper, choices, limit=1):
        questions.append(
            dict(
                question_id=key,
                position=0,
                stage="activities",
                prompt=prompt,
                helper=helper,
                multiple=limit > 1,
                interest_option_id=None,
                max_selections=limit,
                kind=None,
                options=[
                    dict(id=k, label=label, description=d, exclusive=k == "unsure", excludes=[])
                    for k, label, d in choices
                ],
            )
        )

    uncertain = ("unsure", "I'm not sure yet", "Keep this open while I explore.")
    for field, (prompt, choices) in SCENARIOS.items():
        add(
            "activities_" + field,
            prompt,
            "Choose up to two tasks you would like to try.",
            choices + [uncertain],
            2,
        )
        for activity, _label, _description in choices:
            from app.modules.discovery.follow_ups import SITUATIONS

            situation, tasks = SITUATIONS[activity]
            add(
                "scenario_" + activity,
                situation,
                "Choose the part of this situation you would most like to work on.",
                tasks + [uncertain],
            )
    for left, right in combinations(SCENARIOS, 2):
        labels = {f: p for f, (p, _) in SCENARIOS.items()}
        add(
            "bridge_" + left + "_" + right,
            "Where would you like to begin?",
            "You chose two interests. Both stay available as we explore.",
            [
                (left, SCENARIOS[left][1][0][1], labels[left]),
                (right, SCENARIOS[right][1][0][1], labels[right]),
                (
                    "both",
                    "Explore the connection",
                    "Try work that brings these interests together.",
                ),
                uncertain,
            ],
        )
        if (left, right) == ("data", "security"):
            questions[-1]["prompt"] = (
                "Suspicious activity appears in a service's data. What would you investigate first?"
            )
            questions[-1]["options"][0].update(
                label="Explain the pattern in the data",
                description="Compare records and separate an unusual pattern from normal behavior.",
            )
            questions[-1]["options"][1].update(
                label="Find the security risk",
                description="Trace access, investigate alerts and test weaknesses with permission.",
            )
    for position, question in enumerate(questions):
        question["position"] = position
    return Questionnaire(id=ID, version=3, questions=questions)


def route(answers):
    fields = [field for field in SCENARIOS if field in answers.get("interests", [])]
    result = ["experience_preference", "interests"]
    if len(fields) == 2:
        result.append("bridge_" + "_".join(fields))
    if not fields:
        return result + ["activities_general"]
    for field in fields:
        result.append("activities_" + field)
        selected = answers.get("activities_" + field, [])
        result.extend("scenario_" + key for key, _, _ in SCENARIOS[field][1] if key in selected)
    return result[:10]
