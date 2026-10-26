import type { Theme } from '../types'

const books: Theme = {
  id: 'books',
  title: '书籍',
  sigil: '书',
  accent: '#d9a441',
  engine: 'cards',
  params: {
    hint: '把每一页都翻过去',
    cards: [
      {
        id: 'books-c1',
        front: '天堂应该是……的模样',
        back: '我心里一直都在暗暗设想，天堂应该是图书馆的模样。',
        source: '博尔赫斯《关于天赐的诗》',
      },
      {
        id: 'books-c2',
        front: '过去都是假的，回忆是一条……',
        back: '过去都是假的，回忆是一条没有归途的路。',
        source: '马尔克斯《百年孤独》',
      },
      {
        id: 'books-c3',
        front: '经典是那些你经常听人说……的书',
        back: '经典是那些你经常听人说"我正在重读"，而从不听人说"我正在读"的书。',
        source: '卡尔维诺《为什么读经典》',
      },
    ],
  },
  diary: {
    date: '九月十二日',
    weather: '晴',
    lines: [
      '我在一本旧书里翻到一张纸条，',
      '上面写着：读到这一句的时候，请替我活下去。',
      '字很潦草，纸已经黄了，',
      '不知道是谁，也不知道是哪一年。',
      '我把纸条夹回原来那一页。',
      '有些话是写给陌生人的，',
      '但它确实救过某一个陌生人。',
    ],
  },
  quotes: [
    {
      id: 'books-1',
      text: '你不需要离开房间。留在桌边听就好。',
      source: '卡夫卡',
      moods: ['书籍:安静'],
      keywords: ['留', '房间', '听', '一个人'],
    },
    {
      id: 'books-2',
      text: '阅读是一座随身携带的避难所。',
      source: '毛姆《阅读是一座随身携带的避难所》',
      moods: ['书籍:被照亮'],
      keywords: ['躲', '书', '避难', '安静'],
    },
    {
      id: 'books-3',
      text: '婚姻是一座围城，城外的人想进去，城里的人想出来。',
      source: '钱钟书《围城》',
      moods: ['书籍:安静'],
      keywords: ['进', '出', '困', '想'],
    },
    {
      id: 'books-4',
      text: '许多时候，你以为看过的书都成了过眼云烟，其实它们仍是潜在的。',
      source: '三毛',
      moods: ['书籍:被照亮'],
      keywords: ['忘', '记得', '书', '改变'],
    },
    {
      id: 'books-5',
      text: '学而时习之，不亦说乎。',
      source: '《论语·学而》',
      moods: ['书籍:安静'],
      keywords: ['学', '读', '练习', '开心'],
    },
    {
      id: 'books-6',
      text: '腹有诗书气自华。',
      source: '苏轼《和董传留别》',
      moods: ['书籍:被照亮'],
      keywords: ['书', '气质', '自己', '读'],
    },
    {
      id: 'books-7',
      text: '从来没有人读书，只有人在书中读自己。',
      source: '罗曼·罗兰《约翰·克利斯朵夫》',
      moods: ['书籍:被照亮', '书籍:安静'],
      keywords: ['自己', '书', '看见', '找'],
    },
    {
      id: 'books-8',
      text: '读史使人明智，读诗使人灵秀。',
      source: '培根《随笔》',
      moods: ['书籍:安静'],
      keywords: ['读', '明白', '聪明', '书'],
    },
  ],
}

export default books