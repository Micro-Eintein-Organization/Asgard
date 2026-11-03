export function careerSummary(description: string) {
  const sentence = description.trim().split(/(?<=[.!?])\s+/)[0];
  if (sentence.length <= 160) return sentence;
  return sentence.slice(0, 157).replace(/\s+\S*$/, "").trimEnd() + "…";
}
