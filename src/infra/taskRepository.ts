import * as fs from 'node:fs'
import type {Task} from '../domain/task'
import {
  type ITaskRepository,
  TaskRepositoryErrorCode,
} from '../domain/taskRepository'

const TASKS_JSON_FILE = 'tasks.json'

export class TaskRepository implements ITaskRepository {
  private readJsonFile(): Task[] {
    let tasks: Task[] = []
    try {
      const file = fs.readFileSync(TASKS_JSON_FILE)
      tasks = JSON.parse(file.toString())
    } catch (error: unknown) {
      if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
        console.log('No JSON file found. Creating a new one.')
        throw new Error(TaskRepositoryErrorCode.FILE_NOT_FOUND)
      }
      console.error('Error reading JSON file:', error)
      throw new Error(TaskRepositoryErrorCode.INTERNAL_ERROR)
    }
    return tasks
  }

  private writeJsonFile(tasks: Task[]): void {
    try {
      fs.writeFileSync(TASKS_JSON_FILE, JSON.stringify(tasks))
    } catch (error: unknown) {
      console.error('Error writing to JSON file:', error)
      throw new Error(TaskRepositoryErrorCode.FILE_WRITE_ERROR)
    }
  }

  insert(task: Task): void {
    let tasks: Task[] = []
    try {
      tasks = this.readJsonFile()
    } catch (error: unknown) {
      if (error instanceof Error && error.message === TaskRepositoryErrorCode.FILE_NOT_FOUND) {
        tasks = []
      } else {
        throw error
      }
    }
    const existingTask = tasks.find(t => t.id === task.id)
    if (existingTask) {
      throw new Error(TaskRepositoryErrorCode.TASK_ALREADY_EXISTS)
    }
    tasks.push(task)
    this.writeJsonFile(tasks)
  }
  update(task: Task): void {
    const tasks = this.readJsonFile()
    const index = tasks.findIndex((t) => t.id === task.id)
    if (index === -1) {
      throw new Error(TaskRepositoryErrorCode.TASK_NOT_FOUND)
    }
    tasks[index] = task
    this.writeJsonFile(tasks)
  }
  delete(task: Task): void {
    throw new Error('Method not implemented.')
  }
  list(): Task[] {
    throw new Error('Method not implemented.')
  }
  find(id: string): Task | undefined {
    throw new Error('Method not implemented.')
  }
}
