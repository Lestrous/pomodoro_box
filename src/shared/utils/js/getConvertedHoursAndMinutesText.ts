import { getHoursAndMinutesFromSeconds } from './getHoursAndMinutesFromSeconds';
import { declineWord } from './declineWord';

interface getConvertedHoursAndMinutesTextProps {
  totalSeconds: number;
  hoursFormat: 'long' | 'short';
  minutesFormat: 'long' | 'middle' | 'short';
  displayZeroHours: boolean;
  declineHours?: [string, string, string];
  declineMinutes?: [string, string, string];
}

export function getConvertedHoursAndMinutesText({
  totalSeconds,
  hoursFormat,
  minutesFormat,
  displayZeroHours,
  declineHours = ['час', 'часа', 'часов'],
  declineMinutes = ['минуту', 'минуты', 'минут'],
}: getConvertedHoursAndMinutesTextProps) {
  const { hours, minutes } = getHoursAndMinutesFromSeconds(totalSeconds);

  return `${
    displayZeroHours || hours !== 0
      ? `${hours} ${
          hoursFormat === 'short' ? 'ч' : declineWord(hours, declineHours)
        } `
      : ''
  }${minutes} ${
    minutesFormat === 'short'
      ? 'м'
      : minutesFormat === 'middle'
      ? 'мин'
      : declineWord(minutes, declineMinutes)
  }`;
}
