export type DayInfo = {
  date: Date;
  iso: string;
  inCurrentMonth: boolean;
  isWeekend: boolean;
  isHoliday: boolean;
  holidayName?: string;
};

export const toISODate = (date: Date) => date.toISOString().split('T')[0];

export const startOfMonth = (date: Date) => {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const addMonths = (date: Date, count: number) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + count);
  return startOfMonth(d);
};

export const formatMonthLabel = (date: Date) =>
  date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

export const formatRangeLabel = (start?: string, end?: string) => {
  if (!start) return '';
  const s = new Date(start);
  const startFmt = s.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  if (!end) return startFmt;
  const e = new Date(end);
  const endFmt = e.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  return `${startFmt} → ${endFmt}`;
};

const fixedHolidays = [
  { month: 0, day: 1, name: "New Year's Day" },
  { month: 1, day: 14, name: "Valentine's Day" },
  { month: 6, day: 4, name: 'Independence Day' },
  { month: 9, day: 31, name: 'Halloween' },
  { month: 10, day: 11, name: 'Veterans Day' },
  { month: 11, day: 25, name: 'Christmas Day' },
];

const nthWeekdayOfMonth = (year: number, month: number, weekday: number, n: number) => {
  const first = new Date(year, month, 1);
  const firstWeekday = first.getDay();
  const delta = (weekday - firstWeekday + 7) % 7;
  const day = 1 + delta + 7 * (n - 1);
  return new Date(year, month, day);
};

const lastWeekdayOfMonth = (year: number, month: number, weekday: number) => {
  const last = new Date(year, month + 1, 0);
  const lastWeekday = last.getDay();
  const delta = (lastWeekday - weekday + 7) % 7;
  return new Date(year, month + 1, last.getDate() - delta);
};

const dynamicHolidays = (year: number) => [
  { date: nthWeekdayOfMonth(year, 0, 1, 3), name: 'MLK Day' },
  { date: nthWeekdayOfMonth(year, 1, 1, 3), name: 'Presidents Day' },
  { date: lastWeekdayOfMonth(year, 4, 1), name: 'Memorial Day' },
  { date: nthWeekdayOfMonth(year, 8, 1, 1), name: 'Labor Day' },
  { date: nthWeekdayOfMonth(year, 10, 4, 4), name: 'Thanksgiving' },
];

export const buildCalendarDays = (month: Date): DayInfo[] => {
  const start = startOfMonth(month);
  const year = start.getFullYear();
  const monthIdx = start.getMonth();
  const firstDayWeekday = start.getDay();
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();

  const holidays = new Map<string, string>();
  fixedHolidays.forEach((h) => {
    const d = new Date(year, h.month, h.day);
    holidays.set(toISODate(d), h.name);
  });
  dynamicHolidays(year).forEach((h) => holidays.set(toISODate(h.date), h.name));

  const prevMonthDays = firstDayWeekday; // Sunday start
  const totalCells = Math.ceil((prevMonthDays + daysInMonth) / 7) * 7;
  const days: DayInfo[] = [];

  for (let i = 0; i < totalCells; i++) {
    const dayNumber = i - prevMonthDays + 1;
    const cellDate = new Date(year, monthIdx, dayNumber);
    const iso = toISODate(cellDate);
    const inCurrentMonth = dayNumber >= 1 && dayNumber <= daysInMonth;
    const isWeekend = [0, 6].includes(cellDate.getDay());
    const holidayName = holidays.get(iso);
    days.push({
      date: cellDate,
      iso,
      inCurrentMonth,
      isWeekend,
      isHoliday: Boolean(holidayName),
      holidayName,
    });
  }

  return days;
};
