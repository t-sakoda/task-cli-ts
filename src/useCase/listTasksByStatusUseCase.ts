import {type Task, TaskStatus} from '../domain/task'
import type {ITaskRepository} from '../domain/taskRepository'

export const ListTasksByStatusUseCaseErrorCode = {
  INTERNAL_ERROR: 'InternalError',
  INVALID_STATUS: 'InvalidStatus',
} as const
export type ListTasksByStatusUseCaseErrorCode =
  (typeof ListTasksByStatusUseCaseErrorCode)[keyof typeof ListTasksByStatusUseCaseErrorCode]

export interface ListTasksByStatusUseCaseProps {
  taskRepository: ITaskRepository
}

export class ListTasksByStatusUseCase {
  private taskRepository: ITaskRepository

  constructor(props: ListTasksByStatusUseCaseProps) {
    this.taskRepository = props.taskRepository
  }

  run(status?: TaskStatus): Task[] {
    if (status && !Object.values(TaskStatus).includes(status)) {
      throw new Error(ListTasksByStatusUseCaseErrorCode.INVALID_STATUS)
    }
    try {
      return this.taskRepository.list(status)
    } catch {
      throw new Error(ListTasksByStatusUseCaseErrorCode.INTERNAL_ERROR)
    }
  }
}
