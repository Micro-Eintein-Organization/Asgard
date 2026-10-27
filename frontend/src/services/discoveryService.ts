import { DiscoveryAnswers } from '../types/discovery';

export interface DiscoveryResult {
  matchPercentage: number;
  title: string;
  description: string;
  keySkills: string[];
  isTopMatch?: boolean;
}

export const discoveryService = {
  // Save draft to localStorage
  saveDraft: (answers: DiscoveryAnswers, currentStep: number) => {
    localStorage.setItem('asgard_discovery_draft', JSON.stringify({ answers, currentStep, updatedAt: new Date().toISOString() }));
  },

  // Load draft from localStorage
  loadDraft: () => {
    const raw = localStorage.getItem('asgard_discovery_draft');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as { answers: DiscoveryAnswers; currentStep: number; updatedAt: string };
    } catch {
      return null;
    }
  },

  // Clear draft
  clearDraft: () => {
    localStorage.removeItem('asgard_discovery_draft');
  },

  // Submit valid answers (Simulated API call for Assignment C)
  submitAnswers: async (answers: DiscoveryAnswers): Promise<DiscoveryResult[]> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 5% chance to simulate network error for error state testing
        if (Math.random() < 0.05) {
          reject(new Error("Failed to submit assessment answers to Assignment C backend service."));
          return;
        }

        // Logic to return matched roles based on answers
        const results: DiscoveryResult[] = [
          {
            matchPercentage: 94,
            title: "Frontend Development",
            description: "Build user interfaces, interactive web elements, and high-fidelity user experiences.",
            keySkills: ["HTML/CSS", "React", "Tailwind CSS", "Figma"],
            isTopMatch: true,
          },
          {
            matchPercentage: 88,
            title: "Full-Stack Developer",
            description: "Handle both frontend visual elements and backend system architecture.",
            keySkills: ["Node.js", "SQL", "APIs", "Python"],
          },
          {
            matchPercentage: 82,
            title: "AI Workflow Automation",
            description: "Connect digital tools and automate repetitive tasks using smart endpoints.",
            keySkills: ["Python", "AI APIs", "Automation", "Workflows"],
          },
        ];

        // Save active recommendation to localStorage for Dashboard & Settings
        localStorage.setItem('asgard_active_role', JSON.stringify(results[0]));
        resolve(results);
      }, 1200);
    });
  },
};