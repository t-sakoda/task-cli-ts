import type {ITaskRepository} from '../domain/taskRepository'

export interface AddTaskUseCaseProps {
  taskRepository: ITaskRepository
}

export class AddTaskUseCase {
  private readonly taskRepository: ITaskRepository

  constructor(props: AddTaskUseCaseProps) {
    this.taskRepository = props.taskRepository
  }

  run(taskName: string) {
    if (!taskName) {
      throw new Error('No task name provided')
    }
    this.taskRepository.add(taskName)
  }
}
