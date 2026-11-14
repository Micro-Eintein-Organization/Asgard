"""Owner-approved local prototype map; versioned IDs never change meaning in place."""

from uuid import NAMESPACE_URL, uuid5

from app.core.errors import APIError
from app.modules.discovery.schemas import Questionnaire

QUESTIONNAIRE_ID = uuid5(NAMESPACE_URL, "asgard/content/questionnaire/1")
QUESTIONNAIRE_V2_ID = uuid5(NAMESPACE_URL, "asgard/content/questionnaire/2")

FIELDS = (
    (
        "build",
        "Build apps, websites, or games",
        (
            ("web", "Build pages people interact with"),
            ("backend", "Build the services behind an app"),
            ("full_stack", "Build both the screens and services"),
            ("mobile", "Build phone apps"),
            ("games", "Build games"),
            ("ai_features", "Add AI features to a product"),
        ),
    ),
    (
        "data",
        "Find answers in data",
        (
            ("analyze", "Investigate questions using data"),
            ("dashboards", "Build dashboards people use regularly"),
            ("pipelines", "Move and prepare data for others to use"),
            ("statistics", "Test ideas and make predictions with statistics"),
            ("train_models", "Train models and improve how they perform"),
        ),
    ),
    (
        "design",
        "Design how products look and work",
        (
            ("layouts", "Design screen layouts and visuals"),
            ("research", "Research how people use a product and improve their experience"),
        ),
    ),
    (
        "security",
        "Find and fix security weaknesses",
        (
            ("test_security", "Test for weaknesses with permission"),
            ("respond", "Spot and respond to security incidents"),
            ("cloud_security", "Protect services running in the cloud"),
        ),
    ),
    (
        "infrastructure",
        "Keep networks and services running",
        (
            ("networks", "Connect devices and troubleshoot networks"),
            ("servers", "Manage servers and user accounts"),
            ("cloud", "Set up cloud services"),
            ("releases", "Automate software releases"),
        ),
    ),
    (
        "devices",
        "Work with devices and electronics",
        (
            ("circuits", "Design and test circuits"),
            ("embedded", "Write software that runs inside a device"),
            ("linux", "Work on how Linux runs underneath applications"),
        ),
    ),
)

FOLLOW_UPS = (
    ("prefer_ai_ml", "ai_features", "train_models"),
    ("prefer_ui_ux", "layouts", "research"),
    ("prefer_cloud_devops", "cloud", "releases"),
)


def option(key, label, description, *, exclusive=False, excludes=()):
    return {
        "id": key,
        "label": label,
        "description": description,
        "exclusive": exclusive,
        "excludes": list(excludes),
    }


def uncertain(description="I would like to explore the options."):
    return option("unsure", "I'm not sure yet", description, exclusive=True)


def definition(questionnaire_id=None):
    if str(questionnaire_id) == str(QUESTIONNAIRE_V2_ID):
        return definition_v2()
    if questionnaire_id is not None and str(questionnaire_id) != str(QUESTIONNAIRE_ID):
        raise APIError(
            503, "questionnaire_unavailable", "This saved questionnaire version is unavailable."
        )
    questions = []

    def add(key, stage, prompt, helper, options, multiple=True, interest=None):
        questions.append(
            {
                "question_id": key,
                "position": len(questions),
                "stage": stage,
                "prompt": prompt,
                "helper": helper,
                "multiple": multiple,
                "interest_option_id": interest,
                "options": options,
            }
        )

    add(
        "interests",
        "interests",
        "What kinds of work interest you?",
        "Think about what sounds interesting, even if you have never tried it.",
        [
            option(
                "tools",
                "Creating useful tools",
                "Create something that helps people complete a task.",
            ),
            option(
                "design",
                "Designing how people use technology",
                "Plan how websites, apps, or devices look and work for people.",
            ),
            option(
                "investigation",
                "Investigating problems",
                "Look for patterns, find causes, or identify weaknesses.",
            ),
            option(
                "systems",
                "Working with devices and systems",
                "Set up, connect, repair, or improve devices and computer systems.",
            ),
            uncertain("I would like to explore different kinds of work."),
        ],
    )
    variants = {
        "tools": [
            (
                "website_interactions",
                "Building website interactions",
                "Make useful browser pages and controls respond to people.",
            ),
            (
                "process_data",
                "Organizing and processing data",
                "Arrange information and turn it into useful outputs.",
            ),
            (
                "automate_tasks",
                "Automating repetitive tasks",
                "Connect steps or tools to reduce repeated manual work; this need not use AI.",
            ),
        ],
        "design": [
            (
                "plan_screens",
                "Planning screens",
                "Arrange content and controls so people can understand a screen.",
            ),
            (
                "information_navigation",
                "Organizing information and navigation",
                "Help people find information and follow useful paths.",
            ),
            (
                "usability",
                "Improving usability",
                "Observe where people struggle and improve how a product works.",
            ),
        ],
        "investigation": [
            (
                "data_patterns",
                "Finding patterns in data",
                "Explore information to answer questions and explain findings.",
            ),
            (
                "software_causes",
                "Diagnosing software problems",
                "Investigate why a program behaves unexpectedly.",
            ),
            (
                "security_weaknesses",
                "Investigating security weaknesses",
                "Look for risks in systems and consider how to protect them.",
            ),
        ],
        "systems": [
            (
                "devices_networks",
                "Configuring devices and networks",
                "Set up computers and the connections between them.",
            ),
            (
                "connect_services",
                "Connecting services",
                "Help digital services exchange information reliably.",
            ),
            (
                "troubleshoot_systems",
                "Troubleshooting system problems",
                "Investigate failures in connected devices or services.",
            ),
        ],
        "general": [
            (
                "software_logic",
                "Building software logic",
                "Create the rules, steps, and calculations that make software work.",
            ),
            (
                "screens_interactions",
                "Designing screens and interactions",
                "Plan screens, menus, buttons, and how people use them.",
            ),
            (
                "data_handling",
                "Organizing and processing data",
                "Plan how data is organized and moved between tools.",
            ),
            (
                "security",
                "Protecting systems and networks",
                "Find risks and help protect connected services and information.",
            ),
        ],
    }
    for key, items in variants.items():
        add(
            "activities_" + key,
            "activities",
            "What would you enjoy working on?",
            "Think about activities that interest you. You do not need experience with them.",
            [option(*item) for item in items]
            + [uncertain("I would like to learn what these activities involve.")],
            interest=None if key == "general" else key,
        )
    add(
        "approach",
        "approach",
        "How do you like to approach a problem?",
        "Think about what helps you get started. Your approach may change with the situation.",
        [
            option("alone", "Working on my own", "Focus on a problem with few interruptions."),
            option(
                "together",
                "Working with others",
                "Discuss ideas with people who bring different skills.",
            ),
            option(
                "try_ideas",
                "Trying out ideas",
                "Build a small version, test it, and improve it as you learn.",
            ),
            option(
                "plan",
                "Following a clear plan",
                "Break the problem into steps and work through them carefully.",
            ),
            uncertain("My approach varies, or I have not found a preference."),
        ],
    )
    add(
        "background",
        "background",
        "Which best describes your background?",
        (
            "Think about learning, projects, or work. You do not need a "
            "qualification or a job in technology."
        ),
        [
            option(
                "new",
                "I'm new to technology",
                "I would like help understanding the options and where to begin.",
                excludes=("technology",),
            ),
            option(
                "technology",
                "I have experience with technology",
                "I have learned about technology, worked with it, or used it in projects.",
                excludes=("new",),
            ),
            option(
                "other_field",
                "I have experience in another field",
                "I would like to explore how my experience could help me in technology.",
            ),
            uncertain("I would like to continue without choosing a background description."),
        ],
    )
    add(
        "goals",
        "goals",
        "What would you like help with right now?",
        "Think about what you want from Asgard. You can change direction as you explore.",
        [
            option(
                "start", "Start learning", "Find a useful first step in an area that interests me."
            ),
            option(
                "explore",
                "Explore career options",
                "Understand different careers before deciding what to learn.",
            ),
            option(
                "change",
                "Explore a career change",
                "Find out what learning could help me move into different work.",
            ),
            uncertain("I would like to see the options before choosing a goal."),
        ],
        multiple=False,
    )
    return Questionnaire(id=QUESTIONNAIRE_ID, version=1, questions=questions)


def definition_v2():
    questions = []

    def add(key, stage, prompt, helper, options, limit=1, kind=None):
        questions.append(
            {
                "question_id": key,
                "position": len(questions),
                "stage": stage,
                "prompt": prompt,
                "helper": helper,
                "options": options,
                "multiple": limit > 1,
                "interest_option_id": None,
                "max_selections": limit,
                "kind": kind,
            }
        )

    add(
        "experience_preference",
        "background",
        "Would you like to build on skills or experience you already have?",
        "Optional. Your answer changes what you see first on Results.",
        [
            option("use_experience", "Use my experience", ""),
            option("basics", "Start with the basics", ""),
            uncertain(""),
        ],
        kind="experience_preference",
    )
    add(
        "interests",
        "interests",
        "What kind of work would you like to try?",
        "Pick up to two fields you’re curious about.",
        [option(key, label, "") for key, label, _ in FIELDS] + [uncertain("")],
        limit=2,
    )
    for key, label, choices in FIELDS:
        add(
            f"activities_{key}",
            "activities",
            "Which activities would you like to try?",
            label,
            [option(value, name, "") for value, name in choices] + [uncertain("")],
            limit=2,
        )
    add(
        "activities_general",
        "activities",
        "Which activities would you like to try?",
        "Pick up to two, or continue if you’re still unsure.",
        [option(*choices[0], "") for _, _, choices in FIELDS]
        + [option("unsure", "Still not sure", "", exclusive=True)],
        limit=2,
    )
    labels = dict(choice for _, _, choices in FIELDS for choice in choices)
    for key, left, right in FOLLOW_UPS:
        add(
            key,
            "activities",
            "Which would you rather try first?",
            "",
            [
                option(left, labels[left], ""),
                option(right, labels[right], ""),
                option("both", "Both or I’m not sure", ""),
            ],
            kind="activity_follow_up",
        )
    goal = definition().questions[-1].model_dump()
    questions.append({**goal, "position": len(questions), "max_selections": 1})
    return Questionnaire(id=QUESTIONNAIRE_V2_ID, version=2, questions=questions)


def active_route(answers, version=1):
    if version == 2:
        interests = answers.get("interests", [])
        activities = [f"activities_{key}" for key, _, _ in FIELDS if key in interests]
        if not activities:
            activities = ["activities_general"]
        route = ["experience_preference", "interests", *activities]
        if all(answers.get(key) for key in activities):
            selected = {value for key in activities for value in answers[key]}
            follow_up = next(
                (key for key, left, right in FOLLOW_UPS if {left, right} <= selected), None
            )
            if follow_up:
                route.append(follow_up)
        return [*route, "goals"]

    interests = answers.get("interests", [])
    branch = (
        interests[0]
        if len(interests) == 1 and interests[0] in ("tools", "design", "investigation", "systems")
        else "general"
    )
    return ["interests", "activities_" + branch, "approach", "background", "goals"]


def validate_answer(question, selected):
    options = {item.id: item for item in question.options}
    if not selected or len(set(selected)) != len(selected) or not set(selected) <= options.keys():
        raise APIError(422, "invalid_answer", "Choose valid options for this question.")
    if not question.multiple and len(selected) != 1:
        raise APIError(422, "invalid_answer", "Choose one option for this question.")
    if question.max_selections is not None and len(selected) > question.max_selections:
        raise APIError(422, "invalid_answer", f"Choose up to {question.max_selections} options.")
    if len(selected) > 1 and any(options[key].exclusive for key in selected):
        raise APIError(422, "invalid_answer", "The uncertainty option must be selected on its own.")
    if any(set(options[key].excludes) & set(selected) for key in selected):
        raise APIError(422, "invalid_answer", "These background options cannot be combined.")
