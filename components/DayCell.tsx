import { DayInfo } from '../lib/date';
import clsx from 'clsx';
import type { CSSProperties } from 'react';

type Selection = { start?: string; end?: string };

type Props = {
  day: DayInfo;
  selection: Selection;
  onClick: (iso: string) => void;
  accentColor: string;
};

const isBetween = (iso: string, start?: string, end?: string) => {
  if (!start || !end) return false;
  return iso > start && iso < end;
};

export function DayCell({ day, selection, onClick, accentColor }: Props) {
  const todayIso = new Date().toISOString().split('T')[0];
  const isStart = selection.start === day.iso;
  const isEnd = selection.end === day.iso;
  const inRange = isBetween(day.iso, selection.start, selection.end);
  const isToday = todayIso === day.iso;

  const base = 'relative aspect-square rounded-xl p-2 transition range-soft-transition hover:-translate-y-0.5 cursor-pointer flex flex-col items-start justify-start';

  const dayClasses = clsx(base, {
    'text-slate-400 opacity-70': !day.inCurrentMonth,
    'bg-white/80 border border-slate-200': !isStart && !isEnd && !inRange,
    'outline outline-2 outline-offset-2': isToday && !isStart && !isEnd,
  });

  const style: CSSProperties = {};
  if (isStart || isEnd) {
    style.background = accentColor;
    style.color = '#fff';
    style.boxShadow = `0 10px 25px ${accentColor}33`;
  }
  if (inRange) {
    style.background = `linear-gradient(90deg, ${accentColor}22, ${accentColor}0f)`;
    style.color = '#0f172a';
  }
  if (isStart || isEnd) {
    style.boxShadow = [style.boxShadow, `0 0 0 3px ${accentColor}33`].filter(Boolean).join(', ');
  }

  return (
    <button
      type="button"
      onClick={() => onClick(day.iso)}
      className={dayClasses}
      style={{ borderColor: accentColor, ...style }}
      aria-label={`Select ${day.date.toDateString()}`}
    >
      <div className="flex w-full items-center justify-between text-sm font-medium">
        <span>{day.date.getDate()}</span>
        {isToday && <span className="h-2 w-2 rounded-full bg-orange-500" title="Today" />}
      </div>
      {isEnd && (
        <span
          className="mt-1 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold text-slate-700 shadow-sm"
          style={{ color: accentColor }}
        >
          End
        </span>
      )}
      <div className="mt-auto flex items-center gap-1 text-[11px] text-slate-500">
        {day.isWeekend && <span className="h-1.5 w-full rounded-full bg-slate-200" aria-hidden />}
        {day.isHoliday && (
          <span
            className="ml-auto h-2.5 w-2.5 rounded-full bg-red-500 holiday-ring"
            title={day.holidayName}
          />
        )}
      </div>
      {(isStart || isEnd || inRange) && (
        <span
          className="pointer-events-none absolute inset-0 rounded-xl border border-white/40 shadow-inset"
          style={{ boxShadow: `inset 0 0 0 1px ${accentColor}33` }}
        />
      )}
    </button>
  );
}
