import { randomUUID } from "node:crypto"

export const TaskStatus = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  DONE: 'done',
} as const
export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus]

export interface Task {
  id: string
  description: string
  status: TaskStatus
  createdAt: string
  updatedAt: string
}
export const Task = {
  create(description: string): Task {
    return {
      id: randomUUID(),
      description,
      status: TaskStatus.TODO,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }
}