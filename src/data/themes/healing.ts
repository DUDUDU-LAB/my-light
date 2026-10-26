import type { Theme } from '../types'

const healing: Theme = {
  id: 'healing',
  title: '治愈',
  sigil: '愈',
  accent: '#e8b06a',
  engine: 'particles',
  params: {
    breathMs: 8000,
    rampMs: 12000,
    particleCount: 64,
    hint: '跟着光圈，慢慢呼吸',
  },
  diary: {
    date: '四月十一日',
    weather: '阴转晴',
    lines: [
      '今天什么也没做成。',
      '泡了一杯茶，看着热气散掉，',
      '把窗户擦了一遍，又觉得没必要。',
      '傍晚的时候光从西边进来，落在墙上，',
      '我什么都没想，也没觉得这是浪费。',
      '原来普通的一天，也可以不被追究。',
    ],
  },
  quotes: [
    {
      id: 'healing-1',
      text: '如果你来访我，我不在，请和我门外的花坐一会儿。',
      source: '汪曾祺《人间草木》',
      moods: ['治愈:被打动'],
      keywords: ['等', '一个人', '花', '安静'],
    },
    {
      id: 'healing-2',
      text: '从前的日色变得慢，车，马，邮件都慢。',
      source: '木心《从前慢》',
      moods: ['治愈:释然'],
      keywords: ['慢', '以前', '累', '时间'],
    },
    {
      id: 'healing-3',
      text: '如果有来生，要做一棵树，站成永恒，没有悲欢的姿势。',
      source: '三毛《说给自己听》',
      moods: ['治愈:疲惫', '治愈:释然'],
      keywords: ['累', '树', '安静', '站着'],
    },
    {
      id: 'healing-4',
      text: '凌晨四点钟，看到海棠花未眠。',
      source: '川端康成《花未眠》',
      moods: ['治愈:被打动'],
      keywords: ['半夜', '醒', '花', '美'],
    },
    {
      id: 'healing-5',
      text: '以清净心看世界，以欢喜心过生活。',
      source: '林清玄《人生最美是清欢》',
      moods: ['治愈:释然'],
      keywords: ['心', '放下', '生活', '平静'],
    },
    {
      id: 'healing-6',
      text: '草在结它的种子，风在摇它的叶子。我们站着，不说话，就十分美好。',
      source: '顾城《门前》',
      moods: ['治愈:被打动', '治愈:疲惫'],
      keywords: ['安静', '不说话', '简单', '好'],
    },
    {
      id: 'healing-7',
      text: '只有用心才能看得清，本质的东西用眼睛是看不见的。',
      source: '《小王子》',
      moods: ['治愈:被打动'],
      keywords: ['心', '看不见', '重要', '本质'],
    },
    {
      id: 'healing-8',
      text: '如果没有这些小确幸，人生只不过是干巴巴的沙漠而已。',
      source: '村上春树《兰格汉斯岛的午后》',
      moods: ['治愈:疲惫', '治愈:释然'],
      keywords: ['小事', '幸福', '普通', '一天'],
    },
  ],
}

export default healing