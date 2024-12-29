import {TaskRepository} from '../infra/taskRepository'
import {
  AddTaskUseCase,
  AddTaskUseCaseErrorCode,
} from '../useCase/addTaskUseCase'
import {
  DeleteTaskUseCase,
  DeleteTaskUseCaseErrorCode,
} from '../useCase/deleteTaskUseCase'
import {
  MarkTaskDoneUseCase,
  MarkTaskDoneUseCaseErrorCode,
} from '../useCase/markTaskDoneUseCase'
import {
  MarkTaskInProgressUseCase,
  MarkTaskInProgressUseCaseErrorCode,
} from '../useCase/markTaskInProgressUseCase'
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
          console.debug(error)
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
          console.debug(error)
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
        const useCase = new MarkTaskInProgressUseCase({taskRepository})
        try {
          useCase.run(id)
        } catch (error: unknown) {
          if (!(error instanceof Error)) {
            console.error('Internal error')
            return
          }
          switch (error.message) {
            case MarkTaskInProgressUseCaseErrorCode.ID_REQUIRED:
              console.error('Id is required')
              break
            case MarkTaskInProgressUseCaseErrorCode.TASK_NOT_FOUND:
              console.error(`Task with id ${id} not found`)
              break
            case MarkTaskInProgressUseCaseErrorCode.INTERNAL_ERROR:
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
        const useCase = new MarkTaskDoneUseCase({taskRepository})
        try {
          useCase.run(id)
        } catch (error: unknown) {
          if (!(error instanceof Error)) {
            console.error('Internal error')
            return
          }
          switch (error.message) {
            case MarkTaskDoneUseCaseErrorCode.ID_REQUIRED:
              console.error('Id is required')
              break
            case MarkTaskDoneUseCaseErrorCode.TASK_NOT_FOUND:
              console.error(`Task with id ${id} not found`)
              break
            case MarkTaskDoneUseCaseErrorCode.INTERNAL_ERROR:
              console.error('Internal error')
              break
            default:
              console.error('Internal error')
          }
        }
        break
      }
      case 'list': {
        switch (args[1]) {
          case undefined:
            console.log('Listing all tasks...')
            break
          case 'done':
            console.log('Listing done tasks...')
            break
          case 'todo':
            console.log('Listing todo tasks...')
            break
          case 'in-progress':
            console.log('Listing tasks in progress...')
            break
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
