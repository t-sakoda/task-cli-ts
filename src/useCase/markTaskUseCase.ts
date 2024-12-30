import {type Task, TaskStatus} from '../domain/task'
import type {ITaskRepository} from '../domain/taskRepository'

export const MarkTaskUseCaseErrorCode = {
  ID_REQUIRED: 'IdRequired',
  INTERNAL_ERROR: 'InternalError',
  INVALID_STATUS: 'InvalidStatus',
  TASK_NOT_FOUND: 'TaskNotFound',
} as const
export type MarkTaskUseCaseErrorCode =
  (typeof MarkTaskUseCaseErrorCode)[keyof typeof MarkTaskUseCaseErrorCode]

export interface MarkTaskUseCaseProps {
  taskRepository: ITaskRepository
}

export class MarkTaskUseCase {
  private readonly taskRepository: ITaskRepository

  constructor(props: MarkTaskUseCaseProps) {
    this.taskRepository = props.taskRepository
  }

  run(id: string, status: TaskStatus): void {
    if (!id) {
      throw new Error(MarkTaskUseCaseErrorCode.ID_REQUIRED)
    }
    if (!status || !Object.values(TaskStatus).includes(status)) {
      throw new Error(MarkTaskUseCaseErrorCode.INVALID_STATUS)
    }
    let task: Task | undefined
    try {
      task = this.taskRepository.find(id)
    } catch {
      throw new Error(MarkTaskUseCaseErrorCode.INTERNAL_ERROR)
    }
    if (!task) {
      throw new Error(MarkTaskUseCaseErrorCode.TASK_NOT_FOUND)
    }
    task.mark(status)
    try {
      this.taskRepository.update(task)
    } catch {
      throw new Error(MarkTaskUseCaseErrorCode.INTERNAL_ERROR)
    }
  }
}
