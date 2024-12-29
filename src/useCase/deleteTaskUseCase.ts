import type {ITaskRepository} from '../domain/taskRepository'

export const DeleteTaskUseCaseErrorCode = {
  INTERNAL_ERROR: 'InternalError',
  ID_REQUIRED: 'IdRequired',
  TASK_NOT_FOUND: 'TaskNotFound',
} as const
export type DeleteTaskUseCaseErrorCode =
  (typeof DeleteTaskUseCaseErrorCode)[keyof typeof DeleteTaskUseCaseErrorCode]

export interface DeleteTaskUseCaseProps {
  taskRepository: ITaskRepository
}
export class DeleteTaskUseCase {
  private taskRepository: ITaskRepository

  constructor(props: DeleteTaskUseCaseProps) {
    this.taskRepository = props.taskRepository
  }

  run(id: string) {
    if (!id) {
      throw new Error(DeleteTaskUseCaseErrorCode.ID_REQUIRED)
    }
    const task = this.taskRepository.find(id)
    if (!task) {
      throw new Error(DeleteTaskUseCaseErrorCode.TASK_NOT_FOUND)
    }
    try {
      this.taskRepository.delete(task)
    } catch (error: unknown) {
      throw new Error(DeleteTaskUseCaseErrorCode.INTERNAL_ERROR)
    }
  }
}
