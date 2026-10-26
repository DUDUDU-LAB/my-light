import type { Theme } from '../types'

const growth: Theme = {
  id: 'growth',
  title: '成长',
  sigil: '年',
  accent: '#c98f4a',
  engine: 'growth',
  params: {
    rings: 6,
    rampMs: 14000,
    hint: '待一会儿，看它一圈圈长出来',
  },
  diary: {
    date: '一月一日',
    weather: '雪',
    lines: [
      '我数了数，离开那间房子已经三年了。',
      '三年前我以为自己再也好不了。',
      '现在也没有好到哪里去，',
      '只是不再每天想起。',
      '像树一样，它不会觉得自己在长，',
      '只是每年多一圈。',
      '要等有人锯开它，才看得见那些年。',
    ],
  },
  quotes: [
    {
      id: 'growth-1',
      text: '生病的经验是一步步懂得满足。',
      source: '史铁生《病隙碎笔》',
      moods: ['成长:还没好'],
      keywords: ['病', '难受', '好起来', '满足'],
    },
    {
      id: 'growth-2',
      text: '岁月不饶人，我亦未曾饶过岁月。',
      source: '木心',
      moods: ['成长:回头看'],
      keywords: ['时间', '老', '过去', '不服'],
    },
    {
      id: 'growth-3',
      text: '人的内心必须怀有混沌，才能生出一颗跳舞的星星。',
      source: '尼采《查拉图斯特拉如是说》',
      moods: ['成长:还没好'],
      keywords: ['乱', '难受', '以后', '希望'],
    },
    {
      id: 'growth-4',
      text: '每个人真正的职业只有一个：找到自己。',
      source: '黑塞《德米安》',
      moods: ['成长:原谅'],
      keywords: ['找', '自己', '路', '成为'],
    },
    {
      id: 'growth-5',
      text: '古今之成大事业、大学问者，必经过三种之境界。',
      source: '王国维《人间词话》',
      moods: ['成长:回头看'],
      keywords: ['难', '熬', '境界', '走过来'],
    },
    {
      id: 'growth-6',
      text: '知其不可奈何而安之若命。',
      source: '《庄子·人间世》',
      moods: ['成长:原谅'],
      keywords: ['没办法', '接受', '认了', '放下'],
    },
    {
      id: 'growth-7',
      text: '故天将降大任于是人也，必先苦其心志，劳其筋骨。',
      source: '《孟子·告子下》',
      moods: ['成长:还没好'],
      keywords: ['苦', '难', '撑', '熬'],
    },
    {
      id: 'growth-8',
      text: '回首向来萧瑟处，归去，也无风雨也无晴。',
      source: '苏轼《定风波》',
      moods: ['成长:回头看', '成长:原谅'],
      keywords: ['回头', '过去', '平静', '都过去'],
    },
  ],
}

export default growth