import {Task} from '../domain/task'
import type {ITaskRepository} from '../domain/taskRepository'

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
      throw new Error('No task name provided')
    }
    const task = Task.create(description)
    this.taskRepository.insert(task)
  }
}
