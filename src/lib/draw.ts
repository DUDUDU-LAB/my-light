import type { State, Theme } from '../data/types'

export const DEFAULT_DRAW_SIZE = 6

/** 随机扰动的上限：一天。相对 seen 的差距要足够小，才不会淹没"最久未见优先" */
const JITTER_MS = 24 * 60 * 60 * 1000

/**
 * 从题材池里抽今晚摆在桌上的那几张。
 * 不变量：
 *   1. 用户写过的题材一定在场（写过太多时优先最近写的）；
 *   2. 返回长度恒等于 min(n, pool.length)。
 */
export function drawThemes(
  pool: Theme[],
  state: State,
  n: number = DEFAULT_DRAW_SIZE,
  rand: () => number = Math.random,
): Theme[] {
  const limit = Math.min(n, pool.length)
  if (pool.length <= limit) return [...pool]

  const lit = new Set(state.lit)
  const lastWritten = (id: string): number => {
    let last = 0
    for (const e of state.entries) {
      if (e.themeId === id && e.createdAt > last) last = e.createdAt
    }
    return last
  }

  const pinned = pool
    .filter((t) => lit.has(t.id))
    .sort((a, b) => lastWritten(b.id) - lastWritten(a.id))
    .slice(0, limit)

  const pinnedIds = new Set(pinned.map((t) => t.id))
  const rest = pool
    .filter((t) => !pinnedIds.has(t.id))
    .map((t) => ({ t, key: (state.seen[t.id] ?? 0) + rand() * JITTER_MS }))
    .sort((a, b) => a.key - b.key)
    .map((x) => x.t)

  return [...pinned, ...rest.slice(0, limit - pinned.length)]
}