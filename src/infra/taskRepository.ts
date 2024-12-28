import * as fs from 'node:fs'
import {
  TaskRepositoryErrorCode,
  type ITaskRepository,
} from '../domain/taskRepository'
import {Task} from '../domain/task'

const TASKS_JSON_FILE = 'tasks.json'

export class TaskRepository implements ITaskRepository {
  add(description: string): void {
    let tasks: Task[] = []
    try {
      const file = fs.readFileSync(TASKS_JSON_FILE)
      tasks = JSON.parse(file.toString())
    } catch (error: unknown) {
      console.log('No JSON file found. Creating a new one.')
    }
    const newTask = Task.create(description)
    tasks.push(newTask)
    try {
      fs.writeFileSync(TASKS_JSON_FILE, JSON.stringify(tasks))
    } catch (error: unknown) {
      console.error('Error writing to JSON file:', error)
      throw new Error(TaskRepositoryErrorCode.FILE_WRITE_ERROR)
    }
  }
  update(id: string, description: string): void {
    throw new Error('Method not implemented.')
  }
  delete(id: string): void {
    throw new Error('Method not implemented.')
  }
  markInProgress(id: string): void {
    throw new Error('Method not implemented.')
  }
  markDone(id: string): void {
    throw new Error('Method not implemented.')
  }
  listAll(): void {
    throw new Error('Method not implemented.')
  }
  listDone(): void {
    throw new Error('Method not implemented.')
  }
  listTodo(): void {
    throw new Error('Method not implemented.')
  }
  listInProgress(): void {
    throw new Error('Method not implemented.')
  }
}
