import {readFileSync, writeFileSync} from 'node:fs'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {Task, TaskStatus} from '../../src/domain/task'
import {TaskRepositoryErrorCode} from '../../src/domain/taskRepository'
import {TaskRepository} from '../../src/infra/taskRepository'

vi.mock('node:fs')
const mockReadFileSync = vi.mocked(readFileSync)
const mockWriteFileSync = vi.mocked(writeFileSync)

describe('TaskRepository.update', () => {
  const taskRepository = new TaskRepository()
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-01-01T00:00:00Z'))
  })
  afterEach(() => {
    vi.resetAllMocks()
    vi.useRealTimers()
  })

  describe('when the task exists', () => {
    let task: Task
    beforeEach(() => {
      task = Task.create('task1')
      mockReadFileSync.mockReturnValue(JSON.stringify([task]))
    })
    it('updates the task', () => {
      vi.advanceTimersByTime(1000)
      task.update('updated task')
      taskRepository.update(task)
      expect(mockWriteFileSync).toHaveBeenCalledWith(
        'tasks.json',
        JSON.stringify(
          [
            {
              id: task.id,
              description: 'updated task',
              status: TaskStatus.TODO,
              createdAt: new Date('2025-01-01T00:00:00.000Z').toISOString(),
              updatedAt: new Date('2025-01-01T00:00:01.000Z').toISOString(),
            },
          ],
          null,
          2,
        ),
      )
    })
    it('throws no error', () => {
      expect(() => taskRepository.update(task)).not.toThrow()
    })
  })
  describe('when the task does not exist', () => {
    beforeEach(() => {
      mockReadFileSync.mockReturnValue(JSON.stringify([]))
    })
    it('throws an error', () => {
      const task = Task.create('task1')
      expect(() => taskRepository.update(task)).toThrow(
        TaskRepositoryErrorCode.TASK_NOT_FOUND,
      )
    })
  })
  describe('Given no JSON file', () => {
    beforeEach(() => {
      mockReadFileSync.mockImplementation(() => {
        const error = new Error('No JSON file found') as NodeJS.ErrnoException
        error.code = 'ENOENT'
        throw error
      })
    })
    it('throws an error, FILE_NOT_FOUND', () => {
      const task = Task.create('task1')
      expect(() => taskRepository.update(task)).toThrow(
        TaskRepositoryErrorCode.FILE_NOT_FOUND,
      )
    })
  })
  describe('Given an error occurs in reading JSON file', () => {
    beforeEach(() => {
      mockReadFileSync.mockImplementation(() => {
        throw new Error('Error reading JSON file')
      })
    })
    it('throws an error', () => {
      const task = Task.create('task1')
      expect(() => taskRepository.update(task)).toThrow(
        TaskRepositoryErrorCode.INTERNAL_ERROR,
      )
    })
  })
  describe('Given an error occurs in writing JSON file', () => {
    const task = Task.create('task1')
    beforeEach(() => {
      mockReadFileSync.mockReturnValue(JSON.stringify([task]))
      mockWriteFileSync.mockImplementation(() => {
        throw new Error('Error writing JSON file')
      })
    })
    it('throws an error, FILE_WRITE_ERROR', () => {
      task.update('updated task')
      expect(() => taskRepository.update(task)).toThrow(
        TaskRepositoryErrorCode.FILE_WRITE_ERROR,
      )
    })
  })
})
