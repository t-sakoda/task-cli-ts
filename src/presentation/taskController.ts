import {TaskRepository} from '../infra/taskRepository'
import {AddTaskUseCase} from '../useCase/addTaskUseCase'
import {DeleteTaskUseCase} from '../useCase/deleteTaskUseCase'
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
          console.error('Internal error')
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
          if (
            error instanceof Error &&
            error.message === UpdateTaskUseCaseErrorCode.TASK_NOT_FOUND
          ) {
            console.error(`Task with id ${id} not found`)
          } else {
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
          console.error('Internal error')
        }
        break
      }
      case 'mark-in-progress':
        console.log('Marking as in progress...')
        break
      case 'mark-done':
        console.log('Marking done...')
        break
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
