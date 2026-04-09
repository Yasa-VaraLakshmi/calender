import { formatMonthLabel } from '../lib/date';

type Scope = 'month' | 'range';

type HeaderProps = {
  month: Date;
  accentColor: string;
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
  onToday: () => void;
  scope: Scope;
  onScopeChange: (scope: Scope) => void;
};

export function Header({ month, accentColor, onPrev, onNext, onReset, onToday, scope, onScopeChange }: HeaderProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Wall Calendar</p>
          <h1 className="text-3xl font-display font-semibold text-slate-900">{formatMonthLabel(month)}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous month"
            onClick={onPrev}
            className="h-10 w-10 rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
            style={{ color: accentColor }}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next month"
            onClick={onNext}
            className="h-10 w-10 rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
            style={{ color: accentColor }}
          >
            ›
          </button>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
        <div className="inline-flex rounded-full bg-white/70 px-2 py-1 shadow-sm border border-slate-200">
          <span className="mr-2 text-xs uppercase tracking-[0.15em] text-slate-500">Notes for</span>
          <button
            type="button"
            className={`px-3 py-1 rounded-full transition ${scope === 'month' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'}`}
            onClick={() => onScopeChange('month')}
          >
            Month
          </button>
          <button
            type="button"
            className={`px-3 py-1 rounded-full transition ${scope === 'range' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'}`}
            onClick={() => onScopeChange('range')}
          >
            Range
          </button>
        </div>
        <div className="flex gap-2 ml-auto">
          <button
            type="button"
            onClick={onToday}
            className="px-3 py-1 text-xs uppercase tracking-[0.15em] rounded-full bg-white border border-slate-200 shadow-sm hover:-translate-y-0.5 transition"
          >
            Today
          </button>
          <button
            type="button"
            onClick={onReset}
            className="px-3 py-1 text-xs uppercase tracking-[0.15em] rounded-full bg-white border border-slate-200 shadow-sm hover:-translate-y-0.5 transition"
          >
            Reset Range
          </button>
        </div>
      </div>
    </div>
  );
}
