import {readFileSync, writeFileSync} from 'node:fs'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import {Task} from '../../src/domain/task'
import {TaskRepositoryErrorCode} from '../../src/domain/taskRepository'
import {TaskRepository} from '../../src/infra/taskRepository'

vi.mock('node:fs')
const mockReadFileSync = vi.mocked(readFileSync)
const mockWriteFileSync = vi.mocked(writeFileSync)

describe('TaskRepository.delete', () => {
  const taskRepository = new TaskRepository()
  const task1 = Task.create('task1')
  const task2 = Task.create('task2')
  const task3 = Task.create('task3')

  describe('Given a task which exists', () => {
    beforeEach(() => {
      mockReadFileSync.mockReturnValue(JSON.stringify([task1, task2, task3]))
    })
    it('deletes the task', () => {
      taskRepository.delete(task1)
      expect(mockWriteFileSync).toHaveBeenCalledWith(
        'tasks.json',
        JSON.stringify([task2, task3], null, 2),
      )
    })
  })
  describe('Given a task which does not exist', () => {
    beforeEach(() => {
      mockReadFileSync.mockReturnValue(JSON.stringify([task2, task3]))
    })
    it('throws an error, TASK_NOT_FOUND', () => {
      expect(() => taskRepository.delete(task1)).toThrow(
        TaskRepositoryErrorCode.TASK_NOT_FOUND,
      )
    })
  })
})
