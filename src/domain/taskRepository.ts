export const TaskRepositoryErrorCode = {
  FILE_NOT_FOUND: 'FileNotFound',
  FILE_WRITE_ERROR: 'FileWriteError',
} as const
export type TaskRepositoryErrorCode =
  (typeof TaskRepositoryErrorCode)[keyof typeof TaskRepositoryErrorCode]

export interface ITaskRepository {
  add(description: string): void
  update(id: string, description: string): void
  delete(id: string): void
  markInProgress(id: string): void
  markDone(id: string): void
  listAll(): void
  listDone(): void
  listTodo(): void
  listInProgress(): void
}
