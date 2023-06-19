import React from 'react';
import styles from './taskItemMenu.scss';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import {
  decrementPomodoroAmount,
  deleteTask,
  incrementPomodoroAmount,
  moveTaskDown,
  moveTaskUp,
  setTaskState,
} from '../../../../../store/tasksSlice';
import {
  CircleArrowIcon,
  CircleMinusIcon,
  CirclePlusIcon,
  GarbageIcon,
  PencilIcon,
} from '../../../../Icons';

type TaskItemMenuProps = {
  id: string;
};

export function TaskItemMenu({ id }: TaskItemMenuProps) {
  const dispatch = useAppDispatch();

  function handleIncrementClick() {
    dispatch(incrementPomodoroAmount(id));
  }

  function handleDecrementClick() {
    dispatch(decrementPomodoroAmount(id));
  }

  function handleSetTaskStateClick() {
    dispatch(setTaskState({ id, newTaskState: 'editing' }));
  }

  function handleDeleteTaskClick() {
    dispatch(deleteTask(id));
  }

  function handleMoveTaskUpClick() {
    dispatch(moveTaskUp(id));
  }

  function handleMoveTaskDownClick() {
    dispatch(moveTaskDown(id));
  }

  return (
    <div className={styles.tasksItemMenu}>
      <button
        className={`button ${styles.tasksItemMenuButton}`}
        onClick={handleIncrementClick}
      >
        <div className={styles.tasksItemMenuButtonIconContainer}>
          <CirclePlusIcon />
        </div>
        Увеличить
      </button>

      <button
        className={`button ${styles.tasksItemMenuButton}`}
        onClick={handleDecrementClick}
      >
        <div className={styles.tasksItemMenuButtonIconContainer}>
          <CircleMinusIcon />
        </div>
        Уменьшить
      </button>

      <button
        className={`button ${styles.tasksItemMenuButton}`}
        onClick={handleSetTaskStateClick}
      >
        <div className={styles.tasksItemMenuButtonIconContainer}>
          <PencilIcon />
        </div>
        Редактировать
      </button>

      <button
        className={`button ${styles.tasksItemMenuButton}`}
        onClick={handleDeleteTaskClick}
      >
        <div className={styles.tasksItemMenuButtonIconContainer}>
          <GarbageIcon />
        </div>
        Удалить
      </button>

      <button
        className={`button ${styles.tasksItemMenuButton}`}
        onClick={handleMoveTaskUpClick}
      >
        <div className={styles.tasksItemMenuButtonIconContainer}>
          <CircleArrowIcon />
        </div>
        Выше
      </button>

      <button
        className={`button ${styles.tasksItemMenuButton}`}
        onClick={handleMoveTaskDownClick}
      >
        <div className={styles.tasksItemMenuButtonIconContainer}>
          <CircleArrowIcon className={styles.invertedArrow} />
        </div>
        Ниже
      </button>
    </div>
  );
}
