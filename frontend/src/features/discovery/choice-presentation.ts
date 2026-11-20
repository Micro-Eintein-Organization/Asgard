import { Blocks, ChartNoAxesCombined, Check, CircleHelp, CodeXml, Compass, Cpu, Database, FileText, Lightbulb, Network, Palette, Search, ShieldCheck, Sprout, Wrench } from "lucide-react";

const fields = {
  build: { icon: CodeXml, description: "Create useful apps, websites, or games people can interact with." },
  data: { icon: ChartNoAxesCombined, description: "Explore information, find patterns, and explain what they mean." },
  design: { icon: Palette, description: "Shape how a product looks, feels, and works for the people using it." },
  security: { icon: ShieldCheck, description: "Investigate risks and help protect systems and information." },
  infrastructure: { icon: Network, description: "Connect devices and keep services reliable and available." },
  devices: { icon: Cpu, description: "Explore electronics and the software that makes devices work." },
};

export function choicePresentation(question: string, option: string, description: string) {
  if (option === "unsure" || option === "both") return { icon: option === "both" ? Blocks : CircleHelp,
    description: description || "Keep your options open as you explore different kinds of work." };
  if (question === "interests" && option in fields) return fields[option as keyof typeof fields];
  if (question === "experience_preference") return option === "use_experience"
    ? { icon: FileText, description: "Connect saved skills or a resume to the work you want to explore." }
    : { icon: Sprout, description: "Explore from the beginning. No skills or resume needed." };
  const field = question.replace("activities_", "");
  const icon = field in fields ? fields[field as keyof typeof fields].icon
    : option.includes("data") ? Database : option.includes("test") ? Wrench
      : question.startsWith("scenario_") ? Lightbulb : question.startsWith("bridge_") ? Compass : Search;
  return { icon, description };
}

export { Check };
