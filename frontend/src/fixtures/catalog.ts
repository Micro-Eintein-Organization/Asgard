export const categories = [
  {
    id: "software-ai",
    title: "Software and AI",
    description:
      "Build digital tools and explore how software and artificial intelligence work.",
  },
  {
    id: "design",
    title: "Design & UX",
    description:
      "Understand people and shape useful, accessible digital experiences.",
  },
  {
    id: "data",
    title: "Data & Analytics",
    description:
      "Organize information, investigate questions and communicate what data reveals.",
  },
  {
    id: "security",
    title: "Cybersecurity",
    description: "Understand risks and help protect systems and information.",
  },
  {
    id: "hardware",
    title: "Hardware & Embedded Systems",
    description:
      "Connect software with the devices and physical systems around us.",
  },
  {
    id: "networking",
    title: "Networking & Infrastructure",
    description:
      "Connect computers and keep shared technology services running.",
  },
];

// Presentation fixtures, not published curricula or API/data contracts.
export const careers = [
  {
    id: "frontend",
    title: "Frontend Developer",
    category: "software-ai",
    description:
      "Build the parts of a website that people see and use. Bring content, design and interaction together.",
    skills: ["HTML", "CSS", "JavaScript", "Accessibility"],
    work: "User interfaces · Web development",
    activities: [
      "Translate designs into interfaces",
      "Build accessible interactions",
      "Make pages work across screen sizes",
    ],
    example: "Create a responsive resource page with a useful search filter.",
  },
  {
    id: "machine-learning",
    title: "Machine Learning Engineer",
    category: "software-ai",
    description:
      "Build and maintain software that uses machine learning models to work with data.",
    skills: ["Python", "Data preparation", "Model evaluation"],
    work: "Models · Software systems",
    activities: [
      "Prepare and examine data",
      "Evaluate model behavior",
      "Integrate models into software",
    ],
    example:
      "Compare a small model against a documented baseline using a synthetic dataset.",
  },
  {
    id: "ux-design",
    title: "UX Designer",
    category: "design",
    description:
      "Understand what people need and design how they move through digital products.",
    skills: ["User research", "Interaction design", "Prototyping"],
    work: "Research · Digital experiences",
    activities: [
      "Investigate user needs",
      "Prototype an interaction",
      "Test designs with people",
    ],
    example: "Prototype and test a clearer way to find a learning resource.",
  },
  {
    id: "data-analysis",
    title: "Data Analyst",
    category: "data",
    description:
      "Explore data, investigate practical questions and explain findings clearly.",
    skills: ["Spreadsheets", "SQL", "Data visualization"],
    work: "Questions · Evidence · Decisions",
    activities: [
      "Clean and explore data",
      "Investigate a question",
      "Communicate limitations and findings",
    ],
    example: "Explore a public dataset and explain a finding with a chart.",
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity Analyst",
    category: "security",
    description:
      "Investigate security risks and help protect information, accounts and systems.",
    skills: ["Networking", "Risk analysis", "Incident investigation"],
    work: "Security · Investigation",
    activities: [
      "Identify risks",
      "Review security events",
      "Document a response",
    ],
    example: "Review a fictional system and document a basic risk assessment.",
  },
  {
    id: "embedded",
    title: "Embedded Systems Developer",
    category: "hardware",
    description:
      "Write software that interacts with sensors, devices and the physical world.",
    skills: ["C", "Electronics", "Microcontrollers"],
    work: "Devices · Software · Sensors",
    activities: [
      "Read sensor input",
      "Write device software",
      "Test behavior under constraints",
    ],
    example: "Plan a simple sensor application in an isolated simulator.",
  },
  {
    id: "networking",
    title: "Network Engineer",
    category: "networking",
    description:
      "Design and maintain the connections that let computers and services communicate.",
    skills: ["Networking", "Routing", "Troubleshooting"],
    work: "Connections · Infrastructure",
    activities: [
      "Plan a network",
      "Configure connections",
      "Investigate connectivity problems",
    ],
    example:
      "Document a small simulated network and a troubleshooting procedure.",
  },
];
export type CareerFixture = (typeof careers)[number];
export const findCareer = (id?: string) =>
  careers.find((career) => career.id === id);

// Adapted from the preserved prototype's Frontend presentation content only.
export const sampleMilestones = [
  {
    id: "web-foundations",
    title: "Web foundations",
    description:
      "Understand how the web works and structure a meaningful first page.",
    topics: [
      {
        id: "how-the-web-works",
        title: "How the web works",
        status: "Done" as const,
        explanation:
          "A browser requests a resource from a server using a URL. The server returns content such as HTML, CSS, JavaScript or data.",
        outcome:
          "Describe the journey from entering an address to receiving a web page.",
        resource:
          "https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works",
        resourceTitle: "How the web works",
        publisher: "MDN",
      },
      {
        id: "semantic-html",
        title: "Semantic HTML",
        status: "Learning" as const,
        explanation:
          "HTML describes the meaning and structure of a page. Use headings in a logical order, links for navigation and buttons for actions.",
        outcome:
          "Structure a page with a header, navigation, main content and meaningful sections.",
        resource:
          "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content",
        resourceTitle: "Structuring content with HTML",
        publisher: "MDN",
      },
      {
        id: "css-layout",
        title: "CSS and layout",
        status: "Not started" as const,
        explanation:
          "CSS controls presentation. Explore the box model, spacing, typography, Flexbox and Grid to arrange content across screen sizes.",
        outcome: "Create a readable layout that reflows on a narrow screen.",
        resource: "https://web.dev/learn/css",
        resourceTitle: "Learn CSS",
        publisher: "web.dev",
      },
      {
        id: "accessibility",
        title: "Accessible, responsive pages",
        status: "Skipped" as const,
        explanation:
          "Use clear labels, semantic controls, visible keyboard focus and enough contrast. Accessibility is part of building the page.",
        outcome:
          "Navigate a page by keyboard and identify useful improvements.",
        resource:
          "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility",
        resourceTitle: "Accessibility",
        publisher: "MDN",
      },
    ],
  },
  {
    id: "interactions",
    title: "Your first interactive page",
    description:
      "Combine structure, presentation and behavior in a small project.",
    topics: [
      {
        id: "javascript",
        title: "JavaScript fundamentals",
        status: "Not started" as const,
        explanation:
          "JavaScript adds behavior. Start with values, conditions, functions, events and updating page content.",
        outcome: "Add an interaction you can explain and operate by keyboard.",
        resource:
          "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting",
        resourceTitle: "Dynamic scripting with JavaScript",
        publisher: "MDN",
      },
      {
        id: "resource-page",
        title: "Build a resource page",
        status: "Not started" as const,
        explanation:
          "Bring HTML, CSS and JavaScript together in a small responsive page of resources on a subject you know.",
        outcome:
          "Build a resource list with descriptive links and a labeled search filter.",
        resource:
          "https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website",
        resourceTitle: "Your first website",
        publisher: "MDN",
      },
    ],
  },
];
