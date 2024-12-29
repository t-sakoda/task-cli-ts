import type {Task} from '../domain/task'
import type {ITaskRepository} from '../domain/taskRepository'

export const ListAllTasksUseCaseErrorCode = {
  INTERNAL_ERROR: 'InternalError',
} as const
export type ListAllTasksUseCaseErrorCode =
  (typeof ListAllTasksUseCaseErrorCode)[keyof typeof ListAllTasksUseCaseErrorCode]

export interface ListAllTasksUseCaseProps {
  taskRepository: ITaskRepository
}

export class ListAllTasksUseCase {
  private taskRepository: ITaskRepository

  constructor(props: ListAllTasksUseCaseProps) {
    this.taskRepository = props.taskRepository
  }

  run(): Task[] {
    try {
      return this.taskRepository.list()
    } catch {
      throw new Error(ListAllTasksUseCaseErrorCode.INTERNAL_ERROR)
    }
  }
}
