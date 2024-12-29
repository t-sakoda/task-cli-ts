import {vi} from 'vitest'

export const mockTaskRepository = () => ({
  insert: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  list: vi.fn(),
  find: vi.fn(),
})
