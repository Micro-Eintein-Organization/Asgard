import { useState } from "react";
import { BookOpen, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EntryChoice({onSelectChoice}:{onSelectChoice:(choice:"wizard"|"catalog")=>void}) {
  const [choice,setChoice] = useState<"wizard"|"catalog"|null>(null);
  return <section className="discovery-page entry-page">
    <div className="discovery-header"><h1>How would you like to begin?</h1><p>Follow your curiosity. You can explore careers with or without Discovery.</p></div>
    <fieldset><legend className="sr-only">Choose your path</legend><div className="choice-grid entry-choices">
      {([{id:"wizard",title:"Guided Discovery",description:"Answer five questions about your interests, experience, and goals to explore career suggestions.",icon:Compass},{id:"catalog",title:"Browse careers",description:"Explore careers and learning roadmaps without answering the questions.",icon:BookOpen}] as const).map(item => <label key={item.id} className="choice-card"><input type="radio" name="entry-path" value={item.id} checked={choice===item.id} onChange={()=>setChoice(item.id)} /><item.icon size={30} aria-hidden="true" /><strong>{item.title}</strong><span>{item.description}</span></label>)}
    </div></fieldset>
    <div className="action-row centered entry-actions mt-8"><Button disabled={!choice} onClick={()=>choice && onSelectChoice(choice)}>Continue</Button></div>
    <p className="landing-note centered">Answers save to your account. Active answers and learning context can be sent to Groq for suggestions. Names and contact details are excluded.</p>
  </section>;
}
