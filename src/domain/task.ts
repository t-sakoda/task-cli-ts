import {randomUUID} from 'node:crypto'

export const TaskErrorCode = {
  INVALID_PROPERTIES: 'InvalidTaskProperties',
  INVALID_STATUS: 'InvalidStatus',
} as const
export type TaskErrorCode = (typeof TaskErrorCode)[keyof typeof TaskErrorCode]

export const TaskStatus = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  DONE: 'done',
} as const
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus]

export interface TaskObject {
  id: string
  description: string
  status: TaskStatus
  createdAt: string
  updatedAt: string
}

export interface TaskProps extends TaskObject {}

export class Task {
  readonly id: string
  description: string
  status: TaskStatus
  readonly createdAt: string
  updatedAt: string

  private constructor(props: TaskProps) {
    this.id = props.id
    this.description = props.description
    this.status = props.status
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }

  static create(description: string): Task {
    const now = new Date().toISOString()
    return new Task({
      id: randomUUID(),
      description,
      status: TaskStatus.TODO,
      createdAt: now,
      updatedAt: now,
    })
  }

  static build(props: TaskProps): Task {
    if (
      !props.id ||
      typeof props.id !== 'string' ||
      !props.description ||
      typeof props.description !== 'string' ||
      !props.status ||
      !Object.values(TaskStatus).includes(props.status) ||
      !props.createdAt ||
      typeof props.createdAt !== 'string' ||
      !props.updatedAt ||
      typeof props.updatedAt !== 'string'
    ) {
      throw new Error(TaskErrorCode.INVALID_PROPERTIES)
    }
    return new Task(props)
  }

  toObject(): TaskObject {
    return {
      id: this.id,
      description: this.description,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }

  update(description: string): Task {
    if (!description) {
      throw new Error('Description is required')
    }
    this.description = description
    this.updatedAt = new Date().toISOString()
    return this
  }

  mark(status: TaskStatus): Task {
    if (!Object.values(TaskStatus).includes(status)) {
      throw new Error(TaskErrorCode.INVALID_STATUS)
    }
    this.status = status
    this.updatedAt = new Date().toISOString()
    return this
  }
}
