#!/usr/bin/env node

const args = process.argv.slice(2)

// Validate arguments
if (args.length === 0) {
  console.error('No arguments provided')
  process.exit(1)
}

switch(args[0]) {
  case 'add':
    console.log('Adding...')
    break
  case 'update':
    console.log('Updating...')
    break
  case 'delete':
    console.log('Deleting...')
    break
  case 'mark-in-progress':
    console.log('Marking as in progress...')
    break
  case 'mark-done':
    console.log('Marking done...')
    break
  case 'list': {
    switch (args[1]) {
      case undefined:
        console.log('Listing all tasks...')
        break
      case 'done':
        console.log('Listing done tasks...')
        break
      case 'todo':
        console.log('Listing todo tasks...')
        break
      case 'in-progress':
        console.log('Listing tasks in progress...')
        break
      default:
        console.error('Invalid list option')
        process.exit(1)
    }
    break
  }
  default:
    console.error('Invalid command')
    process.exit(1)
}

process.exit(0)