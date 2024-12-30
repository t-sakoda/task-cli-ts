import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {Task, TaskStatus} from '../../src/domain/task'
import {
  MarkTaskUseCase,
  MarkTaskUseCaseErrorCode,
} from '../../src/useCase/markTaskUseCase'
import {mockTaskRepository} from '../shared/mockTaskRepository'

const taskRepository = mockTaskRepository()

describe('MarkTaskDoneUseCase', () => {
  const useCase = new MarkTaskUseCase({taskRepository})

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-01-01T00:00:00.000Z'))
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Given id is empty', () => {
    it('throws ID_REQUIRED error', () => {
      expect(() => useCase.run('', TaskStatus.IN_PROGRESS)).toThrowError(
        MarkTaskUseCaseErrorCode.ID_REQUIRED,
      )
    })
  })

  describe('Given id which task does not exist', () => {
    beforeEach(() => {
      taskRepository.find.mockReturnValue(undefined)
    })
    it('throws TASK_NOT_FOUND error', () => {
      expect(() => useCase.run('1', TaskStatus.DONE)).toThrowError(
        MarkTaskUseCaseErrorCode.TASK_NOT_FOUND,
      )
    })
  })

  describe('Given id which task exists', () => {
    const task = Task.create('task1')
    beforeEach(() => {
      taskRepository.find.mockReturnValue(task)
    })
    describe('Given status DONE', () => {
      it('marks the task as done', () => {
        const id = task.id
        useCase.run(id, TaskStatus.DONE)
        expect(taskRepository.update).toHaveBeenCalledWith({
          ...task,
          status: TaskStatus.DONE,
          updatedAt: '2025-01-01T00:00:00.000Z',
        })
      })
    })
    describe('Given status IN_PROGRESS', () => {
      it('marks the task as in progress', () => {
        const id = task.id
        useCase.run(id, TaskStatus.IN_PROGRESS)
        expect(taskRepository.update).toHaveBeenCalledWith({
          ...task,
          status: TaskStatus.IN_PROGRESS,
          updatedAt: '2025-01-01T00:00:00.000Z',
        })
      })
    })
    describe('Given status TODO', () => {
      it('marks the task as todo', () => {
        const id = task.id
        useCase.run(id, TaskStatus.TODO)
        expect(taskRepository.update).toHaveBeenCalledWith({
          ...task,
          status: TaskStatus.TODO,
          updatedAt: '2025-01-01T00:00:00.000Z',
        })
      })
    })
    describe('Given status INVALID', () => {
      it('throws INVALID_STATUS error', () => {
        const id = task.id
        expect(() => useCase.run(id, 'INVALID' as TaskStatus)).toThrowError(
          MarkTaskUseCaseErrorCode.INVALID_STATUS,
        )
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
      expect(() => useCase.run('1', TaskStatus.DONE)).toThrowError(
        MarkTaskUseCaseErrorCode.INTERNAL_ERROR,
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
      expect(() => useCase.run(id, TaskStatus.DONE)).toThrowError(
        MarkTaskUseCaseErrorCode.INTERNAL_ERROR,
      )
    })
  })
})
