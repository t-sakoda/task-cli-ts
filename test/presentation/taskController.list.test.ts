import {afterAll, afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {Task} from '../../src/domain/task'
import {TaskController} from '../../src/presentation/taskController'
import {ListAllTasksUseCase} from '../../src/useCase/ListAllTasksUseCase'

vi.mock('../../src/useCase/ListAllTasksUseCase')
const mockListAllTasksUseCaseRun = vi.mocked(ListAllTasksUseCase.prototype.run)
const consoleLog = vi.spyOn(console, 'log')
const consoleError = vi.spyOn(console, 'error')

describe('TaskController.list', () => {
  const taskController = new TaskController()
  afterEach(() => {
    vi.clearAllMocks()
  })
  afterAll(() => {
    vi.restoreAllMocks()
  })

  describe('Given some tasks', () => {
    const task1 = Task.create('Task 1')
    const task2 = Task.create('Task 2')
    const task3 = Task.create('Task 3')
    beforeEach(() => {
      mockListAllTasksUseCaseRun.mockReturnValue([task1, task2, task3])
    })
    it('prints all tasks', () => {
      taskController.run('list')
      expect(consoleLog).toHaveBeenNthCalledWith(1, 'All tasks:')
      expect(consoleLog).toHaveBeenNthCalledWith(
        2,
        `- ${task1.id}: ${task1.description}, ${task1.status}`,
      )
      expect(consoleLog).toHaveBeenNthCalledWith(
        3,
        `- ${task2.id}: ${task2.description}, ${task2.status}`,
      )
      expect(consoleLog).toHaveBeenNthCalledWith(
        4,
        `- ${task3.id}: ${task3.description}, ${task3.status}`,
      )
    })
  })

  describe('Given an error in listing tasks', () => {
    beforeEach(() => {
      mockListAllTasksUseCaseRun.mockImplementation(() => {
        throw new Error('Error')
      })
    })
    it('prints an error message', () => {
      taskController.run('list')
      expect(consoleError).toHaveBeenCalledWith('Internal error')
    })
  })
})
