import React, { ChangeEvent, FormEvent, useState } from 'react';
import styles from './tasksBlock.scss';
import { TasksList } from './TasksList';
import { useAppSelector } from '../hooks/useAppSelector';
import { addTask, selectTasks } from '../../store/tasksSlice';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { getConvertedHoursAndMinutesText } from '../utils/js/getConvertedHoursAndMinutesText';
import { selectPomodoroTimeMinutes } from '../../store/settingsSlice';

export function TasksBlock() {
  const [newTaskName, setNewTaskName] = useState('');
  const tasksList = useAppSelector(selectTasks);
  const pomodoroTimeMinutes = useAppSelector(selectPomodoroTimeMinutes);
  const dispatch = useAppDispatch();

  const selectTasksTimeLength = tasksList.reduce(
    (accumulator, currentTask) =>
      accumulator + currentTask.pomodoroAmount * pomodoroTimeMinutes,
    0
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    dispatch(addTask(newTaskName));
    setNewTaskName('');
  }

  function handleNewTaskNameChange(event: ChangeEvent<HTMLInputElement>) {
    setNewTaskName(event.target.value);
  }

  return (
    <form className={styles.tasksBlock} onSubmit={handleSubmit}>
      <input
        type="text"
        className={styles.taskNameInput}
        placeholder="Название задачи"
        value={newTaskName}
        onChange={handleNewTaskNameChange}
      />

      <button type="submit" className={`button ${styles.addTaskButton}`}>
        Добавить
      </button>

      <TasksList className={styles.tasksList} tasksList={tasksList} />

      <div className={styles.totalTime}>
        {getConvertedHoursAndMinutesText({
          totalSeconds: selectTasksTimeLength,
          hoursFormat: 'long',
          minutesFormat: 'middle',
          displayZeroHours: false,
        })}
      </div>
    </form>
  );
}
