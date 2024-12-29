import {afterAll, beforeEach, describe, expect, it, vi} from 'vitest'
import {TaskController} from '../../src/presentation/taskController'
import {
  UpdateTaskUseCase,
  UpdateTaskUseCaseErrorCode,
} from '../../src/useCase/updateTaskUseCase'

vi.mock('../../src/useCase/updateTaskUseCase')
const mockUpdateTaskUseCaseRun = vi.mocked(UpdateTaskUseCase.prototype.run)

const consoleError = vi.spyOn(console, 'error')

describe('TaskController.update', () => {
  afterAll(() => {
    vi.restoreAllMocks()
  })
  describe('Given no error in running use case', () => {
    it('calls UpdateTaskUseCase.run with the correct task id and description', () => {
      const taskController = new TaskController()
      const id = '1'
      const description = 'Do the laundry'
      taskController.run('update', id, description)
      expect(mockUpdateTaskUseCaseRun).toHaveBeenCalledWith(id, description)
    })
  })
  describe('Given an error, ID_REQUIRED, occurs', () => {
    beforeEach(() => {
      mockUpdateTaskUseCaseRun.mockImplementation(() => {
        throw new Error(UpdateTaskUseCaseErrorCode.ID_REQUIRED)
      })
    })
    it('prints an error message, Id is required', () => {
      const taskController = new TaskController()
      const id = ''
      const description = 'Do the laundry'
      taskController.run('update', id, description)
      expect(console.error).toHaveBeenCalledWith('Id is required')
    })
  })
  describe('Given an error, DESCRIPTION_REQUIRED, occurs', () => {
    beforeEach(() => {
      mockUpdateTaskUseCaseRun.mockImplementation(() => {
        throw new Error(UpdateTaskUseCaseErrorCode.DESCRIPTION_REQUIRED)
      })
    })
    it('prints an error message, Description is required', () => {
      const taskController = new TaskController()
      const id = '1'
      const description = ''
      taskController.run('update', id, description)
      expect(console.error).toHaveBeenCalledWith('Description is required')
    })
  })
  describe('Given an error, TASK_NOT_FOUND, occurs', () => {
    beforeEach(() => {
      mockUpdateTaskUseCaseRun.mockImplementation(() => {
        throw new Error(UpdateTaskUseCaseErrorCode.TASK_NOT_FOUND)
      })
    })
    it('prints an error message, Task with id {id} not found', () => {
      const taskController = new TaskController()
      const id = '1'
      const description = 'Do the laundry'
      taskController.run('update', id, description)
      expect(console.error).toHaveBeenCalledWith(`Task with id ${id} not found`)
    })
  })
  describe('Given an error, INTERNAL_ERROR, occurs', () => {
    beforeEach(() => {
      mockUpdateTaskUseCaseRun.mockImplementation(() => {
        throw new Error(UpdateTaskUseCaseErrorCode.INTERNAL_ERROR)
      })
    })
    it('prints an error message, Internal error', () => {
      const taskController = new TaskController()
      const id = '1'
      const description = 'Do the laundry'
      taskController.run('update', id, description)
      expect(console.error).toHaveBeenCalledWith('Internal error')
    })
  })
})
