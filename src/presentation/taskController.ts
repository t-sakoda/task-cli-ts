import {TaskStatus} from '../domain/task'
import {TaskRepository} from '../infra/taskRepository'
import {
  AddTaskUseCase,
  AddTaskUseCaseErrorCode,
} from '../useCase/addTaskUseCase'
import {
  DeleteTaskUseCase,
  DeleteTaskUseCaseErrorCode,
} from '../useCase/deleteTaskUseCase'
import {ListTasksByStatusUseCase} from '../useCase/listTasksByStatusUseCase'
import {
  MarkTaskUseCase,
  MarkTaskUseCaseErrorCode,
} from '../useCase/markTaskUseCase'
import {
  UpdateTaskUseCase,
  UpdateTaskUseCaseErrorCode,
} from '../useCase/updateTaskUseCase'

export class TaskController {
  run(...args: string[]) {
    if (args.length === 0) {
      console.error('No arguments provided')
      return
    }

    const taskRepository = new TaskRepository()
    switch (args[0]) {
      case 'add': {
        const [description] = args.slice(1)
        const useCase = new AddTaskUseCase({taskRepository})
        try {
          useCase.run(description)
        } catch (error: unknown) {
          if (
            error instanceof Error &&
            error.message === AddTaskUseCaseErrorCode.DESCRIPTION_REQUIRED
          ) {
            console.error('Description required')
          } else {
            console.error('Internal error')
          }
        }
        break
      }
      case 'update': {
        const [id, description] = args.slice(1)
        const useCase = new UpdateTaskUseCase({taskRepository})
        try {
          useCase.run(id, description)
        } catch (error: unknown) {
          if (!(error instanceof Error)) {
            console.error('Internal error')
            return
          }
          switch (error.message) {
            case UpdateTaskUseCaseErrorCode.ID_REQUIRED:
              console.error('Id is required')
              break
            case UpdateTaskUseCaseErrorCode.DESCRIPTION_REQUIRED:
              console.error('Description is required')
              break
            case UpdateTaskUseCaseErrorCode.TASK_NOT_FOUND:
              console.error(`Task with id ${id} not found`)
              break
            case UpdateTaskUseCaseErrorCode.INTERNAL_ERROR:
              console.error('Internal error')
              break
            default:
              console.error('Internal error')
          }
        }
        break
      }
      case 'delete': {
        const [id] = args.slice(1)
        const useCase = new DeleteTaskUseCase({taskRepository})
        try {
          useCase.run(id)
        } catch (error: unknown) {
          if (!(error instanceof Error)) {
            console.error('Internal error')
            return
          }
          switch (error.message) {
            case DeleteTaskUseCaseErrorCode.ID_REQUIRED:
              console.error('Id is required')
              break
            case DeleteTaskUseCaseErrorCode.TASK_NOT_FOUND:
              console.error(`Task with id ${id} not found`)
              break
            case DeleteTaskUseCaseErrorCode.INTERNAL_ERROR:
              console.error('Internal error')
              break
            default:
              console.error('Internal error')
          }
        }
        break
      }
      case 'mark-in-progress': {
        const [id] = args.slice(1)
        const useCase = new MarkTaskUseCase({taskRepository})
        try {
          useCase.run(id, TaskStatus.IN_PROGRESS)
        } catch (error: unknown) {
          if (!(error instanceof Error)) {
            console.error('Internal error')
            return
          }
          switch (error.message) {
            case MarkTaskUseCaseErrorCode.ID_REQUIRED:
              console.error('Id is required')
              break
            case MarkTaskUseCaseErrorCode.TASK_NOT_FOUND:
              console.error(`Task with id ${id} not found`)
              break
            case MarkTaskUseCaseErrorCode.INTERNAL_ERROR:
              console.error('Internal error')
              break
            default:
              console.error('Internal error')
          }
        }
        break
      }
      case 'mark-done': {
        const [id] = args.slice(1)
        const useCase = new MarkTaskUseCase({taskRepository})
        try {
          useCase.run(id, TaskStatus.DONE)
        } catch (error: unknown) {
          if (!(error instanceof Error)) {
            console.error('Internal error')
            return
          }
          switch (error.message) {
            case MarkTaskUseCaseErrorCode.ID_REQUIRED:
              console.error('Id is required')
              break
            case MarkTaskUseCaseErrorCode.TASK_NOT_FOUND:
              console.error(`Task with id ${id} not found`)
              break
            case MarkTaskUseCaseErrorCode.INTERNAL_ERROR:
              console.error('Internal error')
              break
            default:
              console.error('Internal error')
          }
        }
        break
      }
      case 'list': {
        const [status] = args.slice(1)
        const useCase = new ListTasksByStatusUseCase({taskRepository})
        switch (status) {
          case undefined: {
            try {
              const tasks = useCase.run()
              if (tasks.length === 0) {
                console.log('No tasks')
                return
              }
              console.log('All tasks:')
              for (const task of tasks) {
                console.log(`- ${task.id}: ${task.description}, ${task.status}`)
              }
            } catch {
              console.error('Internal error')
            }
            break
          }
          case 'done': {
            try {
              const tasks = useCase.run(TaskStatus.DONE)
              if (tasks.length === 0) {
                console.log('No tasks')
                return
              }
              console.log('Done tasks:')
              for (const task of tasks) {
                console.log(`- ${task.id}: ${task.description}, ${task.status}`)
              }
            } catch {
              console.error('Internal error')
            }
            break
          }
          case 'todo': {
            try {
              const tasks = useCase.run(TaskStatus.TODO)
              if (tasks.length === 0) {
                console.log('No tasks')
                return
              }
              console.log('Todo tasks:')
              for (const task of tasks) {
                console.log(`- ${task.id}: ${task.description}, ${task.status}`)
              }
            } catch {
              console.error('Internal error')
            }
            break
          }
          case 'in-progress': {
            try {
              const tasks = useCase.run(TaskStatus.IN_PROGRESS)
              if (tasks.length === 0) {
                console.log('No tasks')
                return
              }
              console.log('In-progress tasks:')
              for (const task of tasks) {
                console.log(`- ${task.id}: ${task.description}, ${task.status}`)
              }
            } catch {
              console.error('Internal error')
            }
            break
          }
          default:
            console.error('Invalid list option')
            process.exit(1)
        }
        break
      }
      default:
        console.error('Invalid command')
        return
    }
  }
}
