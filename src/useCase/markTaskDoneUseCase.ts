import type {ITaskRepository} from '../domain/taskRepository'

export const MarkTaskDoneUseCaseErrorCode = {
  ID_REQUIRED: 'ID_REQUIRED',
  TASK_NOT_FOUND: 'TASK_NOT_FOUND',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
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
    throw new Error('Not implemented')
  }
}
