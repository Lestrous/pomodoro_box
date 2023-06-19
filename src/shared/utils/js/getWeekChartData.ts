import { weeksSelection } from '../../StatisticsPage';
import { getDayFormatted } from './getDayFormatted';
import { initialDaySliceState } from '../../../store/daySlice';
import { getWeekDays } from './getWeekDays';

export function getWeekChartData(weeksSelection: weeksSelection) {
  const weekDays = getWeekDays(weeksSelection).map((day) =>
    getDayFormatted(day)
  );

  return weekDays.map(
    (day) =>
      JSON.parse(localStorage.getItem(day) ?? 'null') ?? {
        ...initialDaySliceState,
        ...{ day },
      }
  );
}
