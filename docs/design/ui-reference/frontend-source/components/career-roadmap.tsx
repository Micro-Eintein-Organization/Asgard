'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Check, CheckCircle2, ChevronDown, Circle, Compass, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { findTopicContext, getCareer, type AppState, type TopicStatus } from '@/lib/catalog';

type Navigate = (screen: 'welcome' | 'dashboard' | 'discovery' | 'results' | 'catalog' | 'career' | 'settings', career?: string, topic?: string) => void;
type Perform = (action: string, payload?: unknown) => Promise<boolean>;
const statusLabels: Record<TopicStatus,string> = { 'not-started':'Not started',learning:'In progress',done:'Done',skipped:'Skipped' };

export function RoadmapTopicDetails({ topicId, state, busy, perform, error }: { topicId:string;state:AppState;busy:boolean;perform:Perform;error:string }) {
  const context = findTopicContext(topicId);
  if (!context) return <div className="roadmap-panel-empty"><BookOpen size={28}/><h2>Topic details</h2><p>Select a topic to see its overview, learning outcome, and resources.</p></div>;
  const { topic, career, milestone } = context;
  const status = state.statuses[topic.id] || 'not-started';
  return <div className="roadmap-topic-content">
    <div className="detail-panel-title"><p>{milestone.title}</p><h2>{topic.title}</h2><span className={`detail-status detail-status-${status}`}>{statusLabels[status]}</span></div>
    <section className="detail-section"><h3>Overview</h3><p>{topic.explanation}</p></section>
    <section className="detail-section"><h3>Target skills & learning outcome</h3><p>{topic.outcome}</p><div className="skill-tags">{career.skills.map(skill => <span key={skill}>{skill}</span>)}</div></section>
    <section className="detail-section"><h3>Tools and setup</h3><p>{topic.tools}</p></section>
    <section className="detail-section detail-resources"><h3>Links & Resources</h3>{topic.resources.map(resource => <a href={resource.url} target="_blank" rel="noopener noreferrer" key={resource.url}><span>{resource.title}</span><small>{resource.publisher} · Free</small><ExternalLink size={15}/></a>)}</section>
    <section className="detail-progress" aria-label="Topic progress">
      {error && <p className="validation" role="alert">{error}</p>}
      {state.currentCareer !== career.id && <p className="detail-focus-note">Set this roadmap as current to mark a topic Learning. Done and Skip are still available.</p>}
      <button className="mark-done-button" disabled={busy || status === 'done'} onClick={() => void perform('topic',{topicId:topic.id,status:'done'})}>{status === 'done' ? <><Check size={16}/>Marked as Done</> : 'Mark as Done'}</button>
      <div className="detail-secondary-actions">{(['learning','skipped','not-started'] as const).map(value => <button className="secondary" key={value} disabled={busy || status === value || value === 'learning' && state.currentCareer !== career.id} onClick={() => void perform('topic',{topicId:topic.id,status:value})}>{value === 'learning' ? 'Learning' : value === 'skipped' ? 'Skip' : 'Clear'}</button>)}</div>
      <p className="detail-footnote">Progress is self-reported. Reading or opening a link doesn’t change it.</p>
    </section>
  </div>;
}

export default function CareerRoadmap({ careerId, topicId, state, busy, perform, go, error }: { careerId:string;topicId:string|null;state:AppState;busy:boolean;perform:Perform;go:Navigate;error:string }) {
  const [hideDone,setHideDone] = useState(false);
  const [expandedAbout,setExpandedAbout] = useState(true);
  const career = getCareer(careerId);
  if (!career) return <section className="empty-page"><h1>This career is unavailable.</h1><button onClick={() => go('catalog')}>Return to Careers</button></section>;
  const topics = career.milestones.flatMap(m => m.topics);
  const selected = topics.find(t => t.id === topicId) || topics.find(t => state.statuses[t.id] === 'learning') || topics[0];
  const done = topics.filter(t => state.statuses[t.id] === 'done').length;
  const percent = topics.length ? Math.round(done / topics.length * 100) : 0;
  const current = state.currentCareer === career.id;
  return <section className="profession-page">
    <div className="profession-main">
      <div className="profession-change"><Compass size={27}/><p>Want a new profession? You can browse other careers here.<br/>Your current learning progress will be saved.</p><button className="secondary" disabled={busy} onClick={() => go('catalog')}>Change Profession</button></div>
      <section className="profession-hero"><p>Software and AI</p><h1>{career.title}</h1><div className="profession-progress"><span>{done} of {topics.length} topics done</span><progress value={percent} max={100} aria-label={`${career.title} roadmap completion`}/><strong>{percent}%</strong></div></section>
      <div className="profession-about"><h2>Learning objectives</h2><p>{topics.length ? 'Understand how websites work, structure and style an accessible page, and add a useful JavaScript interaction. Work toward a small responsive resource page.' : career.example}</p><h2>Description</h2><p>{career.description}</p>{expandedAbout && <><ul>{career.activities.map(activity => <li key={activity}>{activity}</li>)}</ul><p className="profession-example"><strong>Example project:</strong> {career.example}</p></>}<button className="text-button about-toggle" aria-expanded={expandedAbout} onClick={() => setExpandedAbout(!expandedAbout)}>{expandedAbout ? 'See less' : 'Read more'}<ChevronDown size={15} className={expandedAbout ? 'expanded-chevron' : ''}/></button></div>
      {topics.length ? <>
        <div className="milestones-heading"><h2>Milestones</h2><button className="text-button" aria-pressed={hideDone} onClick={() => setHideDone(!hideDone)}>{hideDone ? 'Show completed' : 'Hide completed'}</button></div>
        <div className="profession-focus"><button className={current ? 'current-button' : 'secondary'} disabled={current || busy} onClick={() => void perform('focus',{careerId:career.id})}>{current ? <><Check size={15}/>Current roadmap</> : 'Set as current'}</button><p>Open any topic. The order is guidance, and topics are never locked.</p></div>
        <div className="milestone-cards">{career.milestones.map((milestone,index) => {
          const visible = milestone.topics.filter(topic => !hideDone || state.statuses[topic.id] !== 'done');
          return <section className="profession-milestone" key={milestone.id}><h3>{index+1}. {milestone.title}</h3><p>{milestone.description}</p><details open={index === 0 || milestone.topics.some(topic => topic.id === selected?.id)}><summary>View milestone details<ChevronDown size={15}/></summary><div className="milestone-topic-list">{visible.length ? visible.map(topic => { const status = state.statuses[topic.id] || 'not-started'; const active = selected?.id === topic.id; return <button key={topic.id} className={`milestone-topic milestone-topic-${status}${active ? ' selected-topic' : ''}`} aria-pressed={active} onClick={() => go('career',career.id,topic.id)}><span className={`milestone-status-icon milestone-status-${status}`}>{status === 'done' ? <Check size={23}/> : status === 'skipped' ? <EyeOff size={20}/> : <Circle size={20}/>}</span><span><strong>{topic.title}</strong><small>{statusLabels[status]}</small></span><Eye className="topic-eye" size={20}/></button>; }) : <p className="milestone-hidden-note">All topics in this milestone are completed. Choose Show completed to view them.</p>}</div></details></section>;
        })}</div>
      </> : <div className="empty-card"><BookOpen size={27}/><h2>A career preview for now</h2><p>This role’s roadmap is not included in the limited prototype.</p><button onClick={() => go('career','frontend')}>Open Frontend roadmap<ArrowRight size={15}/></button></div>}
      <button className="text-button profession-back" onClick={() => go('catalog')}><ArrowLeft size={15}/>Back to catalog</button>
    </div>
    <aside className="profession-panel" id="roadmap-topic-details" aria-label="Selected topic details" tabIndex={-1}>{selected ? <RoadmapTopicDetails topicId={selected.id} state={state} busy={busy} perform={perform} error={error}/> : <div className="roadmap-panel-empty"><BookOpen size={28}/><h2>Career preview</h2><p>Choose the Frontend roadmap to explore learning topics and resources.</p></div>}</aside>
  </section>;
}
