import {afterAll, afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {TaskController} from '../../src/presentation/taskController'
import {
  MarkTaskDoneUseCase,
  MarkTaskDoneUseCaseErrorCode,
} from '../../src/useCase/markTaskDoneUseCase'

vi.mock('../../src/useCase/markTaskDoneUseCase')
const mockMarkTaskDoneUseCaseRun = vi.mocked(MarkTaskDoneUseCase.prototype.run)

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
      expect(mockMarkTaskDoneUseCaseRun).toHaveBeenCalledWith(id)
    })
  })

  describe('When MarkTaskDoneUseCase.run throws ID_REQUIRED', () => {
    beforeEach(() => {
      mockMarkTaskDoneUseCaseRun.mockImplementation(() => {
        throw new Error(MarkTaskDoneUseCaseErrorCode.ID_REQUIRED)
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
      mockMarkTaskDoneUseCaseRun.mockImplementation(() => {
        throw new Error(MarkTaskDoneUseCaseErrorCode.TASK_NOT_FOUND)
      })
    })

    it('prints an error message, Task with id ${id} not found', () => {
      const taskController = new TaskController()
      const id = '1'
      taskController.run('mark-done', id)
      expect(consoleError).toHaveBeenCalledWith(`Task with id ${id} not found`)
    })
  })

  describe('When MarkTaskDoneUseCase.run throws INTERNAL_ERROR', () => {
    beforeEach(() => {
      mockMarkTaskDoneUseCaseRun.mockImplementation(() => {
        throw new Error(MarkTaskDoneUseCaseErrorCode.INTERNAL_ERROR)
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
