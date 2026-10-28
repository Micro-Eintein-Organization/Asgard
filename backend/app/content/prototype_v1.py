"""Original summaries and link-only resources reviewed for the approved local scope."""

REVIEWED_AT = "2026-10-28T09:29:49Z"
REVIEW_REFERENCE = "Owner-approved connected-prototype plan, this task, 2026-10-28; Codex source/resource review, not runtime or learner acceptance"
SOURCE_LICENSE = "Original Asgard-authored summaries; third-party resources linked only and retain their stated licenses"

MDN_BASE = "https://developer.mozilla.org/en-US/docs/Learn_web_development/"
CALC = "https://help.libreoffice.org/latest/en-US/text/scalc/main0000.html"
SQL = "https://www.sqlite.org/lang_select.html"
NEEDS = "https://www.gov.uk/service-manual/user-research/start-by-learning-user-needs"
PROTOTYPES = "https://www.gov.uk/service-manual/design/making-prototypes"
USABILITY = "https://www.gov.uk/service-manual/user-research/using-moderated-usability-testing"


def resource(title, url, license, kind="documentation"):
    return {
        "title": title,
        "url": url,
        "kind": kind,
        "is_free": True,
        "license": license + "; external link only, no source text redistributed",
        "reviewed_at": REVIEWED_AT,
    }


def mdn(title, suffix):
    return resource(
        title, MDN_BASE + suffix, "CC BY-SA 2.5 or later; MDN attribution/copyright guidance"
    )


def calc(title):
    return resource(title, CALC, "Mozilla Public License 2.0; LibreOffice Help copyright notice")


def gov(title, url):
    return resource(title, url, "Open Government Licence 3.0 except where stated")


def topic(slug, title, explanation, link, branch=None):
    return {
        "slug": slug,
        "title": title,
        "explanation": explanation,
        "resources": [link],
        "branch": branch,
    }


def careers():
    return [
        {
            "category": {
                "slug": "software-ai",
                "title": "Software and AI",
                "description": "Build useful digital tools.",
                "position": 0,
            },
            "slug": "frontend",
            "title": "Frontend Developer",
            "description": "Build the parts of a website people see and use, combining content, layout and browser interaction.",
            "responsibilities": [
                "Build semantic page structure",
                "Implement accessible responsive interfaces",
                "Create and explain browser interactions",
            ],
            "skills": ["HTML", "CSS", "JavaScript", "Accessibility"],
            "relevance_attributes": {
                "activities": ["implement browser interfaces", "build useful interactive tools"],
                "boundaries": [
                    "Frontend implementation differs from UX research",
                    "Software interest alone does not imply AI interest",
                ],
                "scope": "introductory browser development, not a complete professional curriculum",
            },
            "roadmap": {
                "title": "Frontend foundations",
                "description": "Build an accessible resource page with a working search interaction.",
                "milestones": [
                    {
                        "slug": "web-foundations",
                        "title": "Web foundations",
                        "description": "Understand browser delivery and build semantic, responsive pages.",
                        "topics": [
                            topic(
                                "how-the-web-works",
                                "How the web works",
                                "Explain how a browser requests a URL and receives page content from a server. Sketch a request and response before building a page.",
                                mdn(
                                    "How the web works",
                                    "Getting_started/Web_standards/How_the_web_works",
                                ),
                            ),
                            topic(
                                "semantic-html",
                                "Semantic HTML",
                                "Structure a page with meaningful headings, navigation, main content, links and labeled controls. Make its reading order clear without styling.",
                                mdn("Structuring content with HTML", "Core/Structuring_content"),
                            ),
                            topic(
                                "css-layout",
                                "CSS and layout",
                                "Use the box model, spacing, typography, Flexbox and Grid to create a readable layout that adapts to narrow screens.",
                                mdn("Your first website", "Getting_started/Your_first_website"),
                            ),
                            topic(
                                "accessibility",
                                "Accessible responsive pages",
                                "Use semantic controls, explicit labels and visible keyboard focus. Check that content reflows and interactions can be completed without a mouse.",
                                mdn("Accessibility on the web", "Core/Accessibility"),
                            ),
                        ],
                    },
                    {
                        "slug": "interactive-page",
                        "title": "Your first interactive page",
                        "description": "Combine structure, presentation and browser behavior in a small project.",
                        "topics": [
                            topic(
                                "javascript",
                                "JavaScript fundamentals",
                                "Use values, conditions, functions and events to update page content. Explain how an event changes the visible result.",
                                mdn("Dynamic scripting with JavaScript", "Core/Scripting"),
                            ),
                            topic(
                                "resource-page",
                                "Build a resource page",
                                "Build a responsive resource list with descriptive links and a labeled search filter. Include an empty-result message and check keyboard operation.",
                                mdn("Your first website", "Getting_started/Your_first_website"),
                            ),
                        ],
                    },
                ],
            },
        },
        {
            "category": {
                "slug": "data-analytics",
                "title": "Data and Analytics",
                "description": "Explore information and explain findings.",
                "position": 1,
            },
            "slug": "data-analyst",
            "title": "Data Analyst",
            "description": "Turn a focused question into an understandable finding by organizing, checking and examining data.",
            "responsibilities": [
                "Clarify a question and its data",
                "Check and summarize records",
                "Explain findings and their limits",
            ],
            "skills": ["Data cleaning", "Spreadsheets", "SQL", "Charts"],
            "relevance_attributes": {
                "activities": [
                    "find patterns in data",
                    "organize and summarize information",
                    "explain findings",
                ],
                "boundaries": [
                    "This is analysis, not predictive modeling or data infrastructure",
                    "Prior mathematical proficiency is not inferred",
                ],
                "scope": "a small tabular analysis and report",
            },
            "roadmap": {
                "title": "Data analysis foundations",
                "description": "Answer one question with a small table, a chart and a short explanation.",
                "milestones": [
                    {
                        "slug": "understand-data",
                        "title": "Understand your data",
                        "description": "Choose a clear question and inspect the records that can answer it.",
                        "topics": [
                            topic(
                                "question-types",
                                "Questions and data types",
                                "Choose a specific question for a small practice table. Identify what each row and column means, and distinguish categories, numbers and dates.",
                                calc("Calc tables and functions"),
                            ),
                            topic(
                                "clean-data",
                                "Check and clean a table",
                                "Look for missing values, duplicate rows and inconsistent formats. Keep the original table and explain each cleaning choice instead of silently changing records.",
                                calc("Working with Calc data"),
                            ),
                        ],
                    },
                    {
                        "slug": "analyze-explain",
                        "title": "Analyze and explain",
                        "description": "Choose one tool path, summarize the table and communicate what it supports.",
                        "branch_group": {
                            "slug": "analysis-tool",
                            "title": "Choose an analysis tool",
                            "explanation": "Choose spreadsheets or SQL for this exercise. Both paths lead to the same reporting topics; neither choice measures ability.",
                            "branches": [
                                {"slug": "spreadsheet", "title": "Spreadsheet"},
                                {"slug": "sql", "title": "SQL"},
                            ],
                        },
                        "topics": [
                            topic(
                                "spreadsheet-basics",
                                "Spreadsheet basics",
                                "Filter and sort a practice table. Use simple aggregate formulas to summarize values and explain how the summary answers your question.",
                                calc("LibreOffice Calc Help"),
                                "spreadsheet",
                            ),
                            topic(
                                "sql-basics",
                                "SQL basics",
                                "Use SELECT, WHERE and GROUP BY on a small practice table. Explain which rows and groups contribute to the result.",
                                resource(
                                    "SQLite SELECT documentation",
                                    SQL,
                                    "Public domain; SQLite code and documentation dedication",
                                ),
                                "sql",
                            ),
                            topic(
                                "charts",
                                "Choose and explain a chart",
                                "Choose a chart that matches your question, label its units and avoid misleading scales. Describe both the main finding and one limitation.",
                                calc("Creating charts in Calc"),
                            ),
                            topic(
                                "analysis-report",
                                "Write a short analysis report",
                                "Present the question, data checks, summary and chart in a short report. Separate observed patterns from explanations that would require additional evidence.",
                                calc("Calc analysis and charts"),
                            ),
                        ],
                    },
                ],
            },
        },
        {
            "category": {
                "slug": "design-ux",
                "title": "Design and UX",
                "description": "Understand people and improve product interactions.",
                "position": 2,
            },
            "slug": "ui-ux-designer",
            "title": "UI/UX Designer",
            "description": "Understand what people need and shape clear interfaces and interactions that help them complete a task.",
            "responsibilities": [
                "Understand user goals",
                "Sketch task flows and interfaces",
                "Observe and improve usability",
            ],
            "skills": ["User needs", "Information architecture", "Wireframes", "Usability"],
            "relevance_attributes": {
                "activities": [
                    "plan screens and navigation",
                    "understand user needs",
                    "improve usability",
                ],
                "boundaries": [
                    "Design research and interface planning differ from implementing frontend code",
                    "Visual preference is not evidence of design proficiency",
                ],
                "scope": "one small task flow and a low-fidelity interface exercise",
            },
            "roadmap": {
                "title": "UI/UX foundations",
                "description": "Design and revise a simple flow for finding and saving a useful resource.",
                "milestones": [
                    {
                        "slug": "understand-task",
                        "title": "Understand the task",
                        "description": "Start with the person's goal before drawing screens.",
                        "topics": [
                            topic(
                                "user-goals",
                                "Understand user goals",
                                "Describe who is trying to do what and why. Record assumptions separately from observations and avoid assuming that your own preferences represent everyone.",
                                gov("Learning about users and their needs", NEEDS),
                            ),
                            topic(
                                "user-flow",
                                "Sketch a user flow",
                                "Sketch the steps needed to find and save a resource. Include the starting point, important decisions and a recovery path when something is missing.",
                                gov("Making prototypes", PROTOTYPES),
                            ),
                        ],
                    },
                    {
                        "slug": "design-observe",
                        "title": "Design and observe",
                        "description": "Make a low-fidelity interface and learn where a person struggles.",
                        "topics": [
                            topic(
                                "wireframes",
                                "Create a wireframe",
                                "Draw the content, controls and navigation for the flow. Keep labels clear and explain how the layout supports the task; polished artwork is unnecessary.",
                                gov("Making prototypes", PROTOTYPES),
                            ),
                            topic(
                                "usability-exercise",
                                "Run a small usability exercise",
                                "Ask a willing participant to try the flow while you observe. Record task difficulties without coaching, revise one issue and explain what still needs research.",
                                gov("Using moderated usability testing", USABILITY),
                            ),
                        ],
                    },
                ],
            },
        },
    ]
