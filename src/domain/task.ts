import {randomUUID} from 'node:crypto'

export const TaskErrorCode = {
  INVALID_PROPERTIES: 'InvalidTaskProperties',
} as const
export type TaskErrorCode = (typeof TaskErrorCode)[keyof typeof TaskErrorCode]

export const TaskStatus = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  DONE: 'done',
} as const
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus]

export interface TaskProps {
  id: string
  description: string
  status: TaskStatus
  createdAt: string
  updatedAt: string
}

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

  update(description: string): void {
    if (!description) {
      throw new Error('Description is required')
    }
    this.description = description
    this.updatedAt = new Date().toISOString()
  }

  mark(status: TaskStatus): void {
    if (!Object.values(TaskStatus).includes(status)) {
      throw new Error('Invalid status')
    }
    this.status = status
    this.updatedAt = new Date().toISOString()
  }
}
