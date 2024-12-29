import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {Task, TaskStatus} from '../../src/domain/task'

describe('Task.update', () => {
  const mockDate = new Date('2025-01-01 00:00:00')
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(mockDate)
  })
  afterEach(() => {
    vi.useRealTimers()
  })
  describe('Given a description', () => {
    it('updates the task description', () => {
      const task = Task.create('Do the laundry')
      vi.advanceTimersByTime(1000)
      task.update('Do the dishes')
      expect(task).toEqual({
        id: expect.any(String),
        description: 'Do the dishes',
        status: TaskStatus.TODO,
        createdAt: mockDate.toISOString(),
        updatedAt: new Date(mockDate.getTime() + 1000).toISOString(),
      })
    })
  })

  describe('Given an empty description', () => {
    it('throws an error', () => {
      const task = Task.create('Do the laundry')
      expect(() => task.update('')).toThrow('Description is required')
    })
  })
})
