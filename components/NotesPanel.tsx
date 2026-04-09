type Scope = 'month' | 'range';

type NotesPanelProps = {
  scope: Scope;
  onScopeChange: (scope: Scope) => void;
  noteKey?: string;
  noteValue: string;
  onChange: (value: string) => void;
  monthLabel: string;
  rangeLabel?: string;
  accentColor: string;
  disabledRange: boolean;
};

export function NotesPanel({
  scope,
  onScopeChange,
  noteKey,
  noteValue,
  onChange,
  monthLabel,
  rangeLabel,
  accentColor,
  disabledRange,
}: NotesPanelProps) {
  const placeholder =
    scope === 'range'
      ? 'Scribble plans for this selected window...'
      : 'Month overview, priorities, reminders...';

  return (
    <div className="paper calendar-shadow p-4 md:p-6 mt-4 md:mt-0">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Notes</p>
          <h3 className="text-lg font-display font-semibold text-slate-900">
            {scope === 'range' && rangeLabel ? rangeLabel : monthLabel}
          </h3>
          {noteKey && <p className="text-[11px] text-slate-500">Key: {noteKey}</p>}
        </div>
        <div className="inline-flex rounded-full border border-slate-200 bg-white shadow-sm text-xs">
          <button
            type="button"
            className={`px-3 py-1 rounded-full ${scope === 'month' ? 'bg-slate-900 text-white' : 'text-slate-700'}`}
            onClick={() => onScopeChange('month')}
          >
            Month
          </button>
          <button
            type="button"
            className={`px-3 py-1 rounded-full ${scope === 'range' ? 'bg-slate-900 text-white' : 'text-slate-700'}`}
            onClick={() => onScopeChange('range')}
            disabled={disabledRange}
          >
            Range
          </button>
        </div>
      </div>
      <div className="mt-4 relative">
        <textarea
          value={noteValue}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-36 rounded-xl border border-slate-200 bg-white/90 p-4 text-sm text-slate-800 shadow-inner focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{ borderColor: `${accentColor}55`, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)' }}
          placeholder={disabledRange && scope === 'range' ? 'Select a date range first' : placeholder}
          disabled={disabledRange && scope === 'range'}
        />
        <div className="pointer-events-none absolute inset-0 rounded-xl" style={{ boxShadow: `0 12px 35px ${accentColor}14` }} />
      </div>
    </div>
  );
}
