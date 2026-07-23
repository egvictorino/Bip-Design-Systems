/** Same calendar day, ignoring time. */
export const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export const addDays = (d: Date, delta: number): Date => {
  const result = new Date(d);
  result.setDate(result.getDate() + delta);
  return result;
};

export const getDaysInMonth = (year: number, month: number): number =>
  new Date(year, month + 1, 0).getDate();

/** Monday-first offset: 0 = Monday, 6 = Sunday */
export const getMondayOffset = (year: number, month: number): number => {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
};

/** Comparable month index for min/max navigation */
export const monthIndex = (d: Date): number => d.getFullYear() * 12 + d.getMonth();

/** String key for a date — used for Set membership and data-date attribute */
export const dateKey = (d: Date): string => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
