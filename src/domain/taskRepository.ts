import type {Task, TaskStatus} from './task'

export const TaskRepositoryErrorCode = {
  FILE_NOT_FOUND: 'FileNotFound',
  FILE_WRITE_ERROR: 'FileWriteError',
  TASK_ALREADY_EXISTS: 'TaskAlreadyExists',
  TASK_NOT_FOUND: 'TaskNotFound',
  INTERNAL_ERROR: 'InternalError',
} as const
export type TaskRepositoryErrorCode =
  (typeof TaskRepositoryErrorCode)[keyof typeof TaskRepositoryErrorCode]

export interface ITaskRepository {
  insert(task: Task): void
  update(task: Task): void
  delete(task: Task): void
  list(filterByStatus?: TaskStatus): Task[]
  find(id: string): Task | undefined
}
