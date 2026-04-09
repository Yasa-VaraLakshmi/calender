import { DayInfo } from '../lib/date';
import { DayCell } from './DayCell';

type Selection = { start?: string; end?: string };

type Props = {
  days: DayInfo[];
  selection: Selection;
  onDayClick: (iso: string) => void;
  accentColor: string;
  isFlipping: boolean;
};

const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CalendarGrid({ days, selection, onDayClick, accentColor, isFlipping }: Props) {
  return (
    <div className={`glass rounded-2xl p-3 shadow-inner ${isFlipping ? 'flip' : ''}`}>
      <div className="grid grid-cols-7 gap-2 pb-2 text-center text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
        {weekdayLabels.map((d) => (
          <div key={d} className="py-2 rounded-lg bg-white/60 border border-slate-100">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => (
          <DayCell
            key={day.iso}
            day={day}
            selection={selection}
            onClick={onDayClick}
            accentColor={accentColor}
          />
        ))}
      </div>
    </div>
  );
}
