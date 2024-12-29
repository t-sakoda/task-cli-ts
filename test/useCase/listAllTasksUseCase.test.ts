import {beforeEach, describe, expect, it} from 'vitest'
import {Task} from '../../src/domain/task'
import {
  ListAllTasksUseCase,
  ListAllTasksUseCaseErrorCode,
} from '../../src/useCase/ListAllTasksUseCase'
import {mockTaskRepository} from '../shared/mockTaskRepository'

const taskRepository = mockTaskRepository()

describe('ListAllTasksUseCase', () => {
  const useCase = new ListAllTasksUseCase({taskRepository})
  const task1 = Task.create('Task 1')
  const task2 = Task.create('Task 2')
  const task3 = Task.create('Task 3')

  describe('Given some tasks', () => {
    beforeEach(() => {
      taskRepository.list.mockReturnValue([task1, task2, task3])
    })
    it('returns all tasks', () => {
      const tasks = useCase.run()
      expect(tasks).toEqual([task1, task2, task3])
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
        ListAllTasksUseCaseErrorCode.INTERNAL_ERROR,
      )
    })
  })
})
