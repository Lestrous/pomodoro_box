import { weeksSelection } from '../../StatisticsPage';

function getCurrentWeekMonday() {
  const currentDate = new Date();

  const currentDay = currentDate.getDay();
  const difference =
    currentDate.getDate() - currentDay + (currentDay == 0 ? -6 : 1);

  return new Date(currentDate.setDate(difference));
}

export function getWeekDays(weeksSelection: weeksSelection) {
  const currentWeekMonday = getCurrentWeekMonday();

  const dateDifference =
    weeksSelection === 'currentWeek'
      ? 0
      : weeksSelection === 'lastWeek'
      ? 7
      : 14;

  const weekDays = [];

  const neededWeekMonday = new Date(
    currentWeekMonday.getFullYear(),
    currentWeekMonday.getMonth(),
    currentWeekMonday.getDate() - dateDifference
  );

  weekDays.push(neededWeekMonday);

  for (let i = 1; i < 7; i++) {
    const nextWeekDay = new Date(
      neededWeekMonday.getFullYear(),
      neededWeekMonday.getMonth(),
      neededWeekMonday.getDate() + i
    );

    weekDays.push(nextWeekDay);
  }

  return weekDays;
}
