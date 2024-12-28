import {describe, expect, it, vi} from 'vitest'
import {TaskRepository} from '../../src/infra/taskRepository'
import { AddTaskUseCase } from '../../src/useCase/addTaskUseCase'

vi.mock(import('../../src/infra/taskRepository'), () => {
  const TaskRepository = vi.fn()
  TaskRepository.prototype.add = vi.fn()
  return {TaskRepository}
})

describe('AddTaskUseCase', () => {
  describe('Given a correct argument', () => {
    it('calls TaskRepository.add with the correct task name', () => {
      const taskRepository = new TaskRepository()
      const useCase = new AddTaskUseCase({taskRepository})
      const taskName = 'Do the laundry'
      useCase.run(taskName)
      expect(TaskRepository.prototype.add).toHaveBeenCalledWith(taskName)
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