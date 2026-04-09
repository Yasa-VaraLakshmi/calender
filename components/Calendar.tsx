"use client";

import { useEffect, useMemo, useState } from 'react';
import { addMonths, buildCalendarDays, formatMonthLabel, formatRangeLabel, startOfMonth, toISODate } from '../lib/date';
import { Header } from './Header';
import { CalendarGrid } from './CalendarGrid';
import { NotesPanel } from './NotesPanel';

type Selection = { start?: string; end?: string };
type Scope = 'month' | 'range';

const storageKey = 'wall-calendar-notes-v1';

const heroForDate = (date: Date) => {
  const day = date.getDate();
  const month = date.getMonth();
  const hue = (day * 12 + month * 18) % 360;
  const hue2 = (hue + 35) % 360;
  const hue3 = (hue + 80) % 360;
  const gradA = `hsl(${hue}, 75%, 55%)`;
  const gradB = `hsl(${hue2}, 65%, 58%)`;
  const gradC = `hsl(${hue3}, 70%, 52%)`;

  const svg = `
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600' preserveAspectRatio='xMidYMid slice'>
    <defs>
      <linearGradient id='grad' x1='0%' y1='0%' x2='100%' y2='100%'>
        <stop offset='0%' stop-color='${gradA}'/>
        <stop offset='50%' stop-color='${gradB}'/>
        <stop offset='100%' stop-color='${gradC}'/>
      </linearGradient>
      <radialGradient id='glow' cx='40%' cy='35%' r='60%'>
        <stop offset='0%' stop-color='rgba(255,255,255,0.48)' />
        <stop offset='80%' stop-color='rgba(255,255,255,0)' />
      </radialGradient>
    </defs>
    <rect width='800' height='600' fill='url(#grad)'/>
    <rect x='90' y='200' width='620' height='300' rx='46' fill='url(#glow)'/>
    <circle cx='140' cy='160' r='90' fill='rgba(255,255,255,0.18)'/>
    <circle cx='650' cy='140' r='110' fill='rgba(255,255,255,0.14)'/>
    <path d='M100 500 Q400 430 700 500' stroke='rgba(255,255,255,0.3)' stroke-width='40' fill='none' stroke-linecap='round'/>
    <text x='120' y='560' fill='rgba(255,255,255,0.6)' font-family='"Manrope",sans-serif' font-size='28' font-weight='600'>Day ${day} • ${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export function Calendar() {
  const [currentMonth, setCurrentMonth] = useState<Date>(() => startOfMonth(new Date()));
  const [selection, setSelection] = useState<Selection>({});
  const [scope, setScope] = useState<Scope>('month');
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [accentColor, setAccentColor] = useState<string>('#22c55e');
  const [isFlipping, setIsFlipping] = useState(false);
  const [heroSrc, setHeroSrc] = useState(() => heroForDate(new Date()));

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
    if (saved) {
      try {
        setNotes(JSON.parse(saved));
      } catch (e) {
        console.warn('Failed to parse saved notes', e);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(storageKey, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = heroSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || 800;
      canvas.height = img.naturalHeight || 600;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let r = 0,
        g = 0,
        b = 0;
      for (let i = 0; i < data.length; i += 16) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
      }
      const count = data.length / 16;
      const avg = `rgb(${Math.round(r / count)}, ${Math.round(g / count)}, ${Math.round(b / count)})`;
      setAccentColor(avg);
    };
  }, [heroSrc]);

  const days = useMemo(() => buildCalendarDays(currentMonth), [currentMonth]);

  const monthKey = `month-${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;
  const rangeKey = selection.start && selection.end ? `range-${selection.start}-${selection.end}` : undefined;
  const activeKey = scope === 'range' ? rangeKey ?? undefined : monthKey;
  const noteValue = (activeKey && notes[activeKey]) || '';

  const activeDate = useMemo(() => {
    if (selection.end) return new Date(selection.end);
    if (selection.start) return new Date(selection.start);
    return new Date();
  }, [selection.start, selection.end]);

  useEffect(() => {
    setHeroSrc(heroForDate(activeDate));
  }, [activeDate]);

  const changeMonth = (delta: number) => {
    setIsFlipping(true);
    setCurrentMonth((m) => addMonths(m, delta));
    setTimeout(() => setIsFlipping(false), 420);
  };

  const handleDayClick = (iso: string) => {
    if (!selection.start || (selection.start && selection.end)) {
      setSelection({ start: iso });
      return;
    }
    if (iso <= selection.start) {
      setSelection({ start: iso });
    } else {
      setSelection({ start: selection.start, end: iso });
    }
  };

  const handleReset = () => setSelection({});
  const handleToday = () => {
    const today = new Date();
    setCurrentMonth(startOfMonth(today));
    setSelection({ start: toISODate(today) });
    setIsFlipping(true);
    setTimeout(() => setIsFlipping(false), 420);
  };

  const updateNotes = (value: string) => {
    if (!activeKey) return;
    setNotes((prev) => ({ ...prev, [activeKey]: value }));
  };

  const rangeLabel = formatRangeLabel(selection.start, selection.end);

  return (
    <div className="relative" style={{ ['--accent' as string]: accentColor }}>
      <div className="flex flex-col gap-6 max-w-6xl mx-auto py-8 px-4 lg:px-0">
        <div className="paper calendar-shadow overflow-hidden lg:grid lg:grid-cols-[1.1fr_1fr]">
          <div className="relative h-72 lg:h-full">
            <img src={heroSrc} alt="Calendar hero" className="h-full w-full object-cover calendar-hero-fade" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/15 to-black/30 mix-blend-multiply" />
            <div className="absolute top-6 left-6 flex gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 w-10 rounded-full bg-white/70 shadow-md backdrop-blur" />
              ))}
            </div>
            <div className="absolute bottom-6 left-6 glass rounded-2xl p-4 text-white shadow-lg">
              <p className="text-xs uppercase tracking-[0.2em] text-white/80">Current Palette</p>
              <div className="mt-2 flex items-center gap-3">
                <span className="h-10 w-10 rounded-xl" style={{ background: accentColor }} />
                <div>
                  <p className="font-display text-xl">{formatMonthLabel(currentMonth)}</p>
                  <p className="text-sm text-white/80">Derived from hero gradient</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 lg:p-8 flex flex-col gap-5 bg-gradient-to-b from-white/80 to-white/60">
            <Header
              month={currentMonth}
              accentColor={accentColor}
              onPrev={() => changeMonth(-1)}
              onNext={() => changeMonth(1)}
              onReset={handleReset}
              onToday={handleToday}
              scope={scope}
              onScopeChange={setScope}
            />

            <CalendarGrid
              days={days}
              selection={selection}
              onDayClick={handleDayClick}
              accentColor={accentColor}
              isFlipping={isFlipping}
            />

            <NotesPanel
              scope={scope}
              onScopeChange={setScope}
              noteKey={activeKey}
              noteValue={noteValue}
              onChange={updateNotes}
              monthLabel={formatMonthLabel(currentMonth)}
              rangeLabel={rangeLabel}
              accentColor={accentColor}
              disabledRange={!selection.start || !selection.end}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
