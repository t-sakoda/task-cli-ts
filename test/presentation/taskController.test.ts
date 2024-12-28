import {describe, expect, it, vi} from 'vitest'
import {TaskController} from '../../src/presentation/taskController'
import {AddTaskUseCase} from '../../src/useCase/addTaskUseCase'

vi.mock(import('../../src/useCase/addTaskUseCase'), () => {
  const AddTaskUseCase = vi.fn()
  AddTaskUseCase.prototype.run = vi.fn()
  return {AddTaskUseCase}
})

describe('TaskController', () => {
  describe('add', () => {
    it('calls AddTaskUseCase.run with the correct task name', () => {
      const taskController = new TaskController()
      const taskName = 'Do the laundry'
      taskController.run('add', taskName)
      expect(AddTaskUseCase.prototype.run).toHaveBeenCalledWith(taskName)
    })
  })
})
