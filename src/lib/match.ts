import type { Quote, Theme } from '../data/types'

export const FALLBACK_QUOTE: Quote = {
  id: 'fallback',
  text: '有些话不必马上想明白，先放在这里。',
  source: '写给此刻的你',
  moods: [],
  keywords: [],
}

export function scoreQuote(quote: Quote, text: string, mood: string | null): number {
  let score = 0
  if (mood && quote.moods.includes(mood)) score += 3
  const hits = quote.keywords.filter((k) => k.length > 0 && text.includes(k)).length
  return score + hits * 2
}

/**
 * 在题材的金句池里挑最贴的一句。
 * 不变量：永远返回一条金句，绝不返回 undefined；
 * 全部用过就回到整池复用，宁可重复也不给空结果。
 */
export function matchQuote(
  theme: Theme,
  text: string,
  mood: string | null,
  usedIds: readonly string[] = [],
): Quote {
  if (theme.quotes.length === 0) return FALLBACK_QUOTE

  const used = new Set(usedIds)
  const fresh = theme.quotes.filter((q) => !used.has(q.id))
  const candidates = fresh.length > 0 ? fresh : theme.quotes

  let best = candidates[0]
  let bestScore = scoreQuote(best, text, mood)
  for (let i = 1; i < candidates.length; i += 1) {
    const s = scoreQuote(candidates[i], text, mood)
    if (s > bestScore) {
      best = candidates[i]
      bestScore = s
    }
  }
  return best
}