import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

export interface settingsState {
  pomodoroTimeMinutes: number;
  breakTimeMinutes: number;
  bigBreakTimeMinutes: number;
  bigBreakFrequency: number;
}

const initialState: settingsState = {
  pomodoroTimeMinutes: 25 * 60,
  breakTimeMinutes: 5 * 60,
  bigBreakTimeMinutes: 15 * 60,
  bigBreakFrequency: 4,
};

function saveSettings(state: settingsState) {
  localStorage.setItem('settings', JSON.stringify(state));
}

const getCorrectedMinutes = (minutes: number) =>
  Math.max(Math.min(minutes, 59), 1);

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    loadSettings: () => {
      return (
        JSON.parse(localStorage.getItem('settings') ?? 'null') ?? initialState
      );
    },
    setNewPomodoroTimeMinutes: (state, action: PayloadAction<number>) => {
      state.pomodoroTimeMinutes = getCorrectedMinutes(action.payload) * 60;

      saveSettings(state);
    },
    setNewBreakTimeMinutes: (state, action: PayloadAction<number>) => {
      state.breakTimeMinutes = getCorrectedMinutes(action.payload) * 60;

      saveSettings(state);
    },
    setNewBigBreakTimeMinutes: (state, action: PayloadAction<number>) => {
      state.bigBreakTimeMinutes = getCorrectedMinutes(action.payload) * 60;

      saveSettings(state);
    },
    setNewBigBreakFrequency: (state, action: PayloadAction<number>) => {
      state.bigBreakFrequency = Math.max(Math.min(action.payload, 99), 1);

      saveSettings(state);
    },
  },
});

export const {
  loadSettings,
  setNewPomodoroTimeMinutes,
  setNewBreakTimeMinutes,
  setNewBigBreakTimeMinutes,
  setNewBigBreakFrequency,
} = settingsSlice.actions;

export const selectSettings = (state: RootState) => state.settings;
export const selectPomodoroTimeMinutes = (state: RootState) =>
  state.settings.pomodoroTimeMinutes;
