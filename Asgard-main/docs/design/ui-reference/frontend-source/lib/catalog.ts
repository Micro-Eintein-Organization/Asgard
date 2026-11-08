export type TopicStatus = 'not-started' | 'learning' | 'done' | 'skipped';
export type Resource = { title: string; url: string; publisher: string };
export type Topic = {
  id: string; title: string; summary: string; explanation: string;
  outcome: string; tools: string; resources: Resource[];
};
export type Milestone = { id: string; title: string; description: string; topics: Topic[] };
export type Career = {
  id: string; title: string; category: string; description: string;
  skills: string[]; activities: string[]; example: string; milestones: Milestone[];
};

export const categories = [
  { id: 'software-ai', name: 'Software and AI', description: 'Build software, connect systems, and explore tools that use artificial intelligence.' },
  { id: 'design', name: 'Design & UX', description: 'Understand people and design useful, accessible digital experiences.' },
  { id: 'data', name: 'Data & Analytics', description: 'Organize and interpret data to answer questions and inform decisions.' },
  { id: 'security', name: 'Cybersecurity', description: 'Understand risks and help protect digital systems and information.' },
];

export const careers: Career[] = [
  {
    id: 'frontend', title: 'Frontend Developer', category: 'software-ai',
    description: 'Build the parts of a website that people see and interact with, using HTML, CSS, and JavaScript.',
    skills: ['HTML', 'CSS', 'JavaScript', 'Accessibility'],
    activities: ['Translate designs into interfaces', 'Make pages work on different screen sizes', 'Build interactions and accessible controls', 'Investigate and fix browser problems'],
    example: 'Create a responsive resource page where people can filter a list and open useful links.',
    milestones: [
      {
        id: 'web-foundations', title: 'Web foundations', description: 'Understand the web and create a meaningful first page.',
        topics: [
          {
            id: 'how-web-works', title: 'How the web works', summary: 'Browsers, servers, and the journey of a web request.',
            explanation: 'A browser requests a resource from a server using a URL. The server responds with content such as HTML, CSS, JavaScript, or data. Learn to distinguish the browser interface from the server that stores and delivers information.',
            outcome: 'Explain what happens when you enter a website address and identify HTML, CSS, and JavaScript in a page.',
            tools: 'Use a browser and its developer tools. Open the Network panel to observe requests while loading a public learning page.',
            resources: [{ title: 'How the web works', publisher: 'MDN', url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works' }],
          },
          {
            id: 'semantic-html', title: 'Semantic HTML', summary: 'Structure content with meaningful elements.',
            explanation: 'HTML describes the meaning and structure of a page. Use headings in a logical order, paragraphs for text, links for navigation, and buttons for actions. Meaningful elements make content easier to understand with different devices and assistive technologies.',
            outcome: 'Create a page with a header, navigation, a main heading, sections, and a list of resources.',
            tools: 'Use a text editor and a browser. Save an index.html file and open it locally; no paid tools are needed.',
            resources: [{ title: 'Structuring content with HTML', publisher: 'MDN', url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content' }],
          },
        ],
      },
      {
        id: 'interfaces', title: 'Responsive interfaces', description: 'Make a clear layout that works for different people and screens.',
        topics: [
          {
            id: 'css-layout', title: 'CSS and layout', summary: 'Style your page and arrange its content.',
            explanation: 'CSS controls presentation. Learn selectors, the box model, spacing, typography, Flexbox, and Grid. Start with readable content and use layout rules that adapt naturally instead of positioning every element at fixed coordinates.',
            outcome: 'Style your resource page with consistent spacing and a layout that stacks on a narrow screen.',
            tools: 'Use your browser Styles and Layout panels to inspect and adjust CSS.',
            resources: [{ title: 'Learn CSS', publisher: 'web.dev', url: 'https://web.dev/learn/css' }],
          },
          {
            id: 'accessible-pages', title: 'Accessible, responsive pages', summary: 'Build controls and content that people can actually use.',
            explanation: 'Use visible labels, descriptive links, keyboard-operable controls, sufficient contrast, and responsive sizing. A layout should remain readable when text grows or the available width changes. Accessibility is part of the implementation rather than a separate decorative feature.',
            outcome: 'Navigate your page with a keyboard, label a form field, and adapt the layout without horizontal page overflow.',
            tools: 'Use browser responsive-design tools and semantic HTML. Follow the guidance in the learning resource.',
            resources: [{ title: 'Accessibility', publisher: 'MDN', url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility' }],
          },
        ],
      },
      {
        id: 'interactions', title: 'Your first interactive page', description: 'Add behavior and combine your foundations in a small project.',
        topics: [
          {
            id: 'javascript-basics', title: 'JavaScript fundamentals', summary: 'Values, functions, events, and updating the page.',
            explanation: 'JavaScript adds behavior to a page. Learn values, arrays, conditions, functions, DOM selection, and event listeners. Keep data separate from the code that draws it, and use textContent rather than inserting untrusted HTML.',
            outcome: 'Add a search field that filters an array of resource titles and shows a useful no-results message.',
            tools: 'Use the browser console and debugger. A plain HTML file and JavaScript file are sufficient for this exercise.',
            resources: [{ title: 'Dynamic scripting with JavaScript', publisher: 'MDN', url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting' }],
          },
          {
            id: 'resource-page-project', title: 'Build a resource page', summary: 'Bring structure, layout, accessibility, and interaction together.',
            explanation: 'Build a small page of resources on a subject you know. Give it a meaningful heading, a responsive list, a labeled filter, and descriptive links. Keep the scope small enough that you can explain how each part works.',
            outcome: 'Finish a responsive page with a working resource filter and explain one improvement you would make next.',
            tools: 'Use your existing editor, HTML, CSS, JavaScript, and a browser. A framework or hosting account is optional.',
            resources: [{ title: 'Your first website', publisher: 'MDN', url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website' }],
          },
        ],
      },
    ],
  },
  {
    id: 'backend', title: 'Backend Developer', category: 'software-ai',
    description: 'Build the services and data-handling behind an application: requests, APIs, validation, storage, and access rules.',
    skills: ['APIs', 'Databases', 'Server-side logic', 'Security'],
    activities: ['Design request and response contracts', 'Store and retrieve application data', 'Validate inputs and enforce access rules', 'Investigate service errors'],
    example: 'Build a service that stores a person’s learning progress and returns it only to the authorized account.',
    milestones: [],
  },
];

export const getCareer = (id: string) => careers.find(career => career.id === id);
export const allTopics = careers.flatMap(c => c.milestones.flatMap(m => m.topics));
export const getTopic = (id: string) => allTopics.find(t => t.id === id);
export const findTopicContext = (id: string) => {
  for (const career of careers) for (const milestone of career.milestones) {
    const topic = milestone.topics.find(t => t.id === id);
    if (topic) return { career, milestone, topic };
  }
  return undefined;
};

export const discoveryQuestions = [
  {
    id: 'interests', eyebrow: 'General interests', title: 'What kinds of work appeal to you?',
    description: 'Choose what sounds interesting, even if you haven’t tried it yet. You can choose more than one.', multiple: true,
    options: [
      { id: 'tools', title: 'Creating useful tools', description: 'Make something that helps people do a task.', icon: 'code' },
      { id: 'design', title: 'Designing experiences', description: 'Shape how something looks and feels to use.', icon: 'layout' },
      { id: 'investigate', title: 'Investigating problems', description: 'Look for patterns, causes, or weaknesses.', icon: 'search' },
      { id: 'systems', title: 'Working with systems', description: 'Understand, connect, or improve how things work.', icon: 'network' },
      { id: 'unsure', title: 'I’m not sure yet', description: 'Explore a few directions before choosing.', icon: 'compass' },
    ],
  },
  {
    id: 'activities', eyebrow: 'Activities and motivations', title: 'What would you enjoy creating or solving?',
    description: 'Pick activities you would like to explore. Prior experience isn’t needed.', multiple: true,
    options: [
      { id: 'interfaces', title: 'Making an interface', description: 'Build the pages and controls people interact with.', icon: 'layout' },
      { id: 'logic', title: 'Making things work', description: 'Connect data and build the behavior behind an app.', icon: 'code' },
      { id: 'automate', title: 'Simplifying a repeated task', description: 'Reduce manual steps with a useful tool.', icon: 'workflow' },
      { id: 'understand', title: 'Finding an explanation', description: 'Investigate why something happens or breaks.', icon: 'search' },
      { id: 'unsure', title: 'I’m not sure yet', description: 'Keep different activities open for exploration.', icon: 'compass' },
    ],
  },
  {
    id: 'approach', eyebrow: 'Work approach', title: 'How do you like to approach a problem?',
    description: 'These approaches can overlap. Choose any that describe you, or choose unsure.', multiple: true,
    options: [
      { id: 'try', title: 'Try and improve', description: 'Make a small version, then learn from it.', icon: 'code' },
      { id: 'details', title: 'Investigate the details', description: 'Understand what is happening before changing it.', icon: 'search' },
      { id: 'plan', title: 'Make a clear plan', description: 'Break a problem into manageable steps.', icon: 'list' },
      { id: 'together', title: 'Work with others', description: 'Talk through ideas and solve things together.', icon: 'users' },
      { id: 'unsure', title: 'It depends / I’m unsure', description: 'Different situations call for different approaches.', icon: 'compass' },
    ],
  },
  {
    id: 'background', eyebrow: 'Experience and background', title: 'Where are you starting from?',
    description: 'Choose one description. This is context, not a skill assessment.', multiple: false,
    options: [
      { id: 'new', title: 'I’m new to tech', description: 'Help me understand the options and where to begin.', icon: 'compass' },
      { id: 'technical', title: 'Technical or related experience', description: 'I’ve studied, worked on, or built related things.', icon: 'code' },
      { id: 'other', title: 'Experience outside tech', description: 'I’d like to explore how my experience could transfer.', icon: 'users' },
      { id: 'unsure', title: 'I’m not sure which fits', description: 'Continue without assuming my background.', icon: 'search' },
    ],
  },
  {
    id: 'goals', eyebrow: 'Your goals', title: 'What would you like help with right now?',
    description: 'Choose your main goal. You can change direction as you explore.', multiple: false,
    options: [
      { id: 'learn', title: 'Start learning', description: 'Find a useful first step in a field that interests me.', icon: 'book' },
      { id: 'explore', title: 'Explore possible careers', description: 'Understand the work before deciding what interests me.', icon: 'compass' },
      { id: 'change', title: 'Change career direction', description: 'Explore a route toward a different kind of work.', icon: 'workflow' },
      { id: 'unsure', title: 'I’m not sure yet', description: 'See what is available before choosing a goal.', icon: 'search' },
    ],
  },
] as const;

export type Answers = Record<string, string[]>;
export type Recommendation = { careerId: string; reason: string; evidence: string[] };
export type SavedRecommendations = { items: Recommendation[]; inputRevision: number; model: string; generatedAt: string };
export type AppState = {
  version: number; entered: boolean; currentCareer: string | null;
  profile: { firstName: string; surname: string; preferredField: string; helperDismissed: boolean };
  discovery: { answers: Answers; step: number; completed: boolean; revision: number };
  recommendations: SavedRecommendations | null;
  statuses: Record<string, TopicStatus>;
  completedAt: Record<string, string>;
};

export function initialState(): AppState {
  return { version: 0, entered: false, currentCareer: null,
    profile: { firstName: '', surname: '', preferredField: 'software-ai', helperDismissed: false },
    discovery: { answers: {}, step: 0, completed: false, revision: 0 },
    recommendations: null, statuses: {}, completedAt: {} };
}
