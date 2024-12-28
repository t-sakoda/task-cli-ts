export const TaskRepositoryErrorCode = {
  FILE_NOT_FOUND: 'FileNotFound',
  FILE_WRITE_ERROR: 'FileWriteError',
} as const
export type TaskRepositoryErrorCode = typeof TaskRepositoryErrorCode[keyof typeof TaskRepositoryErrorCode]

export interface ITaskRepository {
  add(taskName: string): void
  update(taskId: string, taskName: string): void
  delete(taskId: string): void
  markInProgress(taskId: string): void
  markDone(taskId: string): void
  listAll(): void
  listDone(): void
  listTodo(): void
  listInProgress(): void
}
