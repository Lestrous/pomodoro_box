import React, { ChangeEvent, useState } from 'react';
import styles from './taskItem.scss';
import { editTask, TaskState } from '../../../../store/tasksSlice';
import { Dropdown } from '../../../Dropdown';
import { TaskItemMenu } from './TaskItemMenu';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { MenuIcon } from '../../../Icons';

type TaskItemProps = TaskState;

export function TaskItem({ id, name, pomodoroAmount, state }: TaskItemProps) {
  const [taskName, setTaskName] = useState(name);
  const dispatch = useAppDispatch();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setTaskName(event.target.value);
  }

  function handleBlur(event: ChangeEvent<HTMLInputElement>) {
    dispatch(editTask({ id, newTaskName: event.target.value }));
  }

  return (
    <div className={styles.tasksItem}>
      <div className={styles.pomodoroAmount}>{pomodoroAmount}</div>

      {state === 'regular' && (
        <span className={styles.taskName}>{taskName}</span>
      )}

      {state === 'editing' && (
        <input
          className={styles.taskNameInput}
          value={taskName}
          onChange={handleChange}
          onBlur={handleBlur}
          autoFocus
        />
      )}

      <div className={styles.taskItemMenuContainer}>
        <Dropdown
          button={
            <button className={`button ${styles.taskItemMenuButton}`}>
              <MenuIcon />
            </button>
          }
          openSide={'bottom'}
        >
          <div className={styles.dropdown}>
            <TaskItemMenu id={id} />
          </div>
        </Dropdown>
      </div>
    </div>
  );
}
