import type { Theme } from '../types'

const landscape: Theme = {
  id: 'landscape',
  title: '风景',
  sigil: '野',
  accent: '#e0a06a',
  engine: 'pan',
  params: {
    maxPan: 420,
    hint: '按住，往一边慢慢走',
  },
  diary: {
    date: '十月六日',
    weather: '晴，傍晚',
    lines: [
      '我坐了很久的长途车，去看一片海。',
      '到了才发现，海和照片上不一样，',
      '它更灰，更吵，也更冷。',
      '但太阳落下去的那十几分钟，',
      '颜色是一层层变的，',
      '那种变化里有一种说不出的耐心。',
      '我等它完全黑下来，才起身回家。',
    ],
  },
  quotes: [
    {
      id: 'landscape-1',
      text: '我步入丛林，因为我希望生活得有意义。',
      source: '梭罗《瓦尔登湖》',
      moods: ['风景:安静'],
      keywords: ['走', '离开', '生活', '简单'],
    },
    {
      id: 'landscape-2',
      text: '采菊东篱下，悠然见南山。',
      source: '陶渊明《饮酒》',
      moods: ['风景:安静'],
      keywords: ['安静', '山', '慢', '舒服'],
    },
    {
      id: 'landscape-3',
      text: '行到水穷处，坐看云起时。',
      source: '王维《终南别业》',
      moods: ['风景:空', '风景:安静'],
      keywords: ['走不动', '停', '等', '以后'],
    },
    {
      id: 'landscape-4',
      text: '我辽阔广大，我包罗万象。',
      source: '惠特曼《草叶集》',
      moods: ['风景:空'],
      keywords: ['大', '自己', '多', '复杂'],
    },
    {
      id: 'landscape-5',
      text: '山在呼唤，我必须前往。',
      source: '约翰·缪尔',
      moods: ['风景:舍不得'],
      keywords: ['想去', '远方', '山', '出发'],
    },
    {
      id: 'landscape-6',
      text: '惟江上之清风，与山间之明月。',
      source: '苏轼《前赤壁赋》',
      moods: ['风景:安静', '风景:空'],
      keywords: ['风', '月亮', '江', '夜里'],
    },
    {
      id: 'landscape-7',
      text: '宠辱不惊，看庭前花开花落。',
      source: '《菜根谭》',
      moods: ['风景:安静'],
      keywords: ['不在意', '放下', '看', '花'],
    },
    {
      id: 'landscape-8',
      text: '天地有大美而不言。',
      source: '《庄子·知北游》',
      moods: ['风景:空', '风景:舍不得'],
      keywords: ['美', '说不出', '静', '天地'],
    },
  ],
}

export default landscape