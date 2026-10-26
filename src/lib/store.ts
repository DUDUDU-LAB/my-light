import type { Entry, State } from '../data/types'

const KEY = 'my-light/v1'
const VERSION = 1

export interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

interface Persisted extends State {
  version: number
}

export function emptyState(): State {
  return { entries: [], lit: [], seen: {} }
}

/** 内存兜底：隐私模式、存储被禁用、以及测试环境都走这里 */
export function memoryStorage(): StorageLike {
  const map = new Map<string, string>()
  return {
    getItem: (k) => (map.has(k) ? (map.get(k) as string) : null),
    setItem: (k, v) => {
      map.set(k, v)
    },
    removeItem: (k) => {
      map.delete(k)
    },
  }
}

export function defaultStorage(): StorageLike {
  try {
    if (typeof localStorage !== 'undefined') {
      const probe = '__my_light_probe__'
      localStorage.setItem(probe, '1')
      localStorage.removeItem(probe)
      return localStorage
    }
  } catch {
    // 被禁用时静默降级，不打断任何一次写下
  }
  return memoryStorage()
}

export function createStore(storage: StorageLike = defaultStorage()) {
  let cache: State | null = null

  const read = (): State => {
    if (cache !== null) return cache
    const raw = storage.getItem(KEY)
    if (!raw) {
      const fresh = emptyState()
      cache = fresh
      return fresh
    }
    try {
      const parsed = JSON.parse(raw) as Partial<Persisted>
      if (parsed.version !== VERSION || !Array.isArray(parsed.entries)) {
        const fresh = emptyState()
        cache = fresh
        return fresh
      }
      const restored: State = {
        entries: parsed.entries,
        lit: Array.isArray(parsed.lit) ? parsed.lit : [],
        seen: parsed.seen && typeof parsed.seen === 'object' ? parsed.seen : {},
      }
      cache = restored
      return restored
    } catch {
      const fresh = emptyState()
      cache = fresh
      return fresh
    }
  }

  const write = (next: State): State => {
    cache = next
    storage.setItem(KEY, JSON.stringify({ version: VERSION, ...next }))
    return next
  }

  return {
    loadState: read,
    saveEntry(entry: Entry): State {
      const s = read()
      const lit = s.lit.includes(entry.themeId) ? s.lit : [...s.lit, entry.themeId]
      return write({ ...s, entries: [...s.entries, entry], lit })
    },
    markSeen(themeId: string): State {
      const s = read()
      return write({ ...s, seen: { ...s.seen, [themeId]: Date.now() } })
    },
    resetAll(): State {
      storage.removeItem(KEY)
      const fresh = emptyState()
      cache = fresh
      return fresh
    },
  }
}

const store = createStore()

export const loadState = store.loadState
export const saveEntry = store.saveEntry
export const markSeen = store.markSeen
export const resetAll = store.resetAll