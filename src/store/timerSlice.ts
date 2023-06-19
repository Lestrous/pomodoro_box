import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { settingsSlice, settingsState } from './settingsSlice';
import { toast } from 'react-toastify';

export type timerStates =
  | 'initialPomodoro'
  | 'initialBreak'
  | 'activePomodoro'
  | 'activeBreak'
  | 'pausePomodoro'
  | 'pauseBreak'
  | 'stop';

type timerActions =
  | 'start'
  | 'pause'
  | 'stop'
  | 'skip'
  | 'done'
  | 'go'
  | 'continue';

interface TimerState {
  time: number;
  state: timerStates;
  timerId: ReturnType<typeof setInterval> | undefined;
  pomodoroNumber: number;
  bigBreakFrequency: number;
  breakNumber: number;
}

const initialState: TimerState = {
  time: 25 * 60,
  state: 'initialPomodoro',
  timerId: undefined,
  pomodoroNumber: 1,
  bigBreakFrequency: 4,
  breakNumber: 1,
};

function saveTimer(state: TimerState) {
  localStorage.setItem('timer', JSON.stringify(state));
}

const isBigBreak = (state: TimerState) =>
  state.breakNumber % state.bigBreakFrequency === 0 && state.breakNumber !== 0;

function getStateTime(
  state: TimerState,
  { pomodoroTimeMinutes, breakTimeMinutes, bigBreakTimeMinutes }: settingsState
) {
  switch (state.state) {
    default:
    case 'initialPomodoro':
      return pomodoroTimeMinutes;
    case 'initialBreak':
      if (isBigBreak(state)) {
        state.breakNumber = 0;

        return bigBreakTimeMinutes;
      }

      return breakTimeMinutes;
  }
}

function getNextState(state: TimerState, action: timerActions) {
  switch (state.state) {
    case 'initialPomodoro':
      return 'activePomodoro';
    case 'initialBreak':
      switch (action) {
        default:
        case 'start':
          return 'activeBreak';
        case 'skip':
          return 'initialPomodoro';
      }
    case 'activePomodoro':
      switch (action) {
        case 'pause':
          return 'pausePomodoro';
        case 'stop':
          return 'initialPomodoro';
        default:
        case 'go':
          return 'initialBreak';
      }
    case 'activeBreak':
      switch (action) {
        case 'pause':
          return 'pauseBreak';
        default:
        case 'skip':
        case 'go':
          return 'initialPomodoro';
      }
    case 'pausePomodoro':
      switch (action) {
        default:
        case 'start':
          return 'activePomodoro';
        case 'done':
          return 'initialBreak';
      }
    case 'pauseBreak':
      switch (action) {
        default:
        case 'start':
          return 'activeBreak';
        case 'skip':
          return 'initialPomodoro';
      }
    case 'stop':
      return 'initialPomodoro';
  }
}

function getLoadedCorrectedState(state: TimerState) {
  switch (state.state) {
    case 'initialPomodoro':
      return 'initialPomodoro';
    case 'initialBreak':
      return 'initialBreak';
    case 'activePomodoro':
      return 'pausePomodoro';
    case 'activeBreak':
      return 'pauseBreak';
    case 'pausePomodoro':
      return 'pausePomodoro';
    case 'pauseBreak':
      return 'pauseBreak';
    case 'stop':
      return 'stop';
  }
}

export const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    loadTimer: (
      state,
      action: PayloadAction<{
        pomodoroTimeMinutes: number;
        bigBreakFrequency: number;
      }>
    ) => {
      const initialStateCorrected = { ...initialState };
      initialStateCorrected.time = action.payload.pomodoroTimeMinutes;
      initialStateCorrected.bigBreakFrequency =
        action.payload.bigBreakFrequency;

      const loadedTimer = JSON.parse(
        localStorage.getItem('timer') ?? 'null'
      ) ?? { ...initialStateCorrected };

      loadedTimer.state = getLoadedCorrectedState(loadedTimer);

      return loadedTimer;
    },
    startTimer: (
      state,
      action: PayloadAction<{
        timerId: ReturnType<typeof setInterval>;
        timerSettings: settingsState;
      }>
    ) => {
      state.timerId = action.payload.timerId;

      state.state = getNextState(state, 'start');

      saveTimer(state);
    },
    timerGo: (state, action: PayloadAction<settingsState>) => {
      state.time -= 60;

      if (state.time === 0) {
        clearInterval(state.timerId);

        if (state.state === 'activePomodoro') {
          state.pomodoroNumber++;

          toast.info('Помидор закончен, время отдыхать!');
        } else {
          state.breakNumber++;

          toast.info('Перерыв закончен!');
        }

        state.state = getNextState(state, 'go');
        state.time = getStateTime(state, action.payload);
      }

      saveTimer(state);
    },
    timerPause: (state) => {
      clearInterval(state.timerId);

      state.state = getNextState(state, 'pause');

      saveTimer(state);
    },
    timerStop: (state, action: PayloadAction<settingsState>) => {
      clearInterval(state.timerId);

      state.state = getNextState(state, 'stop');
      state.time = getStateTime(state, action.payload);

      saveTimer(state);
    },
    timerSkip: (state, action: PayloadAction<settingsState>) => {
      clearInterval(state.timerId);

      state.breakNumber++;
      state.state = getNextState(state, 'skip');
      state.time = getStateTime(state, action.payload);

      saveTimer(state);
    },
    timerDone: (state, action: PayloadAction<settingsState>) => {
      clearInterval(state.timerId);

      state.pomodoroNumber++;

      state.state = getNextState(state, 'done');
      state.time = getStateTime(state, action.payload);

      saveTimer(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        settingsSlice.actions.setNewPomodoroTimeMinutes,
        (state, action: PayloadAction<number>) => {
          if (state.state === 'initialPomodoro') {
            state.time = action.payload * 60;

            saveTimer(state);
          }
        }
      )
      .addCase(
        settingsSlice.actions.setNewBreakTimeMinutes,
        (state, action: PayloadAction<number>) => {
          if (state.state === 'initialBreak' || !isBigBreak(state)) {
            state.time = action.payload * 60;

            saveTimer(state);
          }
        }
      )
      .addCase(
        settingsSlice.actions.setNewBigBreakTimeMinutes,
        (state, action: PayloadAction<number>) => {
          if (state.state === 'initialBreak' || isBigBreak(state)) {
            state.time = action.payload * 60;

            saveTimer(state);
          }
        }
      )
      .addCase(
        settingsSlice.actions.setNewBigBreakFrequency,
        (state, action: PayloadAction<number>) => {
          state.bigBreakFrequency = action.payload;

          saveTimer(state);
        }
      );
  },
});

export const {
  loadTimer,
  startTimer,
  timerGo,
  timerPause,
  timerStop,
  timerSkip,
  timerDone,
} = timerSlice.actions;

export const selectTimer = (state: RootState) => state.timer;
export const selectShowedPomodoroNumber = (state: RootState) =>
  state.timer.pomodoroNumber;
