import {readFileSync, writeFileSync} from 'node:fs'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {Task} from '../../src/domain/task'
import {TaskRepository} from '../../src/infra/taskRepository'
import { TaskRepositoryErrorCode } from '../../src/domain/taskRepository'

vi.mock('node:fs')
const mockReadFileSync = vi.mocked(readFileSync)
const mockWriteFileSync = vi.mocked(writeFileSync)

describe('TaskRepository.add', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('Given no JSON file', () => {
    beforeEach(() => {
      mockReadFileSync.mockImplementation(() => {
        const error = new Error('No JSON file found') as NodeJS.ErrnoException
        error.code = 'ENOENT'
        throw error
      })
    })
    it('creates a JSON file', () => {
      const taskRepository = new TaskRepository()
      const description = 'Do the laundry'
      const task = Task.create(description)
      taskRepository.insert(task)
      expect(mockWriteFileSync).toHaveBeenCalledWith(
        'tasks.json',
        JSON.stringify([task]),
      )
    })
  })

  describe('Given an error reading the JSON file', () => {
    beforeEach(() => {
      mockReadFileSync.mockImplementation(() => {
        throw new Error('Error reading JSON file')
      })
    })
    it('throws an error', () => {
      const taskRepository = new TaskRepository()
      const description = 'Do the laundry'
      const task = Task.create(description)
      expect(() => taskRepository.insert(task)).toThrow(TaskRepositoryErrorCode.INTERNAL_ERROR)
    })
  })

  describe('Given an existing JSON file', () => {
    beforeEach(() => {
      mockReadFileSync.mockReturnValue('[]')
    })
    it('appends a new task to the JSON file', () => {
      const taskRepository = new TaskRepository()
      const description = 'Do the laundry'
      const task = Task.create(description)
      taskRepository.insert(task)
      expect(mockWriteFileSync).toHaveBeenCalledWith(
        'tasks.json',
        JSON.stringify([task]),
      )
    })
  })

  describe('Given an existing task', () => {
    const description = 'Do the laundry'
    const task = Task.create(description)
    beforeEach(() => {
      mockReadFileSync.mockReturnValue(
        JSON.stringify([task]),
      )
    })
    it('throws an error', () => {
      const taskRepository = new TaskRepository()
      expect(() => taskRepository.insert(task)).toThrow(
        TaskRepositoryErrorCode.TASK_ALREADY_EXISTS,
      )
    })
  })
})
