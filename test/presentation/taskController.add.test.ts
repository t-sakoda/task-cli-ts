import {afterEach} from 'node:test'
import {afterAll, beforeEach, describe, expect, it, vi} from 'vitest'
import {TaskController} from '../../src/presentation/taskController'
import {
  AddTaskUseCase,
  AddTaskUseCaseErrorCode,
} from '../../src/useCase/addTaskUseCase'

vi.mock('../../src/useCase/addTaskUseCase')
const mockAddTaskUseCaseRun = vi.mocked(AddTaskUseCase.prototype.run)

const consoleError = vi.spyOn(console, 'error')

describe('TaskController.add', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })
  afterAll(() => {
    vi.restoreAllMocks()
  })

  describe('Given no error in running use case', () => {
    it('calls AddTaskUseCase.run with the correct task name', () => {
      const taskController = new TaskController()
      const description = 'Do the laundry'
      taskController.run('add', description)
      expect(mockAddTaskUseCaseRun).toHaveBeenCalledWith(description)
    })
  })
  describe('Given an error in running use case', () => {
    beforeEach(() => {
      mockAddTaskUseCaseRun.mockImplementation(() => {
        throw new Error(AddTaskUseCaseErrorCode.INTERNAL_ERROR)
      })
    })
    it('prints an error message, Internal error', () => {
      const taskController = new TaskController()
      const description = 'Do the laundry'
      taskController.run('add', description)
      expect(consoleError).toHaveBeenCalledWith('Internal error')
    })
  })
  describe('Given an empty argument', () => {
    beforeEach(() => {
      mockAddTaskUseCaseRun.mockImplementation(() => {
        throw new Error(AddTaskUseCaseErrorCode.DESCRIPTION_REQUIRED)
      })
    })
    it('prints an error message, Description required', () => {
      const taskController = new TaskController()
      taskController.run('add', '')
      expect(consoleError).toHaveBeenCalledWith('Description required')
    })
  })
})
