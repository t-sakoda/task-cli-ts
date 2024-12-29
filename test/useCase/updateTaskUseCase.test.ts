import {
  UpdateTaskUseCase,
  UpdateTaskUseCaseErrorCode,
} from '../../src/useCase/updateTaskUseCase'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {Task} from '../../src/domain/task'
import {mockTaskRepository} from '../shared/mockTaskRepository'
import {randomUUID} from 'node:crypto'

const taskRepository = mockTaskRepository()

describe('UpdateTaskUseCase', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('Given no id', () => {
    it('throws an error, ID_REQUIRED', () => {
      const useCase = new UpdateTaskUseCase(taskRepository)
      expect(() => useCase.run('', 'description')).toThrow(
        UpdateTaskUseCaseErrorCode.ID_REQUIRED,
      )
    })
  })
  describe('Given no description', () => {
    it('throws an error, DESCRIPTION_REQUIRED', () => {
      const useCase = new UpdateTaskUseCase(taskRepository)
      expect(() => useCase.run(randomUUID(), '')).toThrow(
        UpdateTaskUseCaseErrorCode.DESCRIPTION_REQUIRED,
      )
    })
  })
  describe('Given a task not found', () => {
    beforeEach(() => {
      taskRepository.find.mockReturnValue(undefined)
    })
    it('throws an error, TASK_NOT_FOUND', () => {
      const useCase = new UpdateTaskUseCase(taskRepository)
      expect(() => useCase.run(randomUUID(), 'description')).toThrow(
        UpdateTaskUseCaseErrorCode.TASK_NOT_FOUND,
      )
    })
  })
  describe('Given an error in fetching task', () => {
    beforeEach(() => {
      taskRepository.find.mockImplementation(() => {
        throw new Error('Something went wrong')
      })
    })
    it('throws an error, INTERNAL_ERROR', () => {
      const useCase = new UpdateTaskUseCase(taskRepository)
      expect(() => useCase.run(randomUUID(), 'description')).toThrow(
        UpdateTaskUseCaseErrorCode.INTERNAL_ERROR,
      )
    })
  })
  describe('Given an error in updating task', () => {
    beforeEach(() => {
      const task = Task.create('description')
      taskRepository.find.mockReturnValue(task)
      taskRepository.update.mockImplementation(() => {
        throw new Error('Something went wrong')
      })
    })
    it('throws an error, INTERNAL_ERROR', () => {
      const useCase = new UpdateTaskUseCase(taskRepository)
      expect(() => useCase.run(randomUUID(), 'description')).toThrow(
        UpdateTaskUseCaseErrorCode.INTERNAL_ERROR,
      )
    })
  })
  describe('Given a valid id and description', () => {
    const task = Task.create('description')
    beforeEach(() => {
      taskRepository.find.mockReturnValue(task)
    })
    it('updates the task', () => {
      const useCase = new UpdateTaskUseCase(taskRepository)
      useCase.run(randomUUID(), 'new description')
      expect(task.description).toBe('new description')
    })
  })
})
