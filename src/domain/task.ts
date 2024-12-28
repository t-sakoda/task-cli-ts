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
  id: string
  description: string
  status: TaskStatus
  createdAt: string
  updatedAt: string

  private constructor(props: TaskProps) {
    this.id = props.id
    this.description = props.description
    this.status = props.status
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }

  static create(description: string): Task {
    return new Task({
      id: randomUUID(),
      description,
      status: TaskStatus.TODO,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }

  update(description: string): void {
    if (!description) {
      throw new Error('Description is required')
    }
    this.description = description
    this.updatedAt = new Date().toISOString()
  }
}