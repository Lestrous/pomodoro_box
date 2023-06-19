import React from 'react';
import styles from './header.scss';
import { Link } from 'react-router-dom';
import { EqualizerIcon, TomatoIcon } from '../Icons';

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <nav className="fixed-container">
        <ul className={`ul ${styles.listContainer}`}>
          <li>
            <Link to="/" className={`link ${styles.headerPomodoroContainer}`}>
              <TomatoIcon className={styles.pomodoroIcon} />
              pomodoro_box
            </Link>
          </li>
          <li>
            <Link
              to="/statistics"
              className={`link ${styles.headerStatisticsContainer}`}
            >
              <EqualizerIcon className={styles.equalizerIcon} />
              Статистика
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
