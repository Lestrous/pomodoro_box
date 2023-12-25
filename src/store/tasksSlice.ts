import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { timerSlice } from './timerSlice';
import { nanoid } from 'nanoid';
import { toast } from 'react-toastify';

export type taskStates = 'regular' | 'editing';

export interface TaskState {
  id: string;
  name: string;
  pomodoroAmount: number;
  state: taskStates;
}

export type TasksListState = TaskState[];

const initialState: TasksListState = [
  {
    id: nanoid(),
    name: 'Первая задача',
    pomodoroAmount: 1,
    state: 'regular',
  },
  {
    id: nanoid(),
    name: 'Вторая задача',
    pomodoroAmount: 2,
    state: 'regular',
  },
];

function saveTasks(state: TasksListState) {
  localStorage.setItem('tasks', JSON.stringify(state));
}

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    loadTasks: () => {
      return (
        JSON.parse(localStorage.getItem('tasks') ?? 'null') ?? initialState
      );
    },
    incrementPomodoroAmount: (state, action: PayloadAction<string>) => {
      const taskIndex = state.findIndex((task) => task.id === action.payload);
      state[taskIndex].pomodoroAmount += 1;

      saveTasks(state);
    },
    decrementPomodoroAmount: (state, action: PayloadAction<string>) => {
      const taskIndex = state.findIndex((task) => task.id === action.payload);
      state[taskIndex].pomodoroAmount = Math.max(
        0,
        state[taskIndex].pomodoroAmount - 1
      );

      saveTasks(state);
    },
    decrementActiveTaskPomodoroAmount: (state) => {
      state[0].pomodoroAmount = Math.max(0, state[0].pomodoroAmount - 1);

      saveTasks(state);
    },
    addTask: (state: TasksListState, action: PayloadAction<string>) => {
      if (!action.payload) {
        return;
      }

      state.push({
        id: nanoid(),
        name: action.payload,
        pomodoroAmount: 1,
        state: 'regular',
      });

      toast.success('Новая задача добавлена!');

      saveTasks(state);
    },
    deleteTask: (state: TasksListState, action: PayloadAction<string>) => {
      if (state.length === 1) {
        toast.error('Нельзя удалить единственную задачу!');
        return;
      }

      const taskIndex = state.findIndex((task) => task.id === action.payload);
      state.splice(taskIndex, 1);

      saveTasks(state);

      toast.success('Задача успешно удалена!');
    },
    setTaskState: (
      state: TasksListState,
      action: PayloadAction<{ id: string; newTaskState: taskStates }>
    ) => {
      const taskIndex = state.findIndex(
        (task) => task.id === action.payload.id
      );
      state[taskIndex].state = action.payload.newTaskState;
    },
    editTask: (
      state: TasksListState,
      action: PayloadAction<{ id: string; newTaskName: string }>
    ) => {
      const taskIndex = state.findIndex(
        (task) => task.id === action.payload.id
      );
      state[taskIndex].name = action.payload.newTaskName;
      state[taskIndex].state = 'regular';

      toast.success('Задача успешно отредактирована!');

      saveTasks(state);
    },
    moveTaskUp: (state: TasksListState, action: PayloadAction<string>) => {
      const taskIndex = state.findIndex((task) => task.id === action.payload);

      if (taskIndex === 0) {
        return;
      }

      state.splice(taskIndex - 1, 2, state[taskIndex], state[taskIndex - 1]);

      saveTasks(state);
    },
    moveTaskDown: (state: TasksListState, action: PayloadAction<string>) => {
      const taskIndex = state.findIndex((task) => task.id === action.payload);

      if (taskIndex === state.length - 1) {
        return;
      }

      state.splice(taskIndex, 2, state[taskIndex + 1], state[taskIndex]);

      saveTasks(state);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(timerSlice.actions.timerDone, (state) => {
      state[0].pomodoroAmount = Math.max(0, state[0].pomodoroAmount - 1);

      saveTasks(state);
    });
  },
});

export const {
  loadTasks,
  incrementPomodoroAmount,
  decrementPomodoroAmount,
  decrementActiveTaskPomodoroAmount,
  addTask,
  deleteTask,
  setTaskState,
  editTask,
  moveTaskUp,
  moveTaskDown,
} = tasksSlice.actions;

export const selectTasks = (state: RootState) => state.tasks;
export const selectActiveTask = (state: RootState) => state.tasks[0];
