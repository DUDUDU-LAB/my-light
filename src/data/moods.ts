/** '恐惧:钝痛' -> '钝痛' */
export function moodLabel(mood: string): string {
  const i = mood.indexOf(':')
  return i >= 0 ? mood.slice(i + 1) : mood
}

/** 从金句池里推导这个题材能给用户选的情绪，保持"标签即金句标签"这条不变量 */
export function moodOptionsOf(quotes: { moods: string[] }[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const q of quotes) {
    for (const m of q.moods) {
      if (seen.has(m)) continue
      seen.add(m)
      out.push(m)
    }
  }
  return out
}

/**
 * 情绪与意象词表。
 * 抽词优先认这张表 -- 中文 n-gram 很容易造出"安心睡""被人看"这种碎片，
 * 而落款句是这个产品最打动人的一刻，绝对不能出现生造词。
 * 只收多字词：单字命中率太低，宁可抽不出来，走情绪标签兜底。
 */
export const LEXICON: string[] = [
  '孤独', '孤单', '寂寞', '害怕', '恐惧', '焦虑', '不安', '慌张',
  '疲惫', '无力', '麻木', '空虚', '迷茫', '失落', '失望', '沮丧',
  '难过', '委屈', '愤怒', '生气', '羞耻', '自责', '后悔', '遗憾',
  '崩溃', '烦躁', '压力', '痛苦', '煎熬', '挣扎', '撑不住',
  '想念', '思念', '牵挂', '舍不得', '告别', '离开', '错过',
  '平静', '释然', '安心', '踏实', '轻松', '温暖', '感动', '被理解',
  '希望', '勇气', '自由', '放下', '原谅', '接纳', '坦然', '和解',
  '开心', '快乐', '幸福', '骄傲', '满足', '充实', '庆幸',
  '深夜', '失眠', '一个人', '普通', '浪费', '失败', '长大', '成长',
  '黑暗', '微光', '天亮', '夏天', '冬天', '雨天',
]

/** 落款句在完全抽不出实词时的兜底意象 */
export const FALLBACK_IMAGES = ['黑夜', '微光', '沉默', '走神']