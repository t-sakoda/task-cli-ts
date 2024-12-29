import type {Task} from '../domain/task'
import type {ITaskRepository} from '../domain/taskRepository'

export const UpdateTaskUseCaseErrorCode = {
  DESCRIPTION_REQUIRED: 'DescriptionRequired',
  ID_REQUIRED: 'IdRequired',
  INTERNAL_ERROR: 'InternalError',
  TASK_NOT_FOUND: 'TaskNotFound',
} as const
export type UpdateTaskUseCaseErrorCode =
  (typeof UpdateTaskUseCaseErrorCode)[keyof typeof UpdateTaskUseCaseErrorCode]

export interface UpdateTaskUseCaseProps {
  taskRepository: ITaskRepository
}

export class UpdateTaskUseCase {
  private taskRepository: ITaskRepository

  constructor(props: UpdateTaskUseCaseProps) {
    this.taskRepository = props.taskRepository
  }

  run(id: string, description: string): void {
    if (!id) {
      throw new Error(UpdateTaskUseCaseErrorCode.ID_REQUIRED)
    }
    if (!description) {
      throw new Error(UpdateTaskUseCaseErrorCode.DESCRIPTION_REQUIRED)
    }
    let task: Task | undefined
    try {
      task = this.taskRepository.find(id)
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error)
      } else {
        console.error('Unknown error')
      }
      throw new Error(UpdateTaskUseCaseErrorCode.INTERNAL_ERROR)
    }
    if (!task) {
      throw new Error(UpdateTaskUseCaseErrorCode.TASK_NOT_FOUND)
    }
    task.update(description)
    try {
      this.taskRepository.update(task)
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error)
      } else {
        console.error('Unknown error')
      }
      throw new Error(UpdateTaskUseCaseErrorCode.INTERNAL_ERROR)
    }
  }
}
