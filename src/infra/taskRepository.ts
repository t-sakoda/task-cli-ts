import type {ITaskRepository} from '../domain/taskRepository'

export class TaskRepository implements ITaskRepository {
  add(taskName: string): void {
    throw new Error('Method not implemented.')
  }
  update(taskId: string, taskName: string): void {
    throw new Error('Method not implemented.')
  }
  delete(taskId: string): void {
    throw new Error('Method not implemented.')
  }
  markInProgress(taskId: string): void {
    throw new Error('Method not implemented.')
  }
  markDone(taskId: string): void {
    throw new Error('Method not implemented.')
  }
  listAll(): void {
    throw new Error('Method not implemented.')
  }
  listDone(): void {
    throw new Error('Method not implemented.')
  }
  listTodo(): void {
    throw new Error('Method not implemented.')
  }
  listInProgress(): void {
    throw new Error('Method not implemented.')
  }
}
