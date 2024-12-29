import {type Task, TaskStatus} from '../domain/task'
import type {ITaskRepository} from '../domain/taskRepository'

export const MarkTaskDoneUseCaseErrorCode = {
  ID_REQUIRED: 'IdRequired',
  TASK_NOT_FOUND: 'TaskNotFound',
  INTERNAL_ERROR: 'InternalError',
} as const
export type MarkTaskDoneUseCaseErrorCode =
  (typeof MarkTaskDoneUseCaseErrorCode)[keyof typeof MarkTaskDoneUseCaseErrorCode]

export interface MarkTaskDoneUseCaseProps {
  taskRepository: ITaskRepository
}

export class MarkTaskDoneUseCase {
  private readonly taskRepository: ITaskRepository

  constructor(props: MarkTaskDoneUseCaseProps) {
    this.taskRepository = props.taskRepository
  }

  run(id: string) {
    if (!id) {
      throw new Error(MarkTaskDoneUseCaseErrorCode.ID_REQUIRED)
    }
    let task: Task | undefined
    try {
      task = this.taskRepository.find(id)
    } catch {
      throw new Error(MarkTaskDoneUseCaseErrorCode.INTERNAL_ERROR)
    }
    if (!task) {
      throw new Error(MarkTaskDoneUseCaseErrorCode.TASK_NOT_FOUND)
    }
    task.mark(TaskStatus.DONE)
    try {
      this.taskRepository.update(task)
    } catch {
      throw new Error(MarkTaskDoneUseCaseErrorCode.INTERNAL_ERROR)
    }
  }
}
