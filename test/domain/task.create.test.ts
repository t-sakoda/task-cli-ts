import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {Task} from '../../src/domain/task'

describe('Task.create', () => {
  const mockDate = new Date('2025/01/01 09:00:00')
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(mockDate)
  })
  afterEach(() => {
    vi.useRealTimers()
  })
  it('creates a task with the given description', () => {
    const task = Task.create('Do the dishes')
    expect(task.description).toBe('Do the dishes')
  })

  it('creates a task with the status set to "todo"', () => {
    const task = Task.create('Do the dishes')
    expect(task.status).toBe('todo')
  })

  it('creates a task with a unique id', () => {
    const task1 = Task.create('Do the dishes')
    const task2 = Task.create('Do the laundry')
    expect(task1.id).not.toBe(task2.id)
  })

  it('creates a task with the createdAt and updatedAt fields set to the current date and time', () => {
    const task = Task.create('Do the dishes')
    const now = mockDate.toISOString()
    expect(task.createdAt).toBe(now)
    expect(task.updatedAt).toBe(now)
  })
})
