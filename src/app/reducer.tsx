"use client";

import { Task } from "./task";

interface TaskState {
  tasks: Task[];
}
interface TaskAction {
  type:
    | "new"
    | "edit"
    | "complete"
    | "uncomplete"
    | "complete-all"
    | "remove"
    | "remove-all";
  payload: Task;
}
export function tasksReducer(state: TaskState, action: TaskAction) {
  switch (action.type) {
    case "new":
      return { ...state, tasks: [...state.tasks, action.payload] };
    case "edit":
      return {
        ...state,
        tasks: state.tasks.map((task) => {
          return task.createdAt === action.payload.createdAt
            ? ({ ...task, label: action.payload.label } as Task)
            : task;
        }),
      };
    case "complete":
      return {
        ...state,
        tasks: state.tasks.map((task) => {
          return task.createdAt === action.payload.createdAt
            ? ({ ...task, completed: true, completedAt: new Date() } as Task)
            : task;
        }),
      };
    case "uncomplete":
      return {
        ...state,
        tasks: state.tasks.map((task) => {
          return task.createdAt === action.payload.createdAt
            ? ({ ...task, completed: false, completedAt: undefined } as Task)
            : task;
        }),
      };
    case "complete-all":
      return {
        ...state,
        tasks: state.tasks.map((task) => {
          return {
            ...task,
            completed: true,
            completedAt: task.completedAt || new Date(),
          };
        }),
      };
    case "remove-all":
      return { ...state, tasks: [] };
    case "remove":
      return {
        ...state,
        tasks: state.tasks.filter(
          (task) => task.createdAt !== action.payload.createdAt,
        ),
      };
    default:
      return state;
  }
}
