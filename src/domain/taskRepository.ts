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
