import React, { useEffect, useState } from 'react';
import './main.global.scss';
import { hot } from 'react-hot-loader/root';
import { Layout } from './shared/Layout';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Page404 } from './shared/Page404';
import { MainPage } from './shared/MainPage';
import { store } from './store/store';
import { StatisticsPage } from './shared/StatisticsPage';
import { useAppDispatch } from './shared/hooks/useAppDispatch';
import { useAppSelector } from './shared/hooks/useAppSelector';
import { loadSettings, selectSettings } from './store/settingsSlice';
import { loadTasks } from './store/tasksSlice';
import { loadTimer } from './store/timerSlice';
import { loadDay } from './store/daySlice';
import { deleteOldData } from './shared/utils/js/deleteOldData';
import { SettingsModal } from './shared/SettingsModal';

function AppComponentWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <React.StrictMode>
      <Provider store={store}>
        {mounted && (
          <BrowserRouter>
            <AppComponent />
          </BrowserRouter>
        )}
      </Provider>
    </React.StrictMode>
  );
}

function AppComponent() {
  const dispatch = useAppDispatch();

  const timerSettings = useAppSelector(selectSettings);

  useEffect(() => {
    dispatch(loadSettings());
    dispatch(loadTasks());
    dispatch(
      loadTimer({
        pomodoroTimeMinutes: timerSettings.pomodoroTimeMinutes,
        bigBreakFrequency: timerSettings.bigBreakFrequency,
      })
    );
    dispatch(loadDay());
    deleteOldData();
  }, [
    dispatch,
    timerSettings.bigBreakFrequency,
    timerSettings.pomodoroTimeMinutes,
  ]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="" element={<MainPage />}>
          <Route path="settings" element={<SettingsModal />} />
        </Route>
        <Route path="statistics" element={<StatisticsPage />} />
        <Route path="*" element={<Page404 />} />
      </Route>
    </Routes>
  );
}

export const App = hot(() => <AppComponentWrapper />);
