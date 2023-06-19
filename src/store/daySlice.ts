import { getDayFormatted } from '../shared/utils/js/getDayFormatted';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

export type dayTimeStates = 'pomodoro' | 'break' | 'pause';

interface DayState {
  day: string;
  pomodoroTime: number;
  breakTime: number;
  pauseTime: number;
  stopsAmount: number;
  timerId: ReturnType<typeof setInterval> | undefined;
}

export const initialDaySliceState: DayState = {
  day: getDayFormatted(),
  pomodoroTime: 0,
  breakTime: 0,
  pauseTime: 0,
  stopsAmount: 0,
  timerId: undefined,
};

function saveDay(state: DayState) {
  localStorage.setItem(state.day, JSON.stringify(state));
}

export const daySlice = createSlice({
  name: 'day',
  initialState: initialDaySliceState,
  reducers: {
    loadDay: () => {
      const currentDay = getDayFormatted();

      return (
        JSON.parse(localStorage.getItem(currentDay) ?? 'null') ??
        initialDaySliceState
      );
    },
    startPauseTimer: (
      state,
      action: PayloadAction<ReturnType<typeof setInterval>>
    ) => {
      state.timerId = action.payload;
    },
    addDayStop: (state) => {
      clearInterval(state.timerId);

      state.stopsAmount++;

      saveDay(state);
    },
    addDayTime: (state, action: PayloadAction<dayTimeStates>) => {
      switch (action.payload) {
        case 'pomodoro':
          state.pomodoroTime += 60;
          break;
        case 'break':
          state.breakTime += 60;
          break;
        case 'pause':
          state.pauseTime += 60;
          break;
      }

      saveDay(state);
    },
    clearPauseIdTimer: (state) => {
      clearInterval(state.timerId);
    },
  },
});

export const {
  loadDay,
  startPauseTimer,
  addDayStop,
  addDayTime,
  clearPauseIdTimer,
} = daySlice.actions;

export const selectDay = (state: RootState) => state.day;
