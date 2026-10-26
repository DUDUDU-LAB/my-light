import { describe, expect, it } from 'vitest'
import type { Quote, Theme } from '../data/types'
import { FALLBACK_QUOTE, matchQuote, scoreQuote } from './match'

function quote(id: string, moods: string[], keywords: string[]): Quote {
  return { id, text: `text-${id}`, source: 'src', moods, keywords }
}

const base: Theme = {
  id: 't',
  title: 't',
  sigil: 'x',
  accent: '#ffffff',
  engine: 'reveal',
  params: {},
  diary: { date: '', weather: '', lines: [] },
  quotes: [],
}

describe('scoreQuote', () => {
  it('情绪命中记 3 分', () => {
    expect(scoreQuote(quote('x', ['m'], []), '', 'm')).toBe(3)
  })

  it('每个命中关键词记 2 分', () => {
    expect(scoreQuote(quote('x', [], ['孤独', '夜']), '孤独的夜', null)).toBe(4)
  })
})

describe('matchQuote', () => {
  it('情绪命中优先于单个关键词命中', () => {
    const theme: Theme = { ...base, quotes: [quote('kw', [], ['孤独']), quote('mood', ['m'], [])] }
    expect(matchQuote(theme, '我很孤独', 'm', []).id).toBe('mood')
  })

  it('命中关键词越多分越高', () => {
    const theme: Theme = { ...base, quotes: [quote('one', [], ['孤独']), quote('two', [], ['孤独', '夜'])] }
    expect(matchQuote(theme, '孤独的夜', null, []).id).toBe('two')
  })

  it('排除已经用过的金句', () => {
    const theme: Theme = { ...base, quotes: [quote('a', ['m'], []), quote('b', [], ['孤独'])] }
    expect(matchQuote(theme, '孤独', 'm', ['a']).id).toBe('b')
  })

  it('全部用过时仍然返回金句，不返回 undefined', () => {
    const theme: Theme = { ...base, quotes: [quote('a', [], []), quote('b', [], [])] }
    const got = matchQuote(theme, '', null, ['a', 'b'])
    expect(got).toBeDefined()
    expect(['a', 'b']).toContain(got.id)
  })

  it('题材没有金句时给兜底句', () => {
    expect(matchQuote(base, '随便写点什么', null, []).id).toBe(FALLBACK_QUOTE.id)
  })
})