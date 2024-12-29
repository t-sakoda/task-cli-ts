import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {Task, TaskStatus} from '../../src/domain/task'
import {
  MarkTaskDoneUseCase,
  MarkTaskDoneUseCaseErrorCode,
} from '../../src/useCase/markTaskDoneUseCase'
import {mockTaskRepository} from '../shared/mockTaskRepository'

const taskRepository = mockTaskRepository()

describe('MarkTaskDoneUseCase', () => {
  const useCase = new MarkTaskDoneUseCase({taskRepository})

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-01-01T00:00:00.000Z'))
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Given id is empty', () => {
    it('throws ID_REQUIRED error', () => {
      expect(() => useCase.run('')).toThrowError(
        MarkTaskDoneUseCaseErrorCode.ID_REQUIRED,
      )
    })
  })

  describe('Given id which task does not exist', () => {
    beforeEach(() => {
      taskRepository.find.mockReturnValue(undefined)
    })
    it('throws TASK_NOT_FOUND error', () => {
      expect(() => useCase.run('1')).toThrowError(
        MarkTaskDoneUseCaseErrorCode.TASK_NOT_FOUND,
      )
    })
  })

  describe('Given id which task exists', () => {
    const task = Task.create('task1')
    beforeEach(() => {
      taskRepository.find.mockReturnValue(task)
    })
    it('marks the task as done', () => {
      const id = task.id
      useCase.run(id)
      expect(taskRepository.update).toHaveBeenCalledWith({
        ...task,
        status: TaskStatus.DONE,
        updatedAt: '2025-01-01T00:00:00.000Z',
      })
    })
  })

  describe('Given an error in loading a task', () => {
    beforeEach(() => {
      taskRepository.find.mockImplementation(() => {
        throw new Error()
      })
    })
    it('throws INTERNAL_ERROR error', () => {
      expect(() => useCase.run('1')).toThrowError(
        MarkTaskDoneUseCaseErrorCode.INTERNAL_ERROR,
      )
    })
  })

  describe('Given an error in updating a task', () => {
    const task = Task.create('task1')
    beforeEach(() => {
      taskRepository.find.mockReturnValue(task)
      taskRepository.update.mockImplementation(() => {
        throw new Error()
      })
    })
    it('throws INTERNAL_ERROR error', () => {
      const id = task.id
      expect(() => useCase.run(id)).toThrowError(
        MarkTaskDoneUseCaseErrorCode.INTERNAL_ERROR,
      )
    })
  })
})
