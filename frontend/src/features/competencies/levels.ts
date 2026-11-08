export const experienceLevels = [
  "No experience reported",
  "Familiar with concepts",
  "Basic tasks with guidance",
  "Ordinary tasks independently",
  "Advanced tasks/troubleshooting",
];
export function experienceLabel(recorded: boolean, level: number | null) {
  if (!recorded) return "Not recorded";
  return level === null ? "Not sure yet" : experienceLevels[level];
}
