import {afterAll, afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {TaskController} from '../../src/presentation/taskController'
import {
  DeleteTaskUseCase,
  DeleteTaskUseCaseErrorCode,
} from '../../src/useCase/deleteTaskUseCase'

vi.mock('../../src/useCase/deleteTaskUseCase')
const mockDeleteTaskUseCaseRun = vi.mocked(DeleteTaskUseCase.prototype.run)

const consoleError = vi.spyOn(console, 'error')

describe('TaskController with delete command', () => {
  afterAll(() => {
    vi.restoreAllMocks()
  })
  describe('Given id', () => {
    it('calls DeleteTaskUseCase.run with the correct task id', () => {
      const taskController = new TaskController()
      const id = '1'
      taskController.run('delete', id)
      expect(mockDeleteTaskUseCaseRun).toHaveBeenCalledWith(id)
    })
  })
  describe('When DeleteTaskUseCase.run throws ID_REQUIRED', () => {
    beforeEach(() => {
      mockDeleteTaskUseCaseRun.mockImplementation(() => {
        throw new Error(DeleteTaskUseCaseErrorCode.ID_REQUIRED)
      })
    })
    it('prints an error message, Id is required', () => {
      const taskController = new TaskController()
      taskController.run('delete')
      expect(consoleError).toHaveBeenCalledWith('Id is required')
    })
  })
  describe('When DeleteTaskUseCase.run throws TASK_NOT_FOUND', () => {
    beforeEach(() => {
      mockDeleteTaskUseCaseRun.mockImplementation(() => {
        throw new Error(DeleteTaskUseCaseErrorCode.TASK_NOT_FOUND)
      })
    })
    it('prints an error message, Task with id ${id} not found', () => {
      const taskController = new TaskController()
      const id = '1'
      taskController.run('delete', id)
      expect(consoleError).toHaveBeenCalledWith(`Task with id ${id} not found`)
    })
  })
  describe('When DeleteTaskUseCase.run throws INTERNAL_ERROR', () => {
    beforeEach(() => {
      mockDeleteTaskUseCaseRun.mockImplementation(() => {
        throw new Error(DeleteTaskUseCaseErrorCode.INTERNAL_ERROR)
      })
    })
    it('prints an error message, Internal error', () => {
      const taskController = new TaskController()
      const id = '1'
      taskController.run('delete', id)
      expect(consoleError).toHaveBeenCalledWith('Internal error')
    })
  })
})
