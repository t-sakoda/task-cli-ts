import {describe, expect, it} from 'vitest'
import {Task, TaskErrorCode, TaskStatus} from '../../src/domain/task'

describe('Task.mark', () => {
  describe('Given a status, Todo', () => {
    it('marks the task as Todo', () => {
      const task = Task.create('task')
      task.mark(TaskStatus.TODO)
      expect(task.status).toBe(TaskStatus.TODO)
    })
  })
  describe('Given a status, In-progress', () => {
    it('marks the task as In-progress', () => {
      const task = Task.create('task')
      task.mark(TaskStatus.IN_PROGRESS)
      expect(task.status).toBe(TaskStatus.IN_PROGRESS)
    })
  })
  describe('Given a status, Done', () => {
    it('marks the task as Done', () => {
      const task = Task.create('task')
      task.mark(TaskStatus.DONE)
      expect(task.status).toBe(TaskStatus.DONE)
    })
  })
  describe('Given an invalid status', () => {
    it('throws an error', () => {
      const task = Task.create('task')
      expect(() => task.mark('invalid' as TaskStatus)).toThrowError(
        TaskErrorCode.INVALID_STATUS,
      )
    })
  })
})
