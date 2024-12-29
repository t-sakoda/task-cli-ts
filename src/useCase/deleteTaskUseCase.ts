import type {ITaskRepository} from '../domain/taskRepository'

export interface DeleteTaskUseCaseProps {
  taskRepository: ITaskRepository
}
export class DeleteTaskUseCase {
  private taskRepository: ITaskRepository

  constructor(props: DeleteTaskUseCaseProps) {
    this.taskRepository = props.taskRepository
  }

  run(id: string) {
    throw new Error('Not implemented')
  }
}
