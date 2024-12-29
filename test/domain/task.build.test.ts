import {describe, expect, it} from 'vitest'
import {Task, TaskErrorCode, TaskStatus} from '../../src/domain/task'

describe('Task.build', () => {
  describe('Given a task object', () => {
    it('returns Task instance', () => {
      const now = new Date().toISOString()
      const task = Task.build({
        id: '1',
        description: 'test',
        status: TaskStatus.TODO,
        createdAt: now,
        updatedAt: now,
      })
      expect(task).toBeInstanceOf(Task)
    })
  })

  describe('Given a task object with invalid status', () => {
    it('throws an error', () => {
      const now = new Date().toISOString()
      expect(() =>
        Task.build({
          id: '1',
          description: 'test',
          status: 'invalid' as TaskStatus,
          createdAt: now,
          updatedAt: now,
        }),
      ).toThrow(TaskErrorCode.INVALID_PROPERTIES)
    })
  })
})
