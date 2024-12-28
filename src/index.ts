#!/usr/bin/env node

import {TaskController} from './presentation/taskController'

const args = process.argv.slice(2)

const taskController = new TaskController()
try {
  taskController.run(args)
  process.exit(0)
} catch (error: unknown) {
  if (error instanceof Error) {
    console.error(error.message)
  } else {
    console.error('Unexpected error occurred')
  }
  process.exit(1)
}
