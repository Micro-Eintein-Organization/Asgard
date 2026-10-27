export interface DiscoveryOption {
  id: string;
  title: string;
  description: string;
  badge?: string;
}

export interface DiscoveryRound {
  id: number;
  title: string;
  subtitle: string;
  options: DiscoveryOption[];
}

export const DISCOVERY_QUESTIONS: DiscoveryRound[] = [
  {
    id: 1,
    title: "1. What kinds of work appeal to you?",
    subtitle: "Choose what sounds interesting, even if you haven't tried it yet.",
    options: [
      { id: "opt-1", title: "Creating useful tools", description: "Make something that helps people do a task.", badge: "Domain" },
      { id: "opt-2", title: "Designing experiences", description: "Shape how something looks and feels to use.", badge: "Domain" },
      { id: "opt-3", title: "Investigating problems", description: "Look for patterns, causes, or weaknesses.", badge: "Domain" },
      { id: "opt-4", title: "Working with devices and systems", description: "Set up, connect, or repair technology.", badge: "Domain" },
    ],
  },
  {
    id: 2,
    title: "2. Which environment do you prefer to build in?",
    subtitle: "Select your preferred application layer.",
    options: [
      { id: "opt-5", title: "Frontend & User Interfaces", description: "Visual components, web layouts, and interactive experiences.", badge: "Domain" },
      { id: "opt-6", title: "Backend & Services", description: "APIs, server logic, and database management.", badge: "Domain" },
      { id: "opt-7", title: "AI & Data Pipelines", description: "Machine learning models, analytics, and data processing.", badge: "Domain" },
      { id: "opt-8", title: "Infrastructure & Security", description: "Cloud configuration, networks, and system security.", badge: "Domain" },
    ],
  },
  {
    id: 3,
    title: "3. What is your preferred tech stack focus?",
    subtitle: "Select the technologies you enjoy working with most.",
    options: [
      { id: "opt-9", title: "React, TypeScript & Tailwind", description: "Modern component-driven web development.", badge: "Domain" },
      { id: "opt-10", title: "Node.js, Python & SQL", description: "Robust backend services and data handling.", badge: "Domain" },
      { id: "opt-11", title: "TensorFlow, PyTorch & Pandas", description: "Data science and machine learning workflows.", badge: "Domain" },
      { id: "opt-12", title: "C++, C# & Game Engines", description: "High-performance graphics and simulation logic.", badge: "Domain" },
    ],
  },
  {
    id: 4,
    title: "4. How do you approach complex challenges?",
    subtitle: "Pick your natural problem-solving style.",
    options: [
      { id: "opt-13", title: "User-Centered Iteration", description: "Focus heavily on user feedback, design polish, and accessibility.", badge: "Domain" },
      { id: "opt-14", title: "Architectural Scalability", description: "Design clean abstractions, modular code, and high-performance APIs.", badge: "Domain" },
      { id: "opt-15", title: "Data-Driven Analysis", description: "Run experiments, inspect metrics, and optimize based on numbers.", badge: "Domain" },
      { id: "opt-16", title: "Automation & Scripting", description: "Build automated tools to eliminate manual repetitive work.", badge: "Domain" },
    ],
  },
  {
    id: 5,
    title: "5. What would you like help with right now?",
    subtitle: "Choose your main goal. You can change direction as you explore.",
    options: [
      { id: "opt-17", title: "Start learning", description: "Find a useful first step in a field that interests me.", badge: "Domain" },
      { id: "opt-18", title: "Explore possible careers", description: "Understand different roles before deciding what interests me.", badge: "Domain" },
      { id: "opt-19", title: "Change career direction", description: "Explore how to move toward a different kind of work.", badge: "Domain" },
      { id: "opt-20", title: "I'm not sure yet", description: "I want to see what is available before choosing a goal.", badge: "Domain" },
    ],
  },
];