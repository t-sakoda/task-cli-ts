import {beforeEach, describe, expect, it} from 'vitest'
import {Task, TaskStatus} from '../../src/domain/task'
import {
  ListTasksByStatusUseCase,
  ListTasksByStatusUseCaseErrorCode,
} from '../../src/useCase/ListTasksByStatusUseCase'
import {mockTaskRepository} from '../shared/mockTaskRepository'

const taskRepository = mockTaskRepository()

describe('ListTasksByStatusUseCase', () => {
  const useCase = new ListTasksByStatusUseCase({taskRepository})
  const task1 = Task.create('Task 1')
  const task2 = Task.create('Task 2').mark(TaskStatus.IN_PROGRESS)
  const task3 = Task.create('Task 3').mark(TaskStatus.DONE)

  describe('Given some tasks', () => {
    describe('Given no status as filter', () => {
      beforeEach(() => {
        taskRepository.list.mockReturnValue([task1, task2, task3])
      })
      it('returns all tasks', () => {
        const tasks = useCase.run()
        expect(tasks).toEqual([task1, task2, task3])
      })
    })
    describe('Given a status as filter: TaskStatus.TODO', () => {
      beforeEach(() => {
        taskRepository.list.mockReturnValue([task1])
      })
      it('returns tasks with the status', () => {
        const tasks = useCase.run(TaskStatus.TODO)
        expect(tasks).toEqual([task1])
      })
    })
    describe('Given a status as filter: TaskStatus.IN_PROGRESS', () => {
      beforeEach(() => {
        taskRepository.list.mockReturnValue([task2])
      })
      it('returns tasks with the status', () => {
        const tasks = useCase.run(TaskStatus.IN_PROGRESS)
        expect(tasks).toEqual([task2])
      })
    })
    describe('Given a status as filter: TaskStatus.DONE', () => {
      beforeEach(() => {
        taskRepository.list.mockReturnValue([task3])
      })
      it('returns tasks with the status', () => {
        const tasks = useCase.run(TaskStatus.DONE)
        expect(tasks).toEqual([task3])
      })
    })
    describe('Given an invalid status as filter', () => {
      it('throws an error, INVALID_STATUS', () => {
        expect(() => useCase.run('invalid-status' as TaskStatus)).toThrowError(
          ListTasksByStatusUseCaseErrorCode.INVALID_STATUS,
        )
      })
    })
    describe('Given an error in loading tasks', () => {
      beforeEach(() => {
        taskRepository.list.mockImplementation(() => {
          throw new Error('Error')
        })
      })
      it('throws an error, INTERNAL_ERROR', () => {
        expect(() => useCase.run()).toThrowError(
          ListTasksByStatusUseCaseErrorCode.INTERNAL_ERROR,
        )
      })
    })
  })
})
