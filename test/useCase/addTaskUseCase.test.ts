import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {TaskStatus} from '../../src/domain/task'
import {
  AddTaskUseCase,
  AddTaskUseCaseErrorCode,
} from '../../src/useCase/addTaskUseCase'
import {mockTaskRepository} from '../shared/mockTaskRepository'

const taskRepository = mockTaskRepository()

describe('AddTaskUseCase', () => {
  const mockDate = new Date('2025-01-01 09:00:00')
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(mockDate)
  })
  afterEach(() => {
    vi.useRealTimers()
  })
  describe('Given a correct argument', () => {
    it('calls TaskRepository.add with the correct task name', () => {
      const useCase = new AddTaskUseCase({taskRepository})
      const description = 'Do the laundry'
      const taskObj = useCase.run(description)
      expect(taskObj).toEqual({
        id: expect.any(String),
        description,
        status: TaskStatus.TODO,
        createdAt: mockDate.toISOString(),
        updatedAt: mockDate.toISOString(),
      })
      expect(taskRepository.insert).toHaveBeenCalledWith({
        id: expect.any(String),
        description,
        status: TaskStatus.TODO,
        createdAt: mockDate.toISOString(),
        updatedAt: mockDate.toISOString(),
      })
    })
  })

  describe('Given an empty argument', () => {
    it('throws an error', () => {
      const useCase = new AddTaskUseCase({taskRepository})
      expect(() => useCase.run('')).toThrow(
        AddTaskUseCaseErrorCode.DESCRIPTION_REQUIRED,
      )
    })
  })

  describe('Given an error in adding a task', () => {
    beforeEach(() => {
      taskRepository.insert.mockImplementation(() => {
        throw new Error('Error')
      })
    })
    it('throws an error', () => {
      const useCase = new AddTaskUseCase({taskRepository})
      expect(() => useCase.run('Do the laundry')).toThrow(
        AddTaskUseCaseErrorCode.INTERNAL_ERROR,
      )
    })
  })
})
