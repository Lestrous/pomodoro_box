import React, { useState } from 'react';
import styles from './statisticsPage.scss';
import {
  SelectArrowIcon,
  StatisticsFocusIcon,
  StatisticsPauseIcon,
  StatisticsStopIcon,
  TomatoIcon,
  ZeroTomatoIcon,
} from '../Icons';
import { Dropdown } from '../Dropdown';
import { useAppSelector } from '../hooks/useAppSelector';
import { getWeekDayName } from '../utils/js/getWeekDayName';
import { declineWord } from '../utils/js/declineWord';
import { selectSettings } from '../../store/settingsSlice';
import { StatisticsChart } from './StatisticsChart';
import { getWeekChartData } from '../utils/js/getWeekChartData';
import { getConvertedHoursAndMinutesText } from '../utils/js/getConvertedHoursAndMinutesText';
import { getCurrentDayIndex } from '../utils/js/getCurrentDayIndex';
import { selectDay } from '../../store/daySlice';

export type weeksSelection = 'currentWeek' | 'lastWeek' | '2WeekAgo';

export function StatisticsPage() {
  const [selectedOption, setSelectedOption] =
    useState<weeksSelection>('currentWeek');
  const [activeDayIndex, setActiveDayIndex] = useState<number>(
    getCurrentDayIndex()
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { pauseTime: dayPauseTime } = useAppSelector(selectDay);

  const weekChartData = getWeekChartData(selectedOption);
  const weekChartPomodoroData = weekChartData.map((dayData) =>
    dayData === null ? 0 : dayData.pomodoroTime
  );

  const { pomodoroTime, breakTime, pauseTime, day, stopsAmount } =
    weekChartData[activeDayIndex];
  const timerSettings = useAppSelector(selectSettings);

  const totalTime = pomodoroTime + breakTime + pauseTime;
  const pomodoroAmount = Math.floor(
    pomodoroTime / timerSettings.pomodoroTimeMinutes
  );

  function handleDayChangeClick(dayIndex: number) {
    setActiveDayIndex(dayIndex);
  }

  return (
    <main className={`fixed-container ${styles.statisticsPage}`}>
      <div className={styles.activitySection}>
        <div className={styles.title}>Ваша активность</div>

        <div className={styles.weekSelectionContainer}>
          <Dropdown
            button={
              <button className={`button ${styles.weekSelection}`}>
                {selectedOption === 'currentWeek'
                  ? 'Эта неделя'
                  : selectedOption === 'lastWeek'
                  ? 'Прошлая неделя'
                  : '2 недели назад'}

                <SelectArrowIcon className={styles.weekSelectionArrow} />
              </button>
            }
            openSide={'onElement'}
          >
            <div className={styles.weekSelectionDropdown}>
              <div
                className={styles.weekSelectionDropdownOption}
                onClick={() => setSelectedOption('currentWeek')}
              >
                Эта неделя
                <SelectArrowIcon
                  className={styles.weekSelectionArrowReverted}
                />
              </div>
              <div
                className={styles.weekSelectionDropdownOption}
                onClick={() => setSelectedOption('lastWeek')}
              >
                Прошлая неделя
              </div>
              <div
                className={styles.weekSelectionDropdownOption}
                onClick={() => setSelectedOption('2WeekAgo')}
              >
                2 недели назад
              </div>
            </div>
          </Dropdown>
        </div>
      </div>

      <div className={styles.descriptionSection}>
        <div className={styles.sectionHeader}>{getWeekDayName(day)}</div>

        <div>
          {pomodoroTime < 60 ? (
            'Нет данных'
          ) : (
            <span>
              Вы работали над задачами в течение{' '}
              <span className={styles.workTimeText}>
                {getConvertedHoursAndMinutesText({
                  totalSeconds: pomodoroTime,
                  hoursFormat: 'long',
                  minutesFormat: 'long',
                  displayZeroHours: false,
                  declineHours: ['часа', 'часов', 'часов'],
                  declineMinutes: ['минуты', 'минут', 'минут'],
                })}
              </span>
            </span>
          )}
        </div>
      </div>

      <div className={styles.chartSection}>
        <StatisticsChart
          weekChartData={weekChartPomodoroData}
          activeDayIndex={activeDayIndex}
          pomodoroTime={timerSettings.pomodoroTimeMinutes}
          handleDayChangeClick={handleDayChangeClick}
        />
      </div>

      <div
        className={`${styles.pomodoroSection} ${
          pomodoroAmount === 0 ? styles.zeroTomatoIcon : ''
        }`}
      >
        {pomodoroAmount === 0 ? (
          <ZeroTomatoIcon />
        ) : (
          <>
            <div className={styles.pomodoroSectionAmountContainer}>
              <TomatoIcon className={styles.pomodoroSectionIcon} />
              <span className={styles.pomodoroSectionAmountText}>
                x {pomodoroAmount}
              </span>
            </div>
            <div className={styles.pomodoroSectionAmountFooter}>
              {pomodoroAmount}{' '}
              {declineWord(pomodoroAmount, [
                'помидор',
                'помидора',
                'помидоров',
              ])}
            </div>
          </>
        )}
      </div>

      <div
        className={`${styles.focusSection} ${
          totalTime !== 0 ? styles.focusSectionActive : ''
        }`}
      >
        <div
          className={`${styles.sectionHeader} ${styles.sectionHeaderIndent}`}
        >
          Фокус
        </div>

        <div className={styles.sectionsNumbers}>
          {totalTime === 0 ? 0 : ((100 * pomodoroTime) / totalTime).toFixed(0)}%
        </div>

        <StatisticsFocusIcon
          className={`${styles.sectionsIcons} ${
            totalTime !== 0 ? styles.statisticsFocusIconActive : ''
          }`}
        />
      </div>

      <div
        className={`${styles.pauseSection} ${
          pauseTime !== 0 ? styles.pauseSectionActive : ''
        }`}
      >
        <div
          className={`${styles.sectionHeader} ${styles.sectionHeaderIndent}`}
        >
          Время на паузе
        </div>

        <div className={styles.sectionsNumbers}>
          {getConvertedHoursAndMinutesText({
            totalSeconds: pauseTime,
            hoursFormat: 'short',
            minutesFormat: 'short',
            displayZeroHours: false,
          })}
        </div>

        <StatisticsPauseIcon
          className={`${styles.sectionsIcons} ${
            pauseTime !== 0 ? styles.statisticsPauseIconActive : ''
          }`}
        />
      </div>

      <div
        className={`${styles.stopSection} ${
          stopsAmount !== 0 ? styles.stopSectionActive : ''
        }`}
      >
        <div
          className={`${styles.sectionHeader} ${styles.sectionHeaderIndent}`}
        >
          Остановки
        </div>

        <div className={styles.sectionsNumbers}>{stopsAmount}</div>

        <StatisticsStopIcon
          className={`${styles.sectionsIcons} ${
            stopsAmount !== 0 ? styles.statisticsStopIconActive : ''
          }`}
        />
      </div>
    </main>
  );
}
