import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {readFileSync, writeFileSync} from 'node:fs'
import {TaskRepository} from '../../src/infra/taskRepository'
import { Task } from '../../src/domain/task'

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
        throw new Error('No JSON file found')
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
})
