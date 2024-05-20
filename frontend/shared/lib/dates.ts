import { addHours, format, formatDuration, minutesToHours } from 'date-fns';
import { ru } from 'date-fns/locale';

export const toLocalTime = (time: string) => addHours(time, 5);

export const fmtTime = (time: string) => format(toLocalTime(time), 'HH:mm');

export const fmtDate = (time: string) => format(toLocalTime(time), 'dd-MM-yyyy')

export const humanTime = (minutes: number) => {
  return formatDuration(
    {
      hours: minutesToHours(minutes),
      minutes: minutes,
    },
    { format: ["minutes"], zero: true, locale: ru },
  );
};