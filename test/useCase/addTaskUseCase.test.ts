import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {TaskStatus} from '../../src/domain/task'
import {TaskRepository} from '../../src/infra/taskRepository'
import {AddTaskUseCase} from '../../src/useCase/addTaskUseCase'

vi.mock(import('../../src/infra/taskRepository'), () => {
  const TaskRepository = vi.fn()
  TaskRepository.prototype.insert = vi.fn()
  return {TaskRepository}
})

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
      const taskRepository = new TaskRepository()
      const useCase = new AddTaskUseCase({taskRepository})
      const description = 'Do the laundry'
      useCase.run(description)
      expect(TaskRepository.prototype.insert).toHaveBeenCalledWith({
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
      const taskRepository = new TaskRepository()
      const useCase = new AddTaskUseCase({taskRepository})
      expect(() => useCase.run('')).toThrow('No task name provided')
    })
  })
})
