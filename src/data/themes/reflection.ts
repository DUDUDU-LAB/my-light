import type { Theme } from '../types'

const reflection: Theme = {
  id: 'reflection',
  title: '反思',
  sigil: '映',
  accent: '#93aacb',
  engine: 'clarity',
  params: {
    travel: 2600,
    maxBlur: 14,
    hint: '慢慢掠过水面，让它静下来',
  },
  diary: {
    date: '二月八日',
    weather: '阴',
    lines: [
      '我又把同一件事想了一遍。',
      '想的还是那几句：如果当时我没说那句话，',
      '如果我早点发现，如果我再好一点。',
      '水面上我的样子一直在晃，',
      '我盯着看，想看清到底是谁。',
      '等风停了，水面平了，',
      '我才看清，那只是我自己。',
    ],
  },
  quotes: [
    {
      id: 'reflection-1',
      text: '吾日三省吾身。',
      source: '《论语·学而》',
      moods: ['反思:清醒'],
      keywords: ['反省', '自己', '错', '想'],
    },
    {
      id: 'reflection-2',
      text: '未经省察的人生不值得过。',
      source: '苏格拉底《申辩篇》',
      moods: ['反思:清醒'],
      keywords: ['活着', '意义', '明白', '想'],
    },
    {
      id: 'reflection-3',
      text: '吾生也有涯，而知也无涯。',
      source: '《庄子·养生主》',
      moods: ['反思:绕圈'],
      keywords: ['想不通', '没完', '累', '为什么'],
    },
    {
      id: 'reflection-4',
      text: '破山中贼易，破心中贼难。',
      source: '王阳明',
      moods: ['反思:懊悔', '反思:绕圈'],
      keywords: ['过不去', '自己', '难', '心'],
    },
    {
      id: 'reflection-5',
      text: '要对心里所有未解的问题保持耐心，试着去爱这些问题本身。',
      source: '里尔克《给青年诗人的信》',
      moods: ['反思:绕圈', '反思:平静'],
      keywords: ['想不通', '问题', '答案', '为什么'],
    },
    {
      id: 'reflection-6',
      text: '向外看的人在做梦，向内看的人才是清醒的。',
      source: '荣格',
      moods: ['反思:清醒'],
      keywords: ['看', '自己', '外面', '里面'],
    },
    {
      id: 'reflection-7',
      text: '知止而后有定，定而后能静。',
      source: '《大学》',
      moods: ['反思:平静'],
      keywords: ['停', '静', '安定', '乱'],
    },
    {
      id: 'reflection-8',
      text: '人是一根会思想的芦苇。',
      source: '帕斯卡尔《思想录》',
      moods: ['反思:清醒', '反思:平静'],
      keywords: ['小', '脆弱', '想', '人'],
    },
  ],
}

export default reflection