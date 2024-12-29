import {randomUUID} from 'node:crypto'

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
    return new Task(props)
  }

  update(description: string): void {
    if (!description) {
      throw new Error('Description is required')
    }
    this.description = description
    this.updatedAt = new Date().toISOString()
  }
}
