import type { Theme } from '../types'

const hobby: Theme = {
  id: 'hobby',
  title: '爱好',
  sigil: '趣',
  accent: '#e5c168',
  engine: 'spark',
  params: {
    sparks: 6,
    hint: '随手点几下，看它亮起来',
  },
  diary: {
    date: '五月二十九日',
    weather: '晴',
    lines: [
      '我买了颜料，其实不会画。',
      '就随便涂，涂满一整张，再换一张。',
      '手上全是颜色，洗了好几次才掉。',
      '做这件事没有任何用处，',
      '不能换钱，也写不进简历，',
      '但那一整个下午，我没有想起来要讨厌我自己。',
    ],
  },
  quotes: [
    {
      id: 'hobby-1',
      text: '一个人感兴趣的事越多，他拥有的快乐机会就越多。',
      source: '罗素《幸福之路》',
      moods: ['爱好:开心'],
      keywords: ['喜欢', '快乐', '多', '有意思'],
    },
    {
      id: 'hobby-2',
      text: '人活着，就得有点兴致。',
      source: '汪曾祺《人间有味》',
      moods: ['爱好:放松'],
      keywords: ['生活的', '有趣', '喜欢', '做'],
    },
    {
      id: 'hobby-3',
      text: '发愤忘食，乐以忘忧。',
      source: '《论语·述而》',
      moods: ['爱好:入迷'],
      keywords: ['忘了', '时间', '投入', '开心'],
    },
    {
      id: 'hobby-4',
      text: '想象力比知识更重要。',
      source: '爱因斯坦',
      moods: ['爱好:开心'],
      keywords: ['想', '画画', '创造', '玩'],
    },
    {
      id: 'hobby-5',
      text: '余闲居，案头瓶花不绝。',
      source: '沈复《浮生六记》',
      moods: ['爱好:放松'],
      keywords: ['闲', '家里', '花', '小事'],
    },
    {
      id: 'hobby-6',
      text: '不乱于心，不困于情，不畏将来，不念过往。',
      source: '丰子恺',
      moods: ['爱好:放松'],
      keywords: ['乱', '安静', '过去', '以后'],
    },
    {
      id: 'hobby-7',
      text: '乐业即是趣味。',
      source: '梁启超《敬业与乐业》',
      moods: ['爱好:入迷'],
      keywords: ['做', '喜欢', '乐趣', '认真'],
    },
    {
      id: 'hobby-8',
      text: '人生在世，还不是有时笑笑人家，有时给人家笑笑。',
      source: '林语堂《生活的艺术》',
      moods: ['爱好:开心', '爱好:放松'],
      keywords: ['笑', '别人', '自己', '轻松'],
    },
  ],
}

export default hobby