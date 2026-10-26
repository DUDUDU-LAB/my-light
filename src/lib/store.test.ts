import { describe, expect, it } from 'vitest'
import type { Entry } from '../data/types'
import { createStore, memoryStorage } from './store'

const KEY = 'my-light/v1'

function entry(themeId: string): Entry {
  return { themeId, text: 'x', mood: null, quoteId: 'q', createdAt: 1 }
}

describe('store', () => {
  it('初始是空 state', () => {
    expect(createStore(memoryStorage()).loadState()).toEqual({ entries: [], lit: [], seen: {} })
  })

  it('写入之后重新读取仍然一致，并自动点亮对应题材', () => {
    const storage = memoryStorage()
    createStore(storage).saveEntry(entry('fear'))
    const reloaded = createStore(storage).loadState()
    expect(reloaded.entries).toHaveLength(1)
    expect(reloaded.entries[0].themeId).toBe('fear')
    expect(reloaded.lit).toEqual(['fear'])
  })

  it('重复写同一个题材不会重复点亮', () => {
    const store = createStore(memoryStorage())
    store.saveEntry(entry('fear'))
    store.saveEntry(entry('fear'))
    expect(store.loadState().lit).toEqual(['fear'])
    expect(store.loadState().entries).toHaveLength(2)
  })

  it('markSeen 会记下时间戳', () => {
    const store = createStore(memoryStorage())
    store.markSeen('film')
    expect(store.loadState().seen.film).toBeGreaterThan(0)
  })

  it('版本号不匹配时重置为空 state', () => {
    const storage = memoryStorage()
    storage.setItem(KEY, JSON.stringify({ version: 99, entries: [entry('fear')], lit: ['fear'], seen: {} }))
    expect(createStore(storage).loadState()).toEqual({ entries: [], lit: [], seen: {} })
  })

  it('内容损坏时重置为空 state', () => {
    const storage = memoryStorage()
    storage.setItem(KEY, '{ not json')
    expect(createStore(storage).loadState()).toEqual({ entries: [], lit: [], seen: {} })
  })

  it('resetAll 会清空存储', () => {
    const storage = memoryStorage()
    const store = createStore(storage)
    store.saveEntry(entry('fear'))
    store.resetAll()
    expect(store.loadState()).toEqual({ entries: [], lit: [], seen: {} })
    expect(storage.getItem(KEY)).toBeNull()
  })
})