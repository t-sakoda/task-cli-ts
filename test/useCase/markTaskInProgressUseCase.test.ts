import {describe, expect, test} from 'vitest'

describe('MarkTaskInProgressUseCase', () => {
  // idが空文字の場合
  // 存在しないタスクのidが渡された場合
  // 存在するタスクのidが渡された場合
  // タスクを読み込む時にエラーが発生した場合
  // タスクを更新する時にエラーが発生した場合
  test('true is truthy', () => {
    expect(true).toBeTruthy()
  })
})
