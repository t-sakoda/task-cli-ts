import { beforeEach, describe, expect, it, vi } from 'vitest'
import { TaskRepository } from '../../src/infra/taskRepository'
import { readFileSync } from 'node:fs'
import { Task } from '../../src/domain/task'

vi.mock('node:fs')
const mockReadFileSync = vi.mocked(readFileSync)

describe('TaskRepository.find', () => {
  describe('Given a task', () => {
    const task = Task.create('Do the laundry')
    beforeEach(() => {
      mockReadFileSync.mockReturnValue(JSON.stringify([task]))
    })
    it('finds the task', () => {
      const repository = new TaskRepository()
      const found = repository.find(task.id)
      expect(found).toEqual(task)
    })
  })
  describe('Given no task', () => {
    beforeEach(() => {
      mockReadFileSync.mockReturnValue('[]')
    })
    it('returns undefined', () => {
      const repository = new TaskRepository()
      const found = repository.find('non-existing-id')
      expect(found).toBeUndefined()
    })
  })
  describe('Given an error reading the JSON file', () => {
    beforeEach(() => {
      mockReadFileSync.mockImplementation(() => {
        throw new Error('Error reading JSON file')
      })
    })
    it('throws an error', () => {
      const repository = new TaskRepository()
      expect(() => repository.find('non-existing-id')).toThrow()
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
    it('returns undefined', () => {
      const repository = new TaskRepository()
      const found = repository.find('non-existing-id')
      expect(found).toBeUndefined()
    })
  })
})