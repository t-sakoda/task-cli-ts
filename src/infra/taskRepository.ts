import * as fs from 'node:fs'
import {Task, type TaskObject, type TaskStatus} from '../domain/task'
import {
  type ITaskRepository,
  TaskRepositoryErrorCode,
} from '../domain/taskRepository'

const TASKS_JSON_FILE = 'tasks.json'

export class TaskRepository implements ITaskRepository {
  private readJsonFile(): TaskObject[] {
    let taskObjects: TaskObject[] = []
    try {
      const file = fs.readFileSync(TASKS_JSON_FILE, 'utf-8')
      taskObjects = JSON.parse(file)
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        (error as NodeJS.ErrnoException).code === 'ENOENT'
      ) {
        throw new Error(TaskRepositoryErrorCode.FILE_NOT_FOUND)
      }
      console.error('Error reading JSON file:', error)
      throw new Error(TaskRepositoryErrorCode.INTERNAL_ERROR)
    }
    return taskObjects
  }

  private writeJsonFile(taskObjects: TaskObject[]): void {
    try {
      fs.writeFileSync(TASKS_JSON_FILE, JSON.stringify(taskObjects, null, 2))
    } catch (error: unknown) {
      console.error('Error writing to JSON file:', error)
      throw new Error(TaskRepositoryErrorCode.FILE_WRITE_ERROR)
    }
  }

  insert(task: Task): void {
    let taskObjects: TaskObject[] = []
    try {
      taskObjects = this.readJsonFile()
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        error.message === TaskRepositoryErrorCode.FILE_NOT_FOUND
      ) {
        taskObjects = []
      } else {
        throw error
      }
    }
    const existingTask = taskObjects.find((t) => t.id === task.id)
    if (existingTask) {
      throw new Error(TaskRepositoryErrorCode.TASK_ALREADY_EXISTS)
    }
    taskObjects.push(task.toObject())
    this.writeJsonFile(taskObjects)
  }
  update(task: Task): void {
    const taskObjects = this.readJsonFile()
    const index = taskObjects.findIndex((t) => t.id === task.id)
    if (index === -1) {
      throw new Error(TaskRepositoryErrorCode.TASK_NOT_FOUND)
    }
    taskObjects[index] = task.toObject()
    this.writeJsonFile(taskObjects)
  }
  delete(task: Task): void {
    const taskObjects = this.readJsonFile()
    const index = taskObjects.findIndex((t) => t.id === task.id)
    if (index === -1) {
      throw new Error(TaskRepositoryErrorCode.TASK_NOT_FOUND)
    }
    taskObjects.splice(index, 1)
    this.writeJsonFile(taskObjects)
  }
  list(filterByStatus?: TaskStatus): Task[] {
    try {
      const taskObjects = this.readJsonFile()
      return taskObjects.reduce<Task[]>((tasks, t) => {
        if (!filterByStatus || t.status === filterByStatus) {
          tasks.push(Task.build(t))
        }
        return tasks
      }, [])
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        error.message === TaskRepositoryErrorCode.FILE_NOT_FOUND
      ) {
        return []
      }
      throw new Error(TaskRepositoryErrorCode.INTERNAL_ERROR)
    }
  }
  find(id: string): Task | undefined {
    let taskObjects: TaskObject[] = []
    try {
      taskObjects = this.readJsonFile()
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        error.message === TaskRepositoryErrorCode.FILE_NOT_FOUND
      ) {
        return undefined
      }
      throw error
    }
    const taskObj = taskObjects.find((t) => t.id === id)
    if (!taskObj) {
      return undefined
    }
    return Task.build(taskObj)
  }
}
