import React from 'react';
import styles from './mainPage.scss';
import { TasksBlock } from '../TasksBlock';
import { TimerBlock } from '../TimerBlock';
import { Outlet } from 'react-router-dom';

export function MainPage() {
  return (
    <main className={`fixed-container ${styles.mainPage}`}>
      <div className={styles.leftSide}>
        <div className={styles.textInstruction}>
          <h3>Ура! Теперь можно начать работать:</h3>

          <ul>
            <li className={styles.instructionItem}>
              Выберите категорию и напишите название текущей задачи
            </li>
            <li className={styles.instructionItem}>
              Запустите таймер («помидор»)
            </li>
            <li className={styles.instructionItem}>
              Работайте пока «помидор» не прозвонит
            </li>
            <li className={styles.instructionItem}>
              Сделайте короткий перерыв (3-5 минут)
            </li>
            <li className={styles.instructionItem}>
              Продолжайте работать «помидор» за «помидором», пока задачи не
              будут выполнены. Каждые 4 «помидора» делайте длинный перерыв
              (15-30 минут).
            </li>
          </ul>
        </div>

        <TasksBlock />
      </div>

      <div className={styles.rightSide}>
        <TimerBlock />
      </div>

      <Outlet />
    </main>
  );
}
