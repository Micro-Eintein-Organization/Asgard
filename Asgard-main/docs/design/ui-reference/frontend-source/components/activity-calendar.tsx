'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import type { AppState } from '@/lib/catalog';

function localDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export default function ActivityCalendar({ state }: { state: AppState }) {
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const today = new Date();
  const todayKey = localDateKey(today);
  const counts = new Map<string, number>();
  for (const [topicId, timestamp] of Object.entries(state.completedAt)) {
    const date = new Date(timestamp);
    if (state.statuses[topicId] !== 'done' || Number.isNaN(date.getTime())) continue;
    const key = localDateKey(date);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  let streak = 0;
  const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (!counts.has(todayKey)) cursor.setDate(cursor.getDate() - 1);
  while (counts.has(localDateKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const offset = month.getDay();
  const cells = Math.ceil((offset + days) / 7) * 7;
  const canGoForward = month.getFullYear() < today.getFullYear() || month.getFullYear() === today.getFullYear() && month.getMonth() < today.getMonth();
  const changeMonth = (delta: number) => { setMonth(new Date(month.getFullYear(), month.getMonth() + delta, 1)); setSelectedDay(null); };
  return <section className="activity-card" aria-label="Completed topic activity">
    <div className="activity-heading"><h2>{month.toLocaleDateString(undefined, { month: 'long' })}<span className="sr-only"> {month.getFullYear()}</span></h2><span className="streak-count" title="Consecutive local days with topics marked Done" aria-label={`${streak} day completion streak`}>{streak}<Flame size={16} aria-hidden="true"/></span></div>
    <div className="calendar-weekdays" aria-hidden="true">{['S','M','T','W','T','F','S'].map((day,index) => <span key={index}>{day}</span>)}</div>
    <div className="calendar-days">{Array.from({ length: cells }, (_, index) => {
      const day = index - offset + 1;
      if (day < 1 || day > days) return <span className="calendar-spacer" key={index}/>;
      const date = new Date(month.getFullYear(), month.getMonth(), day);
      const key = localDateKey(date);
      const count = counts.get(key) || 0;
      const selected = selectedDay && localDateKey(selectedDay) === key;
      return <button key={index} type="button" className={`calendar-day intensity-${Math.min(count, 3)}${selected ? ' day-selected' : ''}`} aria-pressed={Boolean(selected)} aria-current={key === todayKey ? 'date' : undefined} aria-label={`${date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}: ${count} topic${count === 1 ? '' : 's'} completed`} title={`${day}: ${count} done`} onClick={() => setSelectedDay(date)}><span className="sr-only">{day}</span></button>;
    })}</div>
    <div className="calendar-navigation"><button className="icon-button" type="button" aria-label="Previous month" onClick={() => changeMonth(-1)}><ChevronLeft size={14}/></button><span>{month.getFullYear()}</span><button className="icon-button" type="button" aria-label="Next month" disabled={!canGoForward} onClick={() => changeMonth(1)}><ChevronRight size={14}/></button></div>
    <p className="calendar-detail" aria-live="polite">{selectedDay ? `${selectedDay.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} · ${counts.get(localDateKey(selectedDay)) || 0} topics done` : 'Daily activity from topics marked Done.'}</p>
  </section>;
}
