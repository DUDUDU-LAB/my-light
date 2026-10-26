import { describe, expect, it } from 'vitest'
import { typograph } from './typography'

describe('typograph', () => {
  it('把三个点换成一个省略号', () => {
    expect(typograph('我想了很久...')).toBe('我想了很久\u2026')
  })

  it('把两个连字符换成一个破折号', () => {
    expect(typograph('回去--回不去了')).toBe('回去\u2014回不去了')
  })

  it('不动别的标点', () => {
    expect(typograph('今天，什么也没做成。')).toBe('今天，什么也没做成。')
  })

  it('只换一次，不叠加', () => {
    expect(typograph('...')).toBe('\u2026')
    expect(typograph('--')).toBe('\u2014')
  })
})