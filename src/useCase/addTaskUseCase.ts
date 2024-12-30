import {Task} from '../domain/task'
import type {ITaskRepository} from '../domain/taskRepository'

export const AddTaskUseCaseErrorCode = {
  DESCRIPTION_REQUIRED: 'DescriptionRequired',
  INTERNAL_ERROR: 'InternalError',
} as const
export type AddTaskUseCaseErrorCode =
  (typeof AddTaskUseCaseErrorCode)[keyof typeof AddTaskUseCaseErrorCode]

export interface AddTaskUseCaseProps {
  taskRepository: ITaskRepository
}

export class AddTaskUseCase {
  private readonly taskRepository: ITaskRepository

  constructor(props: AddTaskUseCaseProps) {
    this.taskRepository = props.taskRepository
  }

  run(description: string) {
    if (!description) {
      throw new Error(AddTaskUseCaseErrorCode.DESCRIPTION_REQUIRED)
    }
    const task = Task.create(description)
    try {
      this.taskRepository.insert(task)
    } catch (error) {
      throw new Error(AddTaskUseCaseErrorCode.INTERNAL_ERROR)
    }
  }
}
