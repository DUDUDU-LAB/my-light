import type { Entry, Theme } from '../data/types'
import { FALLBACK_IMAGES, LEXICON, moodLabel } from '../data/moods'

const PUNCT = /[\s，。！？、；：,.!?;:()\[\]"'《》「」（）]+/g

const STOP_GRAMS = new Set([
  '的', '了', '是', '我', '你', '他', '她', '它', '在', '有', '和', '就', '都', '也',
  '很', '不', '没', '这', '那', '什么', '自己', '就是', '还是', '但是', '所以',
  '因为', '如果', '已经', '可能', '真的', '有点', '一些', '然后', '现在', '时候',
  '感觉', '觉得', '知道', '不会', '不能', '想要', '需要', '可以', '应该', '一直',
  '总是', '非常', '特别', '一个', '我们', '他们', '这个', '那个', '没有', '不过',
  '而且', '或者', '只是', '好像', '其实', '之后', '以前', '以后', '今天', '明天',
])

const FUNCTION_CHARS = '的了是我你他她它在有和就都也很不没这那什么自己'

function segments(text: string): string[] {
  return text.split(PUNCT).filter((s) => s.length > 0)
}

function grams(seg: string, n: number): string[] {
  const out: string[] = []
  for (let i = 0; i + n <= seg.length; i += 1) out.push(seg.slice(i, i + n))
  return out
}

function isStopGram(g: string): boolean {
  if (STOP_GRAMS.has(g)) return true
  return [...g].every((ch) => FUNCTION_CHARS.includes(ch))
}

function occurrences(haystack: string, needle: string): number {
  let count = 0
  let i = haystack.indexOf(needle)
  while (i !== -1) {
    count += 1
    i = haystack.indexOf(needle, i + needle.length)
  }
  return count
}

/**
 * 两段式抽词：
 *   1. 先认情绪词典。用户真的写出来的情绪词一定有意义，优先级最高。
 *   2. 不够时，才用"重复出现过的 2 字实词"补。
 * 刻意不做通用 n-gram：单次出现的中文 n-gram 基本都是碎片，
 * 宁可少抽几个走兜底，也不能让落款句里出现"安心睡"这种生造词。
 */
export function extractKeywords(entries: Entry[], limit = 2): string[] {
  const picked: string[] = []
  const text = entries.map((e) => e.text).join('\n')

  const emotional = LEXICON.map((word, index) => ({
    word,
    index,
    count: occurrences(text, word),
  }))
    .filter((x) => x.count > 0)
    .sort((a, b) => b.count - a.count || a.index - b.index)

  for (const { word } of emotional) {
    if (picked.length >= limit) break
    if (picked.some((p) => p.includes(word) || word.includes(p))) continue
    picked.push(word)
  }

  if (picked.length < limit) {
    const counts = new Map<string, number>()
    for (const e of entries) {
      for (const seg of segments(e.text)) {
        for (const g of grams(seg, 2)) {
          if (isStopGram(g)) continue
          counts.set(g, (counts.get(g) ?? 0) + 1)
        }
      }
    }
    const repeated = [...counts.entries()]
      .filter(([, c]) => c >= 2)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    for (const [g] of repeated) {
      if (picked.length >= limit) break
      if (picked.some((p) => p.includes(g) || g.includes(p))) continue
      picked.push(g)
    }
  }

  return picked
}

/** 落款句：优先用你写过的实词，其次是你选过的情绪，都没有才回退到题材名和默认意象 */
export function summarize(entries: Entry[], pool: Theme[]): string {
  if (entries.length === 0) {
    return `你看，${FALLBACK_IMAGES[0]} 和 ${FALLBACK_IMAGES[1]}，都是我的光。`
  }

  const keywords = extractKeywords(entries, 2)
  const moods = [...new Set(entries.map((e) => e.mood).filter((m): m is string => m !== null))].map(moodLabel)
  const titles = [
    ...new Set(
      entries
        .map((e) => pool.find((t) => t.id === e.themeId)?.title)
        .filter((t): t is string => t !== undefined),
    ),
  ]

  const a = keywords[0] ?? moods[0] ?? titles[0] ?? FALLBACK_IMAGES[0]
  let b = keywords[1] ?? moods[1] ?? titles[1] ?? titles[0] ?? FALLBACK_IMAGES[1]
  if (b === a) b = FALLBACK_IMAGES[1]

  return `你看，${a} 和 ${b}，都是我的光。`
}