import React from 'react';
import styles from './tasksList.scss';
import { TaskItem } from './TaskItem';
import { TaskState } from '../../../store/tasksSlice';

interface ITasksListProps {
  tasksList: TaskState[];
  className?: string;
}

export function TasksList({ tasksList, className = '' }: ITasksListProps) {
  return (
    <div className={`${styles.tasksList} ${className}`}>
      {tasksList.map(({ id, name, pomodoroAmount, state }) => (
        <TaskItem
          id={id}
          key={id}
          name={name}
          pomodoroAmount={pomodoroAmount}
          state={state}
        />
      ))}
    </div>
  );
}
