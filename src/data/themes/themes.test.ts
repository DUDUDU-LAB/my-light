import { describe, expect, it } from 'vitest'
import { themePool } from './index'

/** 九种光影，一个不多一个不少 */
const ENGINE_KINDS = [
  'reveal',
  'clarity',
  'cards',
  'choice',
  'trail',
  'pan',
  'spark',
  'particles',
  'growth',
]

const HEX = /^#[0-9a-f]{6}$/i

describe('题材池', () => {
  it('正好九个题材', () => {
    expect(themePool).toHaveLength(9)
  })

  it('题材 id 不重复', () => {
    const ids = themePool.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('九种引擎各用一次：既不重复，也没有闲置的玩法', () => {
    expect(themePool.map((t) => t.engine).sort()).toEqual([...ENGINE_KINDS].sort())
  })

  it('基础字段都完整', () => {
    for (const t of themePool) {
      expect(t.title.length).toBeGreaterThan(0)
      expect(t.sigil.length).toBeGreaterThan(0)
      expect(HEX.test(t.accent)).toBe(true)
      expect(t.params.hint).toBeTruthy()
      expect(t.diary.lines.length).toBeGreaterThanOrEqual(6)
    }
  })

  it('每个题材至少八条金句', () => {
    for (const t of themePool) expect(t.quotes.length).toBeGreaterThanOrEqual(8)
  })

  it('金句 id 全局唯一', () => {
    const ids = themePool.flatMap((t) => t.quotes.map((q) => q.id))
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('金句的字段和情绪标签都合规', () => {
    for (const t of themePool) {
      for (const q of t.quotes) {
        expect(q.text.length).toBeGreaterThan(4)
        expect(q.source.length).toBeGreaterThan(1)
        expect(q.keywords.length).toBeGreaterThanOrEqual(3)
        expect(q.moods.length).toBeGreaterThanOrEqual(1)
        // 情绪标签必须是「题材名:感觉」，书写区直接把人看的标签切出来用
        for (const m of q.moods) expect(m.startsWith(t.title + ':')).toBe(true)
      }
    }
  })

  it('同一题材内不重复引用同一处出处，避免回响撞车', () => {
    for (const t of themePool) {
      const sources = t.quotes.map((q) => q.source)
      expect(new Set(sources).size).toBe(sources.length)
    }
  })

  it('每个题材都能给出至少两个可选情绪', () => {
    for (const t of themePool) {
      expect(new Set(t.quotes.flatMap((q) => q.moods)).size).toBeGreaterThanOrEqual(2)
    }
  })
})