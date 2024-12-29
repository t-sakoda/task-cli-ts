import {afterAll, beforeEach, describe, expect, it, vi} from 'vitest'
import {TaskController} from '../../src/presentation/taskController'
import {
  MarkTaskInProgressUseCase,
  MarkTaskInProgressUseCaseErrorCode,
} from '../../src/useCase/markTaskInProgressUseCase'

vi.mock('../../src/useCase/markTaskInProgressUseCase')
const mockMarkTaskInProgressUseCaseRun = vi.mocked(
  MarkTaskInProgressUseCase.prototype.run,
)

const consoleError = vi.spyOn(console, 'error')

describe('TaskController with markInProgress command', () => {
  afterAll(() => {
    vi.restoreAllMocks()
  })

  describe('Given id which task exists', () => {
    it('calls MarkTaskInProgressUseCase.run with the correct task id', () => {
      const taskController = new TaskController()
      const id = '1'
      taskController.run('mark-in-progress', id)
      expect(mockMarkTaskInProgressUseCaseRun).toHaveBeenCalledWith(id)
    })
  })

  describe('When MarkTaskInProgressUseCase.run throws ID_REQUIRED', () => {
    beforeEach(() => {
      mockMarkTaskInProgressUseCaseRun.mockImplementation(() => {
        throw new Error(MarkTaskInProgressUseCaseErrorCode.ID_REQUIRED)
      })
    })

    it('prints an error message, Id is required', () => {
      const taskController = new TaskController()
      taskController.run('mark-in-progress')
      expect(consoleError).toHaveBeenCalledWith('Id is required')
    })
  })

  describe('When MarkTaskInProgressUseCase.run throws TASK_NOT_FOUND', () => {
    beforeEach(() => {
      mockMarkTaskInProgressUseCaseRun.mockImplementation(() => {
        throw new Error(MarkTaskInProgressUseCaseErrorCode.TASK_NOT_FOUND)
      })
    })

    it('prints an error message, Task with id ${id} not found', () => {
      const taskController = new TaskController()
      const id = '1'
      taskController.run('mark-in-progress', id)
      expect(consoleError).toHaveBeenCalledWith(`Task with id ${id} not found`)
    })
  })

  describe('When MarkTaskInProgressUseCase.run throws INTERNAL_ERROR', () => {
    beforeEach(() => {
      mockMarkTaskInProgressUseCaseRun.mockImplementation(() => {
        throw new Error(MarkTaskInProgressUseCaseErrorCode.INTERNAL_ERROR)
      })
    })

    it('prints an error message, Internal error', () => {
      const taskController = new TaskController()
      const id = '1'
      taskController.run('mark-in-progress', id)
      expect(consoleError).toHaveBeenCalledWith('Internal error')
    })
  })
})
