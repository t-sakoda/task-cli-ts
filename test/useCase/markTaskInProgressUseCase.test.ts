import {afterEach, beforeEach, describe, expect, it, test, vi} from 'vitest'
import {Task, TaskStatus} from '../../src/domain/task'
import {
  MarkTaskInProgressUseCase,
  MarkTaskInProgressUseCaseErrorCode,
} from '../../src/useCase/markTaskInProgressUseCase'
import {mockTaskRepository} from '../shared/mockTaskRepository'

const taskRepository = mockTaskRepository()

describe('MarkTaskInProgressUseCase', () => {
  const useCase = new MarkTaskInProgressUseCase({taskRepository})

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-01-01T00:00:00.000Z'))
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Given empty id', () => {
    it('throws an error, ID_REQUIRED', () => {
      expect(() => useCase.run('')).toThrowError(
        MarkTaskInProgressUseCaseErrorCode.ID_REQUIRED,
      )
    })
  })
  describe('Given an id which task does not exist', () => {
    beforeEach(() => {
      taskRepository.find.mockReturnValue(undefined)
    })
    it('throws an error, TASK_NOT_FOUND', () => {
      expect(() => useCase.run('not-exist')).toThrowError(
        MarkTaskInProgressUseCaseErrorCode.TASK_NOT_FOUND,
      )
    })
  })

  describe('Given an id which task exists', () => {
    const task = Task.create('task')
    beforeEach(() => {
      taskRepository.find.mockReturnValue(task)
    })
    it('updates the task, which status is marked as In-progress', () => {
      useCase.run(task.id)
      expect(taskRepository.update).toHaveBeenCalledWith({
        ...task,
        status: TaskStatus.IN_PROGRESS,
        updatedAt: '2025-01-01T00:00:00.000Z',
      })
    })
  })

  describe('Given an error in loading a task', () => {
    beforeEach(() => {
      taskRepository.find.mockImplementation(() => {
        throw new Error('error')
      })
    })
    it('throws an error, INTERNAL_ERROR', () => {
      expect(() => useCase.run('error')).toThrowError(
        MarkTaskInProgressUseCaseErrorCode.INTERNAL_ERROR,
      )
    })
  })
  // タスクを更新する時にエラーが発生した場合
  describe('Given an error in updating a task', () => {
    const task = Task.create('task')
    beforeEach(() => {
      taskRepository.find.mockReturnValue(task)
      taskRepository.update.mockImplementation(() => {
        throw new Error('error')
      })
    })
    it('throws an error, INTERNAL_ERROR', () => {
      expect(() => useCase.run(task.id)).toThrowError(
        MarkTaskInProgressUseCaseErrorCode.INTERNAL_ERROR,
      )
    })
  })
})
