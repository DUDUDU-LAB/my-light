import { describe, expect, it } from 'vitest'
import type { Entry, Theme } from '../data/types'
import { extractKeywords, summarize } from './summarize'

function theme(id: string, title: string): Theme {
  return {
    id,
    title,
    sigil: 'x',
    accent: '#ffffff',
    engine: 'reveal',
    params: {},
    diary: { date: '', weather: '', lines: [] },
    quotes: [],
  }
}

const pool = [theme('fear', '恐惧'), theme('healing', '治愈')]

function entry(themeId: string, text: string, mood: string | null = null): Entry {
  return { themeId, text, mood, quoteId: 'q', createdAt: 1 }
}

describe('extractKeywords', () => {
  it('情绪词典命中的词，只出现一次也认得出来', () => {
    expect(extractKeywords([entry('film', '我也想在没人的地方，安心睡一觉。')], 2)).toContain('安心')
  })

  it('绝不造出跨词的碎片', () => {
    const got = extractKeywords([entry('film', '我也想在没人的地方，安心睡一觉。')], 2)
    expect(got).not.toContain('安心睡')
    expect(got).not.toContain('心睡')
  })

  it('重复出现的实词排在前面', () => {
    expect(extractKeywords([entry('fear', '孤独 孤独 深夜')], 2)[0]).toBe('孤独')
  })

  it('孤立的 2 字片段不算数', () => {
    // "的地""地方""心睡" 都只出现一次，不足以当实词
    expect(extractKeywords([entry('fear', '其实我也不知道')], 2)).toEqual([])
  })

  it('全是虚词时抽不出东西', () => {
    expect(extractKeywords([entry('fear', '的了是我你')], 2)).toEqual([])
  })
})

describe('summarize', () => {
  it('没写过任何东西时给默认落款', () => {
    expect(summarize([], pool)).toBe('你看，黑夜 和 微光，都是我的光。')
  })

  it('抽得到情绪词时就用它', () => {
    const line = summarize([entry('film', '我也想在没人的地方，安心睡一觉。', '电影:想哭')], pool)
    expect(line).toContain('安心')
    expect(line).toContain('都是我的光')
  })

  it('抽不出实词时回退到情绪标签', () => {
    const line = summarize([entry('fear', '的了是我你', '恐惧:钝痛')], pool)
    expect(line).toContain('钝痛')
  })

  it('没有实词也没有情绪时回退到题材名，且前后不重复', () => {
    expect(summarize([entry('fear', '', null)], pool)).toBe('你看，恐惧 和 微光，都是我的光。')
  })

  it('两条 entry 也能出句', () => {
    const line = summarize([entry('fear', '孤独 孤独'), entry('healing', '疲惫 疲惫')], pool)
    expect(line).toMatch(/^你看，.+ 和 .+，都是我的光。$/)
  })

  it('落款句里不会出现生造的短语', () => {
    const line = summarize([entry('film', '我也想在没人的地方，安心睡一觉。', '电影:想哭')], pool)
    expect(line).not.toContain('安心睡')
    expect(line).not.toMatch(/[，。]?\s*(心睡|人的|地方\s*和)/)
  })
})