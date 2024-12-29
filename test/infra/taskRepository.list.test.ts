import {readFileSync} from 'node:fs'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import {Task} from '../../src/domain/task'
import {TaskRepositoryErrorCode} from '../../src/domain/taskRepository'
import {TaskRepository} from '../../src/infra/taskRepository'

vi.mock('node:fs')
const mockReadFileSync = vi.mocked(readFileSync)

describe('TaskRepository.list', () => {
  const taskRepository = new TaskRepository()
  const task1 = Task.create('Task 1')
  const task2 = Task.create('Task 2')
  const task3 = Task.create('Task 3')

  describe('Given some tasks', () => {
    beforeEach(() => {
      mockReadFileSync.mockReturnValue(JSON.stringify([task1, task2, task3]))
    })
    it('returns all tasks', () => {
      const tasks = taskRepository.list()
      expect(tasks).toEqual([task1, task2, task3])
    })
  })

  describe('Given an error in loading tasks', () => {
    beforeEach(() => {
      mockReadFileSync.mockImplementation(() => {
        throw new Error('Error')
      })
    })
    it('throws an error', () => {
      expect(() => taskRepository.list()).toThrowError(
        TaskRepositoryErrorCode.INTERNAL_ERROR,
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
    it('returns an empty array', () => {
      const tasks = taskRepository.list()
      expect(tasks).toEqual([])
    })
  })

  describe('Given an empty array in JSON file', () => {
    beforeEach(() => {
      mockReadFileSync.mockReturnValue('[]')
    })
    it('returns an empty array', () => {
      const tasks = taskRepository.list()
      expect(tasks).toEqual([])
    })
  })

  describe('Given an invalid JSON file', () => {
    beforeEach(() => {
      mockReadFileSync.mockReturnValue('invalid-json')
    })
    it('throws an error', () => {
      expect(() => taskRepository.list()).toThrowError(
        TaskRepositoryErrorCode.INTERNAL_ERROR,
      )
    })
  })
})
