import { configureStore } from '@reduxjs/toolkit';
import { tasksSlice } from './tasksSlice';
import { timerSlice } from './timerSlice';
import { settingsSlice } from './settingsSlice';
import { daySlice } from './daySlice';

export const store = configureStore({
  reducer: {
    tasks: tasksSlice.reducer,
    timer: timerSlice.reducer,
    settings: settingsSlice.reducer,
    day: daySlice.reducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
