import React, { useEffect, useState } from 'react';
import styles from './timerBlock.scss';
import { useAppSelector } from '../hooks/useAppSelector';
import {
  decrementActiveTaskPomodoroAmount,
  selectActiveTask,
} from '../../store/tasksSlice';
import {
  selectShowedPomodoroNumber,
  selectTimer,
  startTimer,
  timerDone,
  timerGo,
  timerPause,
  timerSkip,
  timerStates,
  timerStop,
} from '../../store/timerSlice';
import { getHoursAndMinutesFromSeconds } from '../utils/js/getHoursAndMinutesFromSeconds';
import { zeroPad } from '../utils/js/zeroPad';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { selectSettings } from '../../store/settingsSlice';
import {
  addDayStop,
  addDayTime,
  clearPauseIdTimer,
  startPauseTimer,
} from '../../store/daySlice';
import { SettingsIcon } from '../Icons';
import { Link } from 'react-router-dom';

export function TimerBlock() {
  const [timerLastSecondId, setTimerLastSecondId] =
    useState<ReturnType<typeof setTimeout>>();
  const timer = useAppSelector(selectTimer);
  const currentTaskName =
    useAppSelector(selectActiveTask).name ?? 'Создать задачу';
  const PomodoroNumber = useAppSelector(selectShowedPomodoroNumber);
  const dispatch = useAppDispatch();
  const timerSettings = useAppSelector(selectSettings);

  const { minutes, seconds } = getHoursAndMinutesFromSeconds(timer.time);

  const pomodoroTimerStates: timerStates[] = [
    'activePomodoro',
    'initialPomodoro',
    'pausePomodoro',
  ];

  useEffect(() => {
    const activePomodoroTimerState: timerStates = 'activePomodoro';

    if (timer.time <= 1) {
      if (timer.state === activePomodoroTimerState) {
        if (!timerLastSecondId) {
          setTimerLastSecondId(
            setTimeout(() => {
              dispatch(decrementActiveTaskPomodoroAmount());
              setTimerLastSecondId(undefined);
            }, 1000)
          );
        }
      } else {
        clearTimeout(timerLastSecondId);
        setTimerLastSecondId(undefined);
      }
    }
  }, [dispatch, timer.state, timer.time, timerLastSecondId]);

  function handleStartClick() {
    const timerId = setInterval(() => {
      dispatch(timerGo(timerSettings));
      dispatch(
        addDayTime(
          pomodoroTimerStates.includes(timer.state) ? 'pomodoro' : 'break'
        )
      );
    }, 1000);

    dispatch(startTimer({ timerId, timerSettings }));
    dispatch(clearPauseIdTimer());
  }

  function handlePauseClick() {
    dispatch(timerPause());

    const timerId = setInterval(() => {
      dispatch(addDayTime('pause'));
    }, 1000);

    dispatch(startPauseTimer(timerId));
  }

  function handleStopClick() {
    dispatch(timerStop(timerSettings));
    dispatch(addDayStop());
  }

  function handleSkipClick() {
    dispatch(timerSkip(timerSettings));
    dispatch(clearPauseIdTimer());
  }

  function handleDoneClick() {
    dispatch(timerDone(timerSettings));
    dispatch(clearPauseIdTimer());
  }

  const startButtonStates: timerStates[] = ['initialPomodoro', 'initialBreak'];
  const pauseButtonStates: timerStates[] = ['activePomodoro', 'activeBreak'];
  const continueButtonStates: timerStates[] = ['pausePomodoro', 'pauseBreak'];
  const stopButtonStates: timerStates[] = ['initialPomodoro', 'activePomodoro'];
  const skipButtonStates: timerStates[] = [
    'initialBreak',
    'activeBreak',
    'pauseBreak',
  ];
  const doneButtonStates: timerStates[] = ['pausePomodoro'];

  return (
    <div className={`fixed-container ${styles.timerBlock}`}>
      <div className={`${styles.header} ${styles[`header_${timer.state}`]}`}>
        <span className={styles.headerTaskName}>{currentTaskName}</span>
        <span>Помидор {PomodoroNumber}</span>
      </div>

      <div className={styles.body}>
        <Link className={`button ${styles.settingsButton}`} to={'settings'}>
          <SettingsIcon />
        </Link>

        <div className={`${styles.time} ${styles[`time_${timer.state}`]}`}>
          {zeroPad(minutes, 2)}:{zeroPad(seconds, 2)}
        </div>

        <div className={styles.taskDescription}>
          <span className={styles.taskNumber}>Задача {PomodoroNumber} - </span>
          {currentTaskName}
        </div>

        <div className={styles.buttonsContainer}>
          {startButtonStates.includes(timer.state) && (
            <button
              className={`button ${styles.timerButton} ${styles.startButton}`}
              onClick={handleStartClick}
            >
              Старт
            </button>
          )}

          {pauseButtonStates.includes(timer.state) && (
            <button
              className={`button ${styles.timerButton} ${styles.pauseButton}`}
              onClick={handlePauseClick}
            >
              Пауза
            </button>
          )}

          {continueButtonStates.includes(timer.state) && (
            <button
              className={`button ${styles.timerButton} ${styles.continueButton}`}
              onClick={handleStartClick}
            >
              Продолжить
            </button>
          )}

          {stopButtonStates.includes(timer.state) && (
            <button
              className={`button ${styles.timerButton} ${styles.stopButton}`}
              onClick={handleStopClick}
              disabled={timer.state === 'initialPomodoro'}
            >
              Стоп
            </button>
          )}

          {skipButtonStates.includes(timer.state) && (
            <button
              className={`button ${styles.timerButton} ${styles.skipButton}`}
              onClick={handleSkipClick}
            >
              Пропустить
            </button>
          )}

          {doneButtonStates.includes(timer.state) && (
            <button
              className={`button ${styles.timerButton} ${styles.doneButton}`}
              onClick={handleDoneClick}
            >
              Сделано
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
