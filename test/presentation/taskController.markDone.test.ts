import {afterAll, afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {TaskStatus} from '../../src/domain/task'
import {TaskController} from '../../src/presentation/taskController'
import {
  MarkTaskUseCase,
  MarkTaskUseCaseErrorCode,
} from '../../src/useCase/markTaskUseCase'

vi.mock('../../src/useCase/markTaskUseCase')
const mockMarkTaskUseCaseRun = vi.mocked(MarkTaskUseCase.prototype.run)

const consoleError = vi.spyOn(console, 'error')

describe('TaskController with mark-done command', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })
  afterAll(() => {
    vi.restoreAllMocks()
  })

  describe('Given id which task exists', () => {
    it('calls MarkTaskDoneUseCase.run with the correct task id', () => {
      const taskController = new TaskController()
      const id = '1'
      taskController.run('mark-done', id)
      expect(mockMarkTaskUseCaseRun).toHaveBeenCalledWith(id, TaskStatus.DONE)
    })
  })

  describe('When MarkTaskDoneUseCase.run throws ID_REQUIRED', () => {
    beforeEach(() => {
      mockMarkTaskUseCaseRun.mockImplementation(() => {
        throw new Error(MarkTaskUseCaseErrorCode.ID_REQUIRED)
      })
    })

    it('prints an error message, Id is required', () => {
      const taskController = new TaskController()
      taskController.run('mark-done')
      expect(consoleError).toHaveBeenCalledWith('Id is required')
    })
  })

  describe('When MarkTaskDoneUseCase.run throws TASK_NOT_FOUND', () => {
    beforeEach(() => {
      mockMarkTaskUseCaseRun.mockImplementation(() => {
        throw new Error(MarkTaskUseCaseErrorCode.TASK_NOT_FOUND)
      })
    })

    it('prints an error message, Task with id ${id} not found', () => {
      const taskController = new TaskController()
      const id = '1'
      taskController.run('mark-done', id)
      expect(consoleError).toHaveBeenCalledWith(`Task with id ${id} not found`)
    })
  })

  describe('When MarkTaskUseCase.run throws INTERNAL_ERROR', () => {
    beforeEach(() => {
      mockMarkTaskUseCaseRun.mockImplementation(() => {
        throw new Error(MarkTaskUseCaseErrorCode.INTERNAL_ERROR)
      })
    })

    it('prints an error message, Internal error', () => {
      const taskController = new TaskController()
      const id = '1'
      taskController.run('mark-done', id)
      expect(consoleError).toHaveBeenCalledWith('Internal error')
    })
  })
})
