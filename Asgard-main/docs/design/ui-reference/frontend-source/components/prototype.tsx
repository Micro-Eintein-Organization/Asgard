'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Check, CheckCircle2, ChevronDown, Circle, Code2, Compass, Database, ExternalLink, LayoutTemplate, ListChecks, LoaderCircle, Network, Pencil, Search, Settings2, UserRound, Users, Workflow, X } from 'lucide-react';
import { allTopics, careers, categories, discoveryQuestions, findTopicContext, getCareer, getTopic, type Answers, type AppState, type Career, type TopicStatus } from '@/lib/catalog';
import ActivityCalendar from './activity-calendar';
import CareerRoadmap from './career-roadmap';

type Screen = 'welcome' | 'dashboard' | 'discovery' | 'results' | 'catalog' | 'career' | 'settings';
type Perform = (action: string, payload?: unknown) => Promise<boolean>;
type Navigate = (screen: Screen, career?: string, topic?: string) => void;
type Conflict = { topicId: string; action: string; payload: Record<string, unknown> };
const labels: Record<TopicStatus, string> = { 'not-started': 'Not started', learning: 'In progress', done: 'Done', skipped: 'Skipped' };
const icons: Record<string, typeof Code2> = { code: Code2, layout: LayoutTemplate, search: Search, network: Network, compass: Compass, workflow: Workflow, list: ListChecks, users: Users, book: BookOpen };

function Modal({ title, onClose, children, className = '' }: { title: string; onClose: () => void; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { const dialog = ref.current; dialog?.showModal(); return () => { dialog?.close(); }; }, []);
  return <dialog ref={ref} className={`modal ${className}`} aria-label={title} onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="modal-heading"><h2>{title}</h2><button className="icon-button" aria-label="Close dialog" onClick={onClose}><X size={20} /></button></div>{children}
  </dialog>;
}

export default function Prototype() {
  const [state, setState] = useState<AppState | null>(null);
  const [screen, setScreen] = useState<Screen>('dashboard');
  const [careerId, setCareerId] = useState('frontend');
  const [topicId, setTopicId] = useState<string | null>(null);
  const [configured, setConfigured] = useState(false);
  const [model, setModel] = useState('gemini-2.5-flash');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [conflict, setConflict] = useState<Conflict | null>(null);
  const busyRef = useRef(false);
  const stateRef = useRef<AppState | null>(null);

  function accept(next: AppState) { stateRef.current = next; setState(next); }

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const response = await fetch('/api/state', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      accept(data.state); setConfigured(data.configured); setModel(data.model);
      const params = new URLSearchParams(window.location.search);
      const view = params.get('view');
      setScreen(['welcome','dashboard','discovery','results','catalog','career','settings'].includes(view || '') ? view as Screen : data.state.entered ? 'dashboard' : 'welcome');
      setCareerId(params.get('career') || 'frontend'); setTopicId(params.get('topic'));
    } catch (error) { setError(error instanceof Error ? error.message : 'Could not load the local profile.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    const pop = () => {
      const params = new URLSearchParams(window.location.search);
      const view = params.get('view');
      setScreen(['welcome','dashboard','discovery','results','catalog','career','settings'].includes(view || '') ? view as Screen : stateRef.current?.entered ? 'dashboard' : 'welcome');
      setCareerId(params.get('career') || 'frontend'); setTopicId(params.get('topic'));
    };
    window.addEventListener('popstate', pop); return () => window.removeEventListener('popstate', pop);
  }, []);
  useEffect(() => { if (!notice) return; const timeout = window.setTimeout(() => setNotice(''), 3500); return () => window.clearTimeout(timeout); }, [notice]);

  const go: Navigate = (view, career, topic) => {
    if (busyRef.current) return;
    const params = new URLSearchParams({ view });
    if (career) params.set('career', career);
    if (topic) params.set('topic', topic);
    window.history.pushState(null, '', `/?${params}`);
    setScreen(view); if (career) setCareerId(career); setTopicId(topic || null); setError('');
    if (view === 'career' && screen === 'career' && topic) {
      if (window.innerWidth < 980) window.requestAnimationFrame(() => document.getElementById('roadmap-topic-details')?.scrollIntoView({ block: 'start', behavior: 'smooth' }));
    } else window.scrollTo({ top: 0 });
  };

  const perform: Perform = async (action, payload) => {
    if (busyRef.current || !stateRef.current) return false;
    busyRef.current = true; setBusy(true); setError('');
    try {
      const response = await fetch('/api/state', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, payload, version: stateRef.current.version }) });
      const data = await response.json();
      if (!response.ok) {
        if (data.details?.code === 'active-topic') setConflict({ topicId: data.details.topicId, action, payload: payload as Record<string, unknown> });
        else {
          setError(data.error || 'The change could not be saved.');
          if (data.details?.code === 'stale-state') {
            const latest = await fetch('/api/state', { cache: 'no-store' });
            if (latest.ok) accept((await latest.json()).state);
          }
        }
        return false;
      }
      accept(data.state);
      if (!['save-discovery','enter'].includes(action)) setNotice(action === 'recommend' ? 'Suggestions saved.' : 'Changes saved.');
      return true;
    } catch { setError('Could not reach the local server. Your previous saved data is unchanged.'); return false; }
    finally { busyRef.current = false; setBusy(false); }
  };

  const closeTopic = () => { setTopicId(null); const url = new URL(window.location.href); url.searchParams.delete('topic'); window.history.replaceState(null, '', url); };

  return <div className={`prototype${screen === 'dashboard' ? ' dashboard-reference' : screen === 'career' ? ' roadmap-reference' : screen === 'discovery' || screen === 'results' ? ' discovery-reference' : ''}`}>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header"><div className="header-inner">
      <a className="brand" href="/?view=dashboard" onClick={event => { event.preventDefault(); go('dashboard'); }}>Asgard</a>
      <nav aria-label="Main navigation">
        {([['dashboard','Dashboard'], ['catalog','Roadmap'], ['settings','Settings']] as const).map(([view, label]) => <a key={view} aria-current={screen === view || view === 'catalog' && screen === 'career' ? 'page' : undefined} href={`/?view=${view}`} onClick={event => { event.preventDefault(); go(view); }}>{label}</a>)}
      </nav>
      <span className="local-label">Local prototype</span>
      <details className="account-menu"><summary aria-label="Open local profile menu"><UserRound size={21} /></summary><div className="menu-popover"><strong>{state?.profile.firstName || 'Local testing account'}</strong><p>Single-account workspace</p><a href="/?view=settings">Edit profile</a><a href="/?view=discovery">Open Discovery</a><a href="/?view=settings">Settings</a></div></details>
    </div></header>
    {busy && <div className="save-indicator" role="status"><LoaderCircle size={14} className="spin" />{screen === 'results' ? 'Working on your request…' : 'Saving…'}</div>}
    {error && <div className="alert error" role="alert"><span>{error}</span><button className="icon-button" onClick={() => setError('')} aria-label="Dismiss error"><X size={17}/></button></div>}
    {notice && <div className="toast" role="status"><Check size={16} />{notice}</div>}
    <main id="main">
      {loading ? <div className="loading-page"><LoaderCircle size={25} className="spin"/><p>Opening your local workspace…</p></div> : !state ? <section className="empty-page"><Database size={32}/><h1>Start your local workspace</h1><p>{error || 'The database is not available yet.'}</p><div className="code-instructions"><code>npm run setup</code><code>npm run dev</code></div><button onClick={() => void load()}>Retry connection</button></section> : <>
        {screen === 'welcome' && <Welcome state={state} busy={busy} go={go} perform={perform} />}
        {screen === 'dashboard' && <Dashboard state={state} busy={busy} go={go} perform={perform} />}
        {screen === 'discovery' && <Discovery state={state} busy={busy} go={go} perform={perform} />}
        {screen === 'results' && <Results state={state} busy={busy} go={go} perform={perform} configured={configured} error={error} />}
        {screen === 'catalog' && <Catalog state={state} go={go} />}
        {screen === 'career' && <CareerRoadmap key={careerId} careerId={careerId} topicId={topicId} state={state} busy={busy} go={go} perform={perform} error={error} />}
        {screen === 'settings' && <Settings state={state} busy={busy} perform={perform} go={go} configured={configured} model={model} reload={load} />}
      </>}
    </main>
    <footer className="site-footer"><span>Asgard · Local learning workspace</span><span>2 career previews · 1 introductory roadmap</span></footer>
    {state && topicId && screen !== 'career' && <TopicPanel topicId={topicId} state={state} busy={busy} perform={perform} close={closeTopic} error={error} />}
    {conflict && <Modal title="Finish or clear your current topic" onClose={() => { if (!busy) setConflict(null); }}>
      {error && <p className="validation" role="alert">{error}</p>}
      <p>You’re currently learning <strong>{getTopic(conflict.topicId)?.title}</strong>. Choose how to leave it before continuing.</p>
      <p className="muted">Your requested change will save together with this choice.</p>
      <div className="conflict-options">{([['done','Mark Done'],['skipped','Skip for now'],['not-started','Clear progress']] as const).map(([resolution,label]) => <button className="secondary" key={resolution} disabled={busy} onClick={async () => { if (await perform(conflict.action, { ...conflict.payload, resolution })) setConflict(null); }}>{label}</button>)}</div>
      <button className="text-button" disabled={busy} onClick={() => setConflict(null)}>Cancel change</button>
    </Modal>}
  </div>;
}

type Shared = { state: AppState; busy: boolean; go: Navigate; perform: Perform };

function Welcome({ state, busy, go, perform }: Shared) {
  const [choice, setChoice] = useState<'guided' | 'browse' | null>(null);
  return <section className="welcome-page">
    <div className="section-intro centered"><p className="eyebrow">Getting started</p><h1>How would you like to begin?</h1><p>Choose a path. You can switch anytime.</p></div>
    <div className="entry-cards">{(['guided','browse'] as const).map(value => { const Icon = value === 'guided' ? Compass : BookOpen; return <button key={value} className={`choice-card entry-card ${choice === value ? 'selected' : ''}`} aria-pressed={choice === value} onClick={() => setChoice(value)}><span className="selection-label">{choice === value ? <><Check size={13}/> Selected</> : 'Choose a path'}</span><span className="illustration"><Icon size={34} strokeWidth={1.4}/></span><strong>{value === 'guided' ? 'Guided Discovery' : 'Free Browsing'}</strong><span>{value === 'guided' ? 'Explore your interests through five short rounds.' : 'Explore the career catalog and choose your own starting point.'}</span></button>; })}</div>
    <button className="wide-button" disabled={!choice || busy} onClick={async () => { if (await perform('enter')) go(choice === 'guided' ? 'discovery' : 'catalog'); }}>Continue <ArrowRight size={16}/></button>
    {state.discovery.step > 0 && <button className="text-button" onClick={() => go('discovery')}>Resume saved Discovery</button>}
    <p className="small muted">This local prototype opens directly in your testing profile.</p>
  </section>;
}

function Discovery({ state, busy, go, perform }: Shared) {
  const [step, setStep] = useState(Math.min(state.discovery.step, 4));
  const [answers, setAnswers] = useState<Answers>(state.discovery.answers);
  const [validation, setValidation] = useState('');
  const question = discoveryQuestions[step];
  const selected = answers[question.id] || [];
  const cardOptions = step < 3 ? question.options.filter(option => option.id !== 'unsure') : question.options;
  const extraUncertainty = step < 3 ? question.options.find(option => option.id === 'unsure') : undefined;
  const badgeLabels = ['Domain', 'Focus', 'Style', 'Skill base', 'Goal'];
  const pick = (id: string) => {
    let values: string[];
    if (!question.multiple || id === 'unsure') values = selected.includes(id) ? [] : [id];
    else values = selected.includes(id) ? selected.filter(value => value !== id) : [...selected.filter(value => value !== 'unsure'), id];
    setAnswers({ ...answers, [question.id]: values }); setValidation('');
  };
  const save = (target: number, completed = false) => perform('save-discovery', { answers, step: target, completed });
  useEffect(() => { document.getElementById('question-title')?.focus(); }, [step]);
  return <section className="discovery-page">
    <div className="discovery-nav"><button className="secondary small-button" disabled={busy} onClick={async () => { if (await save(Math.max(0, step - 1))) { if (step === 0) go('welcome'); else setStep(step - 1); } }}><ArrowLeft size={15}/>Back</button><button className="text-button muted" disabled={busy} onClick={async () => { if (await save(step)) go('catalog'); }}>Skip to Free Browsing <ArrowRight size={15}/></button></div>
    <div className="section-intro centered"><h1 className="discovery-title">Discovery</h1><StepIndicator step={step}/><p className="round-label sr-only">Round {step + 1} of 5 · {question.eyebrow}</p><h2 id="question-title" tabIndex={-1}>{question.title}</h2><p>{question.description}</p></div>
    <div className="answer-cards" role="group" aria-labelledby="question-title">{cardOptions.map(option => { const active = selected.includes(option.id); return <button disabled={busy} key={option.id} aria-pressed={active} className={`choice-card answer-card ${active ? 'selected' : ''}`} onClick={() => pick(option.id)}><span className="selection-label">{active ? 'Selected' : badgeLabels[step]}</span><span className="illustration" aria-hidden="true"/><strong>{option.title}</strong><span>{option.description}</span></button>; })}</div>
    {extraUncertainty && <button className={`uncertainty-choice${selected.includes('unsure') ? ' selected-uncertainty' : ''}`} disabled={busy} aria-pressed={selected.includes('unsure')} onClick={() => pick('unsure')}>{selected.includes('unsure') && <Check size={14}/>} {extraUncertainty.title}</button>}
    {validation && <p role="alert" className="validation">{validation}</p>}
    <div className="centered action-area"><button disabled={busy} onClick={async () => { if (!selected.length) { setValidation('Choose an answer, or select unsure to continue.'); return; } if (await save(step + 1, step === 4)) { if (step === 4) go('results'); else setStep(step + 1); } }}>{busy ? 'Saving…' : 'Confirm And Proceed'}</button><p className="small muted">Answers are saved when you continue, go back, or skip.</p></div>
  </section>;
}

function StepIndicator({ step }: { step: number }) { return <div className="step-indicator" aria-label={`Step ${step + 1} of 6`}>{Array.from({ length: 6 }, (_, index) => <span key={index} className={index <= step ? 'filled' : ''}/>)}</div>; }

function Results({ state, busy, go, perform, configured, error }: Shared & { configured: boolean; error: string }) {
  const results = state.recommendations;
  const stale = results && results.inputRevision !== state.discovery.revision;
  const [selection, setSelection] = useState<string | null>(null);
  const attemptedRevision = useRef<number | null>(null);
  const selected = results?.items.find(item => item.careerId === selection) || results?.items[0];
  useEffect(() => {
    if (!configured || busy || !state.discovery.completed || results && !stale || attemptedRevision.current === state.discovery.revision) return;
    attemptedRevision.current = state.discovery.revision;
    void perform('recommend');
  }, [configured, busy, state.discovery.completed, state.discovery.revision, results, stale, perform]);
  return <section className="results-page">
    <button className="secondary small-button" disabled={busy} onClick={() => go('discovery')}><ArrowLeft size={15}/>Back to answers</button>
    <div className="section-intro centered"><h1 className="discovery-title">Discovery</h1><StepIndicator step={5}/><h2>Here are some directions to explore!</h2><p>These suggestions are starting points based on your answers.</p></div>
    <div className="catalog-notice"><Compass size={18}/><span>This prototype contains two software careers. These suggestions are not a comparison with every technology career.</span></div>
    {!state.discovery.completed ? <div className="empty-card"><h2>Finish your Discovery first</h2><p>Your saved answers are ready to resume.</p><button onClick={() => go('discovery')}>Resume Discovery</button></div> : !configured ? <div className="empty-card configuration-card"><Settings2 size={26}/><h2>Configure Gemini to generate recommendations</h2><p>Your five rounds are saved. Add your API key locally whenever you’re ready.</p><button className="secondary" onClick={() => go('settings')}>Open setup instructions</button></div> : <div className="recommendation-controls centered">{busy ? <p role="status"><LoaderCircle size={18} className="spin"/>Finding directions from your answers…</p> : <button className="text-button" onClick={() => void perform('recommend')}>{error ? 'Retry recommendations' : results ? 'Refresh suggestions' : 'Generate my suggestions'}<ArrowRight size={15}/></button>}</div>}
    {stale && <p className="inline-notice">These saved suggestions are from earlier answers. Refresh them to use your latest answers.</p>}
    {results && <><div className="result-cards">{results.items.map(item => { const career = getCareer(item.careerId); if (!career) return null; const active = selected?.careerId === career.id; return <button type="button" className={`result-card${active ? ' selected-result' : ''}`} key={item.careerId} aria-pressed={active} onClick={() => setSelection(career.id)}><span className="tag">{active ? 'Selected direction' : 'Direction to explore'}</span><strong className="result-career-title">{career.title}</strong><span className="result-description">{career.description}</span><strong className="result-reason-label">Why this appeared</strong><span className="result-reason">{item.reason}</span><strong className="result-skills-label">Key skills</strong><span className="skill-tags">{career.skills.map(skill => <span key={skill}>{skill}</span>)}</span></button>; })}</div><p className="small muted centered">Saved {new Date(results.generatedAt).toLocaleString()} · {results.model}</p></>}
    <div className="button-row centered"><button className="secondary" disabled={busy} onClick={async () => { if (await perform('save-discovery', { ...state.discovery, step: 0, completed: false })) go('discovery'); }}>Retake Discovery</button><button disabled={busy} onClick={() => selected ? go('career',selected.careerId) : go('catalog')}>{selected ? getCareer(selected.careerId)?.milestones.length ? 'Proceed to Roadmap' : 'View Selected Career' : 'Browse Careers'}</button></div>
    <button className="text-button centered-link" onClick={() => go('settings')}>Set up your profile <span className="muted">(optional)</span></button>
  </section>;
}

function Catalog({ state, go }: { state: AppState; go: Navigate }) {
  const [category, setCategory] = useState(state.profile.preferredField || 'software-ai');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const visible = careers.filter(c => (!category || c.category === category) && `${c.title} ${c.skills.join(' ')}`.toLowerCase().includes(query.toLowerCase().trim()));
  return <section className="catalog-page page-width">
    <div className="page-heading"><div><p className="eyebrow">Find a direction</p><h1>Role Catalog</h1></div><button disabled={!selected} onClick={() => selected && go('career', selected)}>View career & roadmap <ArrowRight size={16}/></button></div>
    <label className="search-field"><Search size={19}/><span className="sr-only">Search career roles or skills</span><input value={query} onChange={e => { setQuery(e.target.value); setSelected(null); }} placeholder="Search career roles or skills…"/>{query && <button className="icon-button" onClick={() => { setQuery(''); setSelected(null); }} aria-label="Clear search"><X size={16}/></button>}</label>
    <div className="category-filters" aria-label="Career categories">{[{ id: '', name: 'All fields' }, ...categories].map(c => <button key={c.id} className={category === c.id ? 'active' : ''} aria-pressed={category === c.id} onClick={() => { setCategory(c.id); setSelected(null); }}>{c.name}</button>)}</div>
    <div className="catalog-description"><p>{categories.find(c => c.id === category)?.description || 'Explore the available career previews, independently of your Discovery results.'}</p>{state.currentCareer && <button className="text-button" onClick={() => go('career', state.currentCareer!)}>Current: {getCareer(state.currentCareer)?.title}<ArrowRight size={15}/></button>}</div>
    {visible.length ? <div className="career-grid">{visible.map(c => <button key={c.id} className={`career-card ${selected === c.id ? 'selected' : ''}`} aria-pressed={selected === c.id} onClick={() => setSelected(c.id)}><span className="selection-label">{selected === c.id ? <><Check size={13}/>Selected</> : c.milestones.length ? 'Introductory roadmap' : 'Career preview'}</span><span className="career-icon">{c.id === 'frontend' ? <LayoutTemplate size={28} strokeWidth={1.3}/> : <Database size={28} strokeWidth={1.3}/>}</span><strong>{c.title}</strong><span>{c.description}</span><span className="skill-tags">{c.skills.slice(0,3).map(skill => <span key={skill}>{skill}</span>)}</span><span className="small muted">{c.milestones.length ? `${allTopics.length} topics · Start with the foundations` : 'Roadmap not included in this prototype'}</span></button>)}</div> : <div className="empty-card"><Search size={25}/><h2>No careers match this view</h2><p>{category && category !== 'software-ai' ? 'This prototype only has roles in Software and AI. Other category content will be added later.' : 'Try another title or skill, or clear your filters.'}</p><button className="secondary" onClick={() => { setQuery(''); setCategory(''); setSelected(null); }}>Clear search and filters</button></div>}
    <p className="small muted catalog-footnote">Career previews help you explore. Selecting a card does not change your current learning focus.</p>
  </section>;
}

function Dashboard({ state, busy, go, perform }: Shared) {
  const career = state.currentCareer ? getCareer(state.currentCareer) : undefined;
  const active = Object.keys(state.statuses).find(id => state.statuses[id] === 'learning');
  const topics = career?.milestones.flatMap(m => m.topics) || [];
  const next = topics.find(t => !['done','skipped'].includes(state.statuses[t.id] || 'not-started'));
  const context = active ? findTopicContext(active) : next ? findTopicContext(next.id) : undefined;
  const milestone = context?.milestone || career?.milestones.at(-1);
  const milestoneDone = milestone?.topics.filter(t => state.statuses[t.id] === 'done').length || 0;
  const percent = milestone ? Math.round(milestoneDone / milestone.topics.length * 100) : 0;
  const complete = topics.length > 0 && topics.every(t => state.statuses[t.id] === 'done');
  return <section className="dashboard-page page-width">
    <h1 className="sr-only">Main Dashboard</h1>
    <div className="dashboard-layout"><aside className="supporting-column">
      <section className="support-card"><div className="row-between"><span className="small">Role</span><button className="text-button small" onClick={() => go('catalog')}>edit <Pencil size={13}/></button></div><h2 className="role-title">{career?.title || 'Choose your focus'}</h2><p>{career ? career.description : 'Explore the catalog and set a roadmap as current when you’re ready.'}</p>{!career && <button className="secondary" onClick={() => go('catalog')}>Go to Careers<ArrowRight size={15}/></button>}</section>
      <ActivityCalendar state={state}/>
      {!state.profile.firstName && <section className="profile-prompt"><button disabled={busy} onClick={() => go('settings')}>Profile Enrichment</button>{!state.profile.helperDismissed && <div className="helper"><button className="icon-button" aria-label="Dismiss profile suggestion" onClick={() => void perform('dismiss-helper')}><X size={14}/></button><p>Add a little about yourself. Complete your profile whenever you’re ready.</p></div>}</section>}
      <button className="text-button dashboard-discovery-link" onClick={() => go(state.discovery.completed ? 'results' : 'discovery')}><Compass size={14}/>{state.discovery.completed ? 'Discovery results' : Object.keys(state.discovery.answers).length ? 'Resume Discovery' : 'Start Discovery'}</button>
    </aside><div className="learning-area">
      <section className="milestone-card"><h2>{milestone?.title || 'Find a path worth exploring.'}</h2><p className="sr-only">{milestone?.description || 'Browse two career previews and try a short Frontend roadmap.'}</p><button className="milestone-link" disabled={busy} onClick={() => { if (!career) go('catalog'); else if (active || next) go('career',career.id,active || next?.id); else go('career',career.id); }}>{career ? active || next ? 'continue' : 'view roadmap' : 'explore careers'}<span aria-hidden="true">&gt;</span></button>{milestone && <div className="progress-area"><div className="row-between"><span className="sr-only">{milestoneDone} of {milestone.topics.length} topics done</span><strong>{percent}%</strong></div><progress value={percent} max={100} aria-label={`${milestone.title} completion`}/></div>}</section>
      {!career ? <div className="empty-card"><BookOpen size={28}/><h2>No current roadmap yet</h2><p>Opening a career doesn’t choose it for you. Use Set as current on a roadmap to begin tracking a learning focus.</p></div> : <>
        <div className="learning-heading"><h2>{career.title} foundations</h2><button className="text-button" onClick={() => go('career',career.id)}>Open roadmap<ArrowRight size={15}/></button></div>
        {complete && <div className="inline-notice success"><CheckCircle2 size={19}/><div><strong>You’ve marked every topic Done.</strong><p>This records your completion, not a verified skill level.</p><button className="text-button" onClick={() => go('catalog')}>Explore other careers<ArrowRight size={14}/></button></div></div>}
        {!complete && !next && <div className="inline-notice"><p>No remaining suggested topics. Skipped topics are still unfinished; revisit them in the roadmap.</p><button className="text-button" onClick={() => go('career',career.id)}>Revisit skipped topics</button></div>}
        {(['not-started','learning','done'] as const).map(status => { const list = topics.filter(t => (state.statuses[t.id] || 'not-started') === status); return <details className="topic-group" key={status} open><summary><span>{status === 'done' ? 'Complete' : labels[status]}</span><span className="group-count">{list.length}</span><ChevronDown size={16}/></summary><div>{list.length ? list.map(t => <button className="topic-row" key={t.id} onClick={() => go('career',career.id,t.id)}><StatusIcon status={status}/><span><strong>{t.title}</strong><small>{findTopicContext(t.id)?.milestone.title}{t.id === next?.id && status === 'not-started' ? ' · Suggested next' : ''}</small></span><ArrowRight size={16}/></button>) : <p className="group-empty">{status === 'learning' ? 'No active topic. Open a suggested topic when you’re ready.' : status === 'done' ? 'Completed topics will appear here.' : 'No topics waiting to start.'}</p>}</div></details>; })}
      </>}
    </div></div>
  </section>;
}

function StatusIcon({ status }: { status: TopicStatus }) { return status === 'done' ? <CheckCircle2 size={19} className="status-done"/> : status === 'learning' ? <Circle size={19} className="status-learning"/> : status === 'skipped' ? <ArrowRight size={19} className="muted"/> : <Circle size={19} className="status-idle"/>; }

function CareerDetail({ careerId, state, busy, go, perform }: Shared & { careerId: string }) {
  const career = getCareer(careerId);
  if (!career) return <section className="empty-page"><h1>This career is unavailable.</h1><button onClick={() => go('catalog')}>Return to Careers</button></section>;
  const current = state.currentCareer === career.id;
  const topics = career.milestones.flatMap(m => m.topics);
  const done = topics.filter(t => state.statuses[t.id] === 'done').length;
  return <section className="roadmap-page page-width"><button className="text-button muted back-link" onClick={() => go('catalog')}><ArrowLeft size={15}/>Back to catalog</button>
    <div className="page-heading"><div><p className="eyebrow">Software and AI</p><h1>{career.title}</h1><p className="lead">{career.description}</p></div>{topics.length > 0 && <button className={current ? 'current-button' : ''} disabled={current || busy} onClick={() => void perform('focus',{careerId:career.id})}>{current ? <><Check size={17}/>Current roadmap</> : 'Set as current'}</button>}</div>
    <details className="about-career"><summary>About this career <span>Read more</span><ChevronDown size={16}/></summary><div className="about-grid"><div><h3>What the work can involve</h3><ul>{career.activities.map(activity => <li key={activity}>{activity}</li>)}</ul></div><div><h3>A representative project</h3><p>{career.example}</p><div className="skill-tags">{career.skills.map(skill => <span key={skill}>{skill}</span>)}</div></div></div></details>
    {!topics.length ? <div className="empty-card"><BookOpen size={28}/><h2>A career preview for now</h2><p>The Backend roadmap is not included in this small prototype. Explore the complete Frontend introductory path to try topic resources and saved progress.</p><button onClick={() => go('career','frontend')}>Open Frontend roadmap<ArrowRight size={15}/></button></div> : <>
      <div className="roadmap-toolbar"><div><h2>Your introductory path</h2><p>Suggested order, never locked. Open any topic to explore its resources.</p></div><span className="completion-count">{done} / {topics.length} topics done</span></div>
      <div className="roadmap-canvas"><div className="roadmap-start"><span/>Start with the foundations</div>{career.milestones.map((milestone, index) => <section className="roadmap-milestone" key={milestone.id}><div className="milestone-label"><span>{String(index+1).padStart(2,'0')}</span><div><h3>{milestone.title}</h3><p>{milestone.description}</p></div></div><div className="roadmap-nodes">{milestone.topics.map(topic => { const status = state.statuses[topic.id] || 'not-started'; return <button className={`roadmap-node node-${status}`} key={topic.id} onClick={() => go('career',career.id,topic.id)}><StatusIcon status={status}/><span><strong>{topic.title}</strong><small>{topic.summary}</small></span><span className="node-state">{labels[status]}</span><ArrowRight size={17}/></button>; })}</div></section>)}<div className="roadmap-finish"><CheckCircle2 size={20}/><span>Outcome: build a small, accessible resource page.</span></div></div>
      <p className="small muted roadmap-disclaimer">An authored introductory path, not a certification or readiness assessment. Topics are editable self-reported progress.</p>
    </>}
  </section>;
}

function TopicPanel({ topicId, state, busy, perform, close, error }: { topicId: string; state: AppState; busy: boolean; perform: Perform; close: () => void; error: string }) {
  const context = findTopicContext(topicId);
  if (!context) return <Modal title="Topic unavailable" onClose={close}><p>Return to the roadmap and choose an available topic.</p></Modal>;
  const { topic, milestone, career } = context;
  const status = state.statuses[topic.id] || 'not-started';
  return <Modal title={topic.title} onClose={close} className="topic-panel"><div className="topic-context">{career.title}<span>/</span>{milestone.title}</div><span className={`status-label status-${status}`}><StatusIcon status={status}/>{labels[status]}</span><p className="topic-explanation">{topic.explanation}</p><h3>Try this</h3><p>{topic.outcome}</p><h3>Tools and setup</h3><p>{topic.tools}</p><h3>Learning resources</h3><div className="resource-list">{topic.resources.map(resource => <a key={resource.url} href={resource.url} target="_blank" rel="noopener noreferrer"><span className="resource-icon"><BookOpen size={20}/></span><span><strong>{resource.title}</strong><small>{resource.publisher} · Free learning resource</small></span><ExternalLink size={17}/></a>)}</div>
    <div className="topic-actions"><h3>Record your progress</h3><p className="small muted">Opening a resource does not change your status.</p>{error && <p className="validation" role="alert">{error}</p>}{state.currentCareer !== career.id && <p className="inline-notice">Set this roadmap as current before choosing Learning.</p>}<div className="status-actions">{(['learning','done','skipped','not-started'] as const).map(value => <button key={value} className={value === 'learning' ? '' : 'secondary'} disabled={busy || status === value || value === 'learning' && state.currentCareer !== career.id} onClick={() => void perform('topic',{ topicId:topic.id,status:value })}>{value === 'learning' ? 'Learning' : value === 'done' ? 'Done' : value === 'skipped' ? 'Skip' : 'Clear'}</button>)}</div></div>
  </Modal>;
}

function Settings({ state, busy, perform, go, configured, model, reload }: Shared & { configured: boolean; model: string; reload: () => Promise<void> }) {
  const [firstName,setFirstName] = useState(state.profile.firstName);
  const [surname,setSurname] = useState(state.profile.surname);
  const [field,setField] = useState(state.profile.preferredField);
  const [saved,setSaved] = useState(false);
  return <section className="settings-page page-width"><aside className="settings-nav"><h2>Settings</h2><a href="#profile" aria-current="page">Profile</a><a href="#gemini">Gemini setup</a><span className="small muted">Local testing account</span></aside><div className="settings-content"><section id="profile"><p className="eyebrow">Make it yours</p><h1>Profile</h1><form onSubmit={async event => { event.preventDefault(); if (await perform('profile',{ firstName,surname,preferredField:field })) setSaved(true); }}>
    <div className="profile-fields"><span className="profile-avatar" aria-hidden="true"><UserRound size={28}/></span><div><label>First name<input maxLength={60} value={firstName} onChange={event => {setFirstName(event.target.value);setSaved(false);}} placeholder="Your first name"/></label><label>Surname <span className="muted">(optional)</span><input maxLength={80} value={surname} onChange={event => {setSurname(event.target.value);setSaved(false);}} placeholder="Your surname"/></label></div></div>
    <div className="settings-section"><h2>Active Discovery results</h2><div className="discovery-context"><Compass size={23}/><div><strong>{state.discovery.completed ? 'Your Discovery answers are saved' : 'No completed Discovery yet'}</strong><p>{state.recommendations ? `${state.recommendations.items.length} saved direction${state.recommendations.items.length === 1 ? '' : 's'} to explore` : 'Your selected roadmap is separate from your Discovery answers.'}</p></div><button type="button" className="secondary small-button" disabled={busy} onClick={async () => { if (await perform('save-discovery', { ...state.discovery, step: 0, completed: false })) go('discovery'); }}>{state.discovery.completed ? 'Retake Discovery' : 'Open Discovery'}</button></div></div>
    <fieldset className="settings-section"><legend>Preferred Primary Field</legend><p className="muted">Choose the default category shown in the catalog. This doesn’t change your roadmap or recommendations.</p><div className="field-choices">{categories.map(category => <label className={field === category.id ? 'checked' : ''} key={category.id}><input type="radio" name="field" value={category.id} checked={field === category.id} onChange={() => {setField(category.id);setSaved(false);}}/>{category.name}</label>)}</div></fieldset>
    <div className="button-row"><button disabled={busy} type="submit">Save profile</button>{saved && <span role="status" className="saved-label"><Check size={16}/>Saved</span>}</div>
    </form></section>
    <section className="settings-section"><h2>Academic Profile & Document Management</h2><p className="muted">Optional PDF extraction will be added after this working prototype.</p><div className="unavailable-feature"><BookOpen size={25}/><div><strong>PDF upload and analysis</strong><p>Not available in this prototype. Your learning is fully available without a document.</p></div><span className="tag neutral">Deferred</span></div></section>
    <section id="gemini" className="settings-section"><h2>Gemini recommendations</h2><p className="connection-status"><span className={`status-dot ${configured ? 'connected' : ''}`}/>{configured ? 'API key configured' : 'API key not configured'}</p><p>The model receives your Discovery choices and this prototype’s curated career descriptions when you request suggestions.</p><p className="small muted">Current model: {model}. A configured key has not necessarily been validated with the provider.</p><ol className="setup-steps"><li>Create a key in <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio <ExternalLink size={12}/></a>.</li><li>Add it to <code>.env.local</code> as <code>GEMINI_API_KEY</code>. Change <code>GEMINI_MODEL</code> if needed.</li><li>Restart <code>npm run dev</code>, then refresh this page.</li></ol><button className="secondary" disabled={busy} onClick={() => void reload()}>Refresh configuration status</button><p className="small muted">Your key stays on the server and is never displayed here.</p></section>
    <section className="settings-section"><h2>Account and security</h2><p>This prototype runs locally with one testing profile. Registration, sign-in, 2FA, and account-management controls are deferred.</p></section>
  </div></section>;
}
