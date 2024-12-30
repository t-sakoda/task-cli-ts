import {afterAll, afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {Task, TaskStatus} from '../../src/domain/task'
import {TaskController} from '../../src/presentation/taskController'
import {ListTasksByStatusUseCase} from '../../src/useCase/ListTasksByStatusUseCase'

vi.mock('../../src/useCase/ListTasksByStatusUseCase')
const mockListTasksByStatusUseCase = vi.mocked(
  ListTasksByStatusUseCase.prototype.run,
)
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
    const task2 = Task.create('Task 2').mark(TaskStatus.IN_PROGRESS)
    const task3 = Task.create('Task 3').mark(TaskStatus.DONE)

    describe('Given no status as filter', () => {
      beforeEach(() => {
        mockListTasksByStatusUseCase.mockReturnValue([task1, task2, task3])
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
        expect(consoleLog).toHaveBeenCalledTimes(4)
      })
    })
    describe('Given a status as filter: TaskStatus.TODO', () => {
      beforeEach(() => {
        mockListTasksByStatusUseCase.mockReturnValue([task1])
      })
      it('prints tasks with the status', () => {
        taskController.run('list', 'todo')
        expect(consoleLog).toHaveBeenNthCalledWith(1, 'Todo tasks:')
        expect(consoleLog).toHaveBeenNthCalledWith(
          2,
          `- ${task1.id}: ${task1.description}, ${task1.status}`,
        )
        expect(consoleLog).toHaveBeenCalledTimes(2)
      })
    })
    describe('Given a status as filter: TaskStatus.IN_PROGRESS', () => {
      beforeEach(() => {
        mockListTasksByStatusUseCase.mockReturnValue([task2])
      })
      it('prints tasks with the status', () => {
        taskController.run('list', 'in-progress')
        expect(consoleLog).toHaveBeenNthCalledWith(1, 'In-progress tasks:')
        expect(consoleLog).toHaveBeenNthCalledWith(
          2,
          `- ${task2.id}: ${task2.description}, ${task2.status}`,
        )
        expect(consoleLog).toHaveBeenCalledTimes(2)
      })
    })
    describe('Given a status as filter: TaskStatus.DONE', () => {
      beforeEach(() => {
        mockListTasksByStatusUseCase.mockReturnValue([task3])
      })
      it('prints tasks with the status', () => {
        taskController.run('list', 'done')
        expect(consoleLog).toHaveBeenNthCalledWith(1, 'Done tasks:')
        expect(consoleLog).toHaveBeenNthCalledWith(
          2,
          `- ${task3.id}: ${task3.description}, ${task3.status}`,
        )
        expect(consoleLog).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe('Given an error in listing tasks', () => {
    beforeEach(() => {
      mockListTasksByStatusUseCase.mockImplementation(() => {
        throw new Error('Error')
      })
    })
    it('prints an error message', () => {
      taskController.run('list')
      expect(consoleError).toHaveBeenCalledWith('Internal error')
    })
  })
})
