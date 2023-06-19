import React from 'react';
import styles from './page404.scss';
import { TomatoIcon } from '../Icons';

export function Page404() {
  return (
    <div className={`fixed-container ${styles.page404}`}>
      <TomatoIcon className={styles.pomodoroIcon} />
      <h3>404 — страница не найдена</h3>
    </div>
  );
}
