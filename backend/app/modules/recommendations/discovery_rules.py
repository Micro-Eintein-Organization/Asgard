"""Versioned rules for completed Discovery v2 answers."""

from itertools import zip_longest

from app.modules.discovery.definition import FIELDS
from app.modules.recommendations.schemas import UntrustedRecommendationItem

RULE_VERSION = "discovery-rules-2"
RESULT_SCHEMA = "1"
ACTIVITY_CAREERS = {
    "web": "frontend",
    "backend": "backend-developer",
    "full_stack": "full-stack-developer",
    "mobile": "mobile-developer",
    "games": "game-developer",
    "ai_features": "ai-engineer",
    "analyze": "data-analyst",
    "dashboards": "bi-analyst",
    "pipelines": "data-engineer",
    "statistics": "data-scientist",
    "train_models": "machine-learning-engineer",
    "layouts": "ui-designer",
    "research": "ux-designer",
    "test_security": "penetration-tester",
    "respond": "cybersecurity-analyst",
    "cloud_security": "cloud-security-engineer",
    "networks": "network-engineer",
    "servers": "system-administrator",
    "cloud": "cloud-engineer",
    "releases": "devops-engineer",
    "circuits": "hardware-engineer",
    "embedded": "embedded-systems-developer",
    "linux": "linux-systems-engineer",
}
RELATED_CAREERS = {
    "web": (
        (
            "full-stack-developer",
            "Full stack work also builds web interfaces and connects them to services.",
        ),
        (
            "ui-designer",
            "UI design explores the layouts and controls that appear on interactive pages.",
        ),
    ),
    "backend": (
        ("full-stack-developer", "Full stack work includes building the server side of an app."),
        ("data-engineer", "Data engineering also builds reliable ways to store and move data."),
    ),
    "full_stack": (
        ("frontend", "Frontend work goes deeper into the screens people use."),
        (
            "backend-developer",
            "Backend work goes deeper into the services and data behind those screens.",
        ),
    ),
    "mobile": (
        ("frontend", "Frontend work also builds responsive interfaces people interact with."),
        ("backend-developer", "Backend work builds services that mobile apps can call."),
    ),
    "games": (
        ("frontend", "Frontend work also involves building visuals that respond to user input."),
        ("mobile-developer", "Mobile development also uses touch input and interactive screens."),
    ),
    "ai_features": (
        (
            "machine-learning-engineer",
            "Machine learning work explores how models are trained and evaluated.",
        ),
        (
            "backend-developer",
            "Backend work builds the APIs and services that can support AI features.",
        ),
    ),
    "analyze": (
        (
            "bi-analyst",
            "Business intelligence turns analysis into reports people use to make decisions.",
        ),
        (
            "data-scientist",
            "Data science extends data investigation into statistics and predictions.",
        ),
    ),
    "dashboards": (
        ("data-analyst", "Data analysis also uses charts to explain findings."),
        ("data-engineer", "Data engineering prepares the reliable data that dashboards depend on."),
    ),
    "pipelines": (
        (
            "backend-developer",
            "Backend work also designs data storage and moves information between services.",
        ),
        ("bi-analyst", "Business intelligence models prepared data for reporting."),
    ),
    "statistics": (
        (
            "machine-learning-engineer",
            "Machine learning also tests how well predictive models perform.",
        ),
        ("data-analyst", "Data analysis also uses evidence to test ideas and explain findings."),
    ),
    "train_models": (
        ("data-scientist", "Data science also trains and evaluates predictive models."),
        ("ai-engineer", "AI engineering explores how to use and evaluate models in products."),
    ),
    "layouts": (
        ("ux-designer", "UX design tests whether layouts and flows help people accomplish tasks."),
        ("frontend", "Frontend work turns screen layouts into working pages and controls."),
    ),
    "research": (
        (
            "ui-designer",
            "UI design turns findings about how people use a product into clearer screens.",
        ),
    ),
    "test_security": (
        (
            "cybersecurity-analyst",
            "Cybersecurity analysis also investigates weaknesses and suspicious activity.",
        ),
        (
            "cloud-security-engineer",
            "Cloud security also checks services and configurations for weaknesses.",
        ),
    ),
    "respond": (
        (
            "cloud-security-engineer",
            "Cloud security also uses monitoring and logs to detect threats.",
        ),
        (
            "penetration-tester",
            "Penetration testing investigates weaknesses that can lead to incidents.",
        ),
    ),
    "cloud_security": (
        (
            "cloud-engineer",
            "Cloud engineering builds the networks and services that need protection.",
        ),
        (
            "cybersecurity-analyst",
            "Cybersecurity analysis also detects and investigates threats using logs.",
        ),
    ),
    "networks": (
        (
            "system-administrator",
            "Systems administration also troubleshoots connectivity between services.",
        ),
        ("cloud-engineer", "Cloud engineering also designs and troubleshoots networks."),
    ),
    "servers": (
        (
            "linux-systems-engineer",
            "Linux systems work goes deeper into how Linux servers and processes run.",
        ),
        ("cloud-engineer", "Cloud engineering also sets up and maintains servers and services."),
    ),
    "cloud": (
        ("devops-engineer", "DevOps also configures environments for deploying software."),
        ("system-administrator", "Systems administration also keeps servers and services running."),
    ),
    "releases": (
        (
            "cloud-engineer",
            "Cloud engineering provides and automates the environments that run releases.",
        ),
        (
            "backend-developer",
            "Backend work includes testing and packaging services for deployment.",
        ),
    ),
    "circuits": (
        (
            "embedded-systems-developer",
            "Embedded development uses circuits and sensors to build working devices.",
        ),
    ),
    "embedded": (
        (
            "hardware-engineer",
            "Hardware engineering designs the circuits that device software interacts with.",
        ),
        (
            "linux-systems-engineer",
            "Linux systems work also uses low-level code to interact with system resources.",
        ),
    ),
    "linux": (
        (
            "system-administrator",
            "Systems administration works with Linux services, processes and storage.",
        ),
        (
            "embedded-systems-developer",
            "Embedded development also writes software close to the hardware.",
        ),
    ),
}
REPRESENTATIVES = {
    "build": "frontend",
    "data": "data-analyst",
    "design": "ui-designer",
    "security": "cybersecurity-analyst",
    "infrastructure": "network-engineer",
    "devices": "hardware-engineer",
}
FIELD_ACTIVITIES = {field: choices for field, _, choices in FIELDS}
ACTIVITY_LABELS = {key: label for choices in FIELD_ACTIVITIES.values() for key, label in choices}
GENERAL_ACTIVITIES = tuple(choices[0] for choices in FIELD_ACTIVITIES.values())


def select(completed, catalog):
    available = {item["slug"]: item for item in catalog if item["roadmap_ids"]}
    active = {
        answer.question_id: set(answer.option_ids)
        for answer in completed.answers
        if answer.question_id in completed.active_question_ids
    }
    preferred = next(
        (
            (question, value)
            for question, values in active.items()
            if question.startswith("prefer_")
            for value in values
            if value in ACTIVITY_CAREERS
        ),
        None,
    )
    branches = []
    for question in completed.active_question_ids:
        if not question.startswith("activities_"):
            continue
        field = question.removeprefix("activities_")
        choices = GENERAL_ACTIVITIES if field == "general" else FIELD_ACTIVITIES[field]
        branches.append([(question, key) for key, _ in choices if key in active.get(question, ())])

    def item(career, question, answer, reason, note=None):
        return UntrustedRecommendationItem(
            career_id=career["career_id"],
            roadmap_id=career["roadmap_ids"][0],
            evidence_fact_ids=[f"discovery:{question}:{answer}"],
            reason=reason,
            uncertainty_note=note,
        )

    found = {}
    matches = []
    ordered = [preferred] if preferred else []
    ordered.extend(entry for column in zip_longest(*branches) for entry in column if entry)
    for question, answer in ordered:
        slug = ACTIVITY_CAREERS[answer]
        if slug in available and slug not in found:
            label = ACTIVITY_LABELS[answer]
            phrase = label[0].lower() + label[1:]
            found[slug] = item(
                available[slug],
                question,
                answer,
                f"You chose to {phrase}. This roadmap introduces related work.",
            )
            matches.append((question, answer))
            if len(found) == 3:
                return list(found.values())
    if found:
        links = [RELATED_CAREERS[answer] for _, answer in matches]
        for alternatives in zip_longest(*links):
            for (question, answer), alternative in zip(matches, alternatives, strict=True):
                if not alternative:
                    continue
                slug, reason = alternative
                if slug in available and slug not in found:
                    found[slug] = item(
                        available[slug], question, answer, f"Related option: {reason}"
                    )
                    if len(found) == 3:
                        return list(found.values())
        return list(found.values())

    selected_fields = active.get("interests", set()) - {"unsure"}
    for field, field_label, activities in FIELDS:
        if selected_fields and field not in selected_fields:
            continue
        choices = [REPRESENTATIVES[field], *(ACTIVITY_CAREERS[key] for key, _ in activities)]
        slug = next((candidate for candidate in choices if candidate in available), None)
        if slug and slug not in found:
            found[slug] = item(
                available[slug],
                "interests",
                field if selected_fields else "unsure",
                f"A broad example from this area: {field_label}.",
                "This is an exploration option based on limited activity information.",
            )
    return list(found.values())[:3]
