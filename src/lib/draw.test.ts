import { describe, expect, it } from 'vitest'
import type { State, Theme } from '../data/types'
import { DEFAULT_DRAW_SIZE, drawThemes } from './draw'

function theme(id: string): Theme {
  return {
    id,
    title: id,
    sigil: 'x',
    accent: '#ffffff',
    engine: 'reveal',
    params: {},
    diary: { date: '', weather: '', lines: [] },
    quotes: [],
  }
}

const pool = ['a', 'b', 'c', 'd', 'e'].map(theme)

function state(partial: Partial<State> = {}): State {
  return { entries: [], lit: [], seen: {}, ...partial }
}

/** 关掉随机扰动，抽取结果才是确定的 */
const noJitter = () => 0

describe('drawThemes', () => {
  it('池子不够 n 时全部返回', () => {
    const small = [theme('a'), theme('b')]
    const got = drawThemes(small, state(), DEFAULT_DRAW_SIZE).map((t) => t.id)
    expect(got).toEqual(['a', 'b'])
  })

  it('返回长度恒为 min(n, pool.length)', () => {
    expect(drawThemes(pool, state(), 3, noJitter)).toHaveLength(3)
    expect(drawThemes(pool, state(), 99, noJitter)).toHaveLength(5)
  })

  it('写过的题材一定在场', () => {
    const got = drawThemes(pool, state({ lit: ['d'] }), 2, noJitter).map((t) => t.id)
    expect(got).toContain('d')
    expect(got).toHaveLength(2)
  })

  it('写过的比 n 还多时，长度仍然守住', () => {
    const got = drawThemes(pool, state({ lit: ['a', 'b', 'c', 'd'] }), 2, noJitter)
    expect(got).toHaveLength(2)
  })

  it('越久没见到的题材越优先', () => {
    const s = state({ seen: { a: 500, b: 100, c: 400, d: 300, e: 200 } })
    expect(drawThemes(pool, s, 3, noJitter).map((t) => t.id)).toEqual(['b', 'e', 'd'])
  })

  it('从没见过的题材优先于见过的', () => {
    const s = state({ seen: { a: 1, b: 2 } })
    expect(drawThemes(pool, s, 3, noJitter).map((t) => t.id)).toEqual(['c', 'd', 'e'])
  })
})