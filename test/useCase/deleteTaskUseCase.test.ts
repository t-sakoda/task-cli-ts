import {beforeEach, describe, expect, it} from 'vitest'
import {Task} from '../../src/domain/task'
import {
  DeleteTaskUseCase,
  DeleteTaskUseCaseErrorCode,
} from '../../src/useCase/deleteTaskUseCase'
import {mockTaskRepository} from '../shared/mockTaskRepository'

const taskRepository = mockTaskRepository()

describe('DeleteTaskUseCase', () => {
  const useCase = new DeleteTaskUseCase({taskRepository})
  describe('Given id, which task exists', () => {
    const task = Task.create('test')
    beforeEach(() => {
      taskRepository.find.mockReturnValue(task)
    })
    it('deletes the task', () => {
      const id = task.id
      useCase.run(id)
      expect(taskRepository.delete).toHaveBeenCalledWith(task)
    })
  })
  describe('Given id, which task does not exist', () => {
    beforeEach(() => {
      taskRepository.find.mockReturnValue(undefined)
    })
    it('throws an error, TASK_NOT_FOUND', () => {
      const useCase = new DeleteTaskUseCase({taskRepository})
      const id = '1'
      const act = () => useCase.run(id)
      expect(act).toThrowError(DeleteTaskUseCaseErrorCode.TASK_NOT_FOUND)
    })
  })
  describe('Given invalid id', () => {
    it('throws an error, INVALID_ID', () => {
      const useCase = new DeleteTaskUseCase({taskRepository})
      const id = ''
      const act = () => useCase.run(id)
      expect(act).toThrowError(DeleteTaskUseCaseErrorCode.INVALID_ID)
    })
  })
  describe('When an error occurs during deletion', () => {
    beforeEach(() => {
      const task = Task.create('test')
      taskRepository.find.mockReturnValue(task)
      taskRepository.delete.mockImplementation(() => {
        throw new Error()
      })
    })
    it('throws an error, INTERNAL_ERROR', () => {
      const useCase = new DeleteTaskUseCase({taskRepository})
      const id = '1'
      const act = () => useCase.run(id)
      expect(act).toThrowError(DeleteTaskUseCaseErrorCode.INTERNAL_ERROR)
    })
  })
})
