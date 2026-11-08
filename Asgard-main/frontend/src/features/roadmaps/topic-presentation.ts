const headings = /^(Overview|What you'll learn|Subtopics|Learning outcome|Tools and setup|Practice|Completion check)$/gm;

// These labels are emitted by convert_guide_v4.py inside published explanation
// text. Older free-form topics retain their complete explanation as the overview.
export function topicPresentation(explanation: string) {
  const text = explanation.replace(/\r\n?/g, "\n").trim();
  const matches = [...text.matchAll(headings)];
  const overview: string[] = [];
  const sections: Record<string, string[]> = {};
  if (!matches.length) overview.push(text);
  else {
    const introduction = text.slice(0, matches[0].index).trim();
    if (introduction) overview.push(introduction);
    matches.forEach((match, index) => {
      const body = text.slice(match.index! + match[0].length, matches[index + 1]?.index ?? text.length).trim();
      if (match[1] === "Overview") overview.push(body);
      else if (match[1] === "What you'll learn" || match[1] === "Subtopics") overview.push(match[1] + "\n" + body);
      else (sections[match[1]] ??= []).push(body);
    });
  }
  return {
    overview: overview.join("\n\n"),
    outcome: sections["Learning outcome"]?.join("\n\n"),
    setup: sections["Tools and setup"]?.join("\n\n"),
    practice: sections.Practice?.join("\n\n"),
    completion: sections["Completion check"]?.join("\n\n"),
  };
}
