import {describe, expect, it, vi} from 'vitest'
import {TaskController} from '../../src/presentation/taskController'
import {AddTaskUseCase} from '../../src/useCase/addTaskUseCase'
import {UpdateTaskUseCase} from '../../src/useCase/updateTaskUseCase'

vi.mock('../../src/useCase/addTaskUseCase')
const mockAddTaskUseCaseRun = vi.mocked(AddTaskUseCase.prototype.run)

vi.mock('../../src/useCase/updateTaskUseCase')
const mockUpdateTaskUseCaseRun = vi.mocked(UpdateTaskUseCase.prototype.run)

describe('TaskController', () => {
  describe('add', () => {
    it('calls AddTaskUseCase.run with the correct task name', () => {
      const taskController = new TaskController()
      const description = 'Do the laundry'
      taskController.run('add', description)
      expect(mockAddTaskUseCaseRun).toHaveBeenCalledWith(description)
    })
  })

  describe('update', () => {
    it('calls UpdateTaskUseCase.run with the correct task id and description', () => {
      const taskController = new TaskController()
      const id = '1'
      const description = 'Do the laundry'
      taskController.run('update', id, description)
      expect(mockUpdateTaskUseCaseRun).toHaveBeenCalledWith(id, description)
    })
  })
})
