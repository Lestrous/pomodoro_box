import React, { ChangeEvent, useEffect, useState } from 'react';
import styles from './settingsModal.scss';
import { createPortal } from 'react-dom';
import { useModalClose } from '../hooks/useModalClose';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppSelector';
import {
  selectSettings,
  setNewBigBreakTimeMinutes,
  setNewBigBreakFrequency,
  setNewBreakTimeMinutes,
  setNewPomodoroTimeMinutes,
} from '../../store/settingsSlice';
import { useAppDispatch } from '../hooks/useAppDispatch';

export function SettingsModal() {
  const navigate = useNavigate();
  const [ref] = useModalClose({ onClose: () => navigate('/') });
  const modalRoot = document.querySelector('#modal_root');
  const {
    pomodoroTimeMinutes,
    breakTimeMinutes,
    bigBreakTimeMinutes,
    bigBreakFrequency,
  } = useAppSelector(selectSettings);
  const dispatch = useAppDispatch();

  const [settingsPomodoroTimeMinutes, setSettingsPomodoroTimeMinutes] =
    useState<typeof pomodoroTimeMinutes>(pomodoroTimeMinutes / 60);
  const [settingsBreakTimeMinutes, setSettingsBreakTimeMinutes] = useState<
    typeof pomodoroTimeMinutes
  >(breakTimeMinutes / 60);
  const [settingsBigBreakTimeMinutes, setSettingsBigBreakTimeMinutes] =
    useState<typeof pomodoroTimeMinutes>(bigBreakTimeMinutes / 60);
  const [settingsBigBreakFrequency, setSettingsBigBreakFrequency] =
    useState<typeof pomodoroTimeMinutes>(bigBreakFrequency);

  useEffect(() => {
    setSettingsPomodoroTimeMinutes(pomodoroTimeMinutes / 60);
    setSettingsBreakTimeMinutes(breakTimeMinutes / 60);
    setSettingsBigBreakTimeMinutes(bigBreakTimeMinutes / 60);
    setSettingsBigBreakFrequency(bigBreakFrequency);
  }, [
    bigBreakTimeMinutes,
    bigBreakFrequency,
    breakTimeMinutes,
    pomodoroTimeMinutes,
  ]);

  function handlePomodoroTimeChange(event: ChangeEvent<HTMLInputElement>) {
    const value = Number(event.target.value);
    setSettingsPomodoroTimeMinutes(value);
    dispatch(setNewPomodoroTimeMinutes(value));
  }

  function handleBreakTimeMinutesChange(event: ChangeEvent<HTMLInputElement>) {
    const value = Number(event.target.value);
    setSettingsBreakTimeMinutes(value);
    dispatch(setNewBreakTimeMinutes(value));
  }

  function handleBigBreakTimeMinutesChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const value = Number(event.target.value);
    setSettingsBigBreakTimeMinutes(value);
    dispatch(setNewBigBreakTimeMinutes(value));
  }

  function handleBigBreakFrequencyChange(event: ChangeEvent<HTMLInputElement>) {
    const value = Number(event.target.value);
    setSettingsBigBreakFrequency(value);
    dispatch(setNewBigBreakFrequency(value));
  }

  if (!modalRoot) {
    return null;
  }

  return createPortal(
    <div className={styles.modalContainer}>
      <div className={styles.modal} ref={ref}>
        <h3 className={styles.modalHeader}>Изменение настроек</h3>

        <div className={styles.settingsContainer}>
          <div className={styles.settingsItemName}>
            Продолжительность «помидора»
          </div>
          <input
            className={styles.settingsItemValue}
            type={'number'}
            min={1}
            max={59}
            value={settingsPomodoroTimeMinutes}
            onInput={handlePomodoroTimeChange}
          />

          <div className={styles.settingsItemName}>
            Продолжительность короткого перерыва
          </div>
          <input
            className={styles.settingsItemValue}
            type={'number'}
            min={1}
            max={59}
            value={settingsBreakTimeMinutes}
            onInput={handleBreakTimeMinutesChange}
          />

          <div className={styles.settingsItemName}>
            Продолжительность длинного перерыва
          </div>
          <input
            className={styles.settingsItemValue}
            type={'number'}
            min={1}
            max={99}
            value={settingsBigBreakTimeMinutes}
            onInput={handleBigBreakTimeMinutesChange}
          />

          <div className={styles.settingsItemName}>
            Частота длинных перерывов
          </div>
          <input
            className={styles.settingsItemValue}
            type={'number'}
            min={1}
            max={99}
            value={settingsBigBreakFrequency}
            onInput={handleBigBreakFrequencyChange}
          />
        </div>
      </div>
    </div>,
    modalRoot
  );
}
