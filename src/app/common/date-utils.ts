import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(advancedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

export function todaysIsoDate() {
  return new Date().toISOString().split('T')[0];
}

// Convert ISO date to locale date taking into account user timezone
export function isoDateToLocalDate(isoDate: string): string {
  return dayjs.tz(isoDate).format('YYYY-MM-DD');
}

export function toLocalizedDateFormat(date: dayjs.Dayjs) {
  return date.format('lll');
}

// txDate is of the form YYYY-MM-DD
export function displayDate(txDate: string): string {
  const date = dayjs(txDate);
  if (date.isToday()) return 'Today';
  if (date.isYesterday()) return 'Yesterday';
  if (dayjs().isSame(date, 'year')) {
    return date.format('MMM Do');
  }
  return date.format('MMM Do, YYYY');
}

export function isoDateToLocalDateSafe(isoDate: string) {
  try {
    return isoDateToLocalDate(isoDate);
  } catch (e) {
    return;
  }
}
