import * as fs from 'node:fs'
import {
  TaskRepositoryErrorCode,
  type ITaskRepository,
} from '../domain/taskRepository'
import {Task} from '../domain/task'

const TASKS_JSON_FILE = 'tasks.json'

export class TaskRepository implements ITaskRepository {
  insert(task: Task): void {
    let tasks: Task[] = []
    try {
      const file = fs.readFileSync(TASKS_JSON_FILE)
      tasks = JSON.parse(file.toString())
    } catch (error: unknown) {
      console.log('No JSON file found. Creating a new one.')
    }
    tasks.push(task)
    try {
      fs.writeFileSync(TASKS_JSON_FILE, JSON.stringify(tasks))
    } catch (error: unknown) {
      console.error('Error writing to JSON file:', error)
      throw new Error(TaskRepositoryErrorCode.FILE_WRITE_ERROR)
    }
  }
  update(task: Task): void {
    throw new Error('Method not implemented.')
  }
  delete(task: Task): void {
    throw new Error('Method not implemented.')
  }
  list(): Task[]{
    throw new Error('Method not implemented.')
  }
  find(id: string): Task | undefined {
    throw new Error('Method not implemented.')
  }
}
