# task-cli-ts

## Usage

```sh
# Adding a new task
npx task-cli add "Buy groceries"
# Output: Task added successfully (ID: aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee)

# Updating and deleting tasks
npx task-cli update aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee "Buy groceries and cook dinner"
npx task-cli delete aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee

# Marking a task as in progress or done
npx task-cli mark-in-progress aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee
npx task-cli mark-done aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee

# Listing all tasks
npx task-cli list

# Listing tasks by status
npx task-cli list done
npx task-cli list todo
npx task-cli list in-progress
```

## References

- <https://roadmap.sh/projects/task-tracker>
