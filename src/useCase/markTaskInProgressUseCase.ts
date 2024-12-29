import {type Task, TaskStatus} from '../domain/task'
import type {ITaskRepository} from '../domain/taskRepository'

export const MarkTaskInProgressUseCaseErrorCode = {
  ID_REQUIRED: 'IdRequired',
  INTERNAL_ERROR: 'InternalError',
  TASK_NOT_FOUND: 'TaskNotFound',
} as const
export type MarkTaskInProgressUseCaseErrorCode =
  (typeof MarkTaskInProgressUseCaseErrorCode)[keyof typeof MarkTaskInProgressUseCaseErrorCode]

export interface MarkTaskInProgressUseCaseProps {
  taskRepository: ITaskRepository
}

export class MarkTaskInProgressUseCase {
  private taskRepository: ITaskRepository
  constructor(props: MarkTaskInProgressUseCaseProps) {
    this.taskRepository = props.taskRepository
  }

  run(id: string): void {
    if (!id) {
      throw new Error(MarkTaskInProgressUseCaseErrorCode.ID_REQUIRED)
    }
    let task: Task | undefined
    try {
      task = this.taskRepository.find(id)
    } catch (error: unknown) {
      throw new Error(MarkTaskInProgressUseCaseErrorCode.INTERNAL_ERROR)
    }
    if (!task) {
      throw new Error(MarkTaskInProgressUseCaseErrorCode.TASK_NOT_FOUND)
    }
    task.mark(TaskStatus.IN_PROGRESS)
    try {
      this.taskRepository.update(task)
    } catch (error: unknown) {
      throw new Error(MarkTaskInProgressUseCaseErrorCode.INTERNAL_ERROR)
    }
  }
}
