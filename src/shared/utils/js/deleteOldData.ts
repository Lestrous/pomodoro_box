import { tasksSlice } from '../../../store/tasksSlice';
import { timerSlice } from '../../../store/timerSlice';
import { settingsSlice } from '../../../store/settingsSlice';
import { getWeekDays } from './getWeekDays';
import { getDayFormatted } from './getDayFormatted';

export function deleteOldData() {
  const appLocalStorageKeys = [
    tasksSlice.name,
    timerSlice.name,
    settingsSlice.name,
  ];
  const activeWeeksDays = [
    ...getWeekDays('2WeekAgo'),
    ...getWeekDays('lastWeek'),
    ...getWeekDays('currentWeek'),
  ].map((day) => getDayFormatted(day));
  const appLocalStorageActiveKeys = [
    ...appLocalStorageKeys,
    ...activeWeeksDays,
  ];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i) ?? '-1';

    if (!appLocalStorageActiveKeys.includes(key)) {
      localStorage.removeItem(key);
    }
  }
}
