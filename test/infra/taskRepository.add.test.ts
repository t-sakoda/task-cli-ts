import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {readFileSync, writeFileSync} from 'node:fs'
import {TaskRepository} from '../../src/infra/taskRepository'
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
      taskRepository.add(description)
      expect(mockWriteFileSync).toHaveBeenCalledWith(
        'tasks.json',
        expect.any(String),
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
      taskRepository.add(description)
      expect(mockWriteFileSync).toHaveBeenCalledWith(
        'tasks.json',
        expect.any(String),
      )
    })
  })
})
