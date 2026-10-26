import type { Theme } from '../types'

const motion: Theme = {
  id: 'motion',
  title: '运动',
  sigil: '动',
  accent: '#e08a4a',
  engine: 'trail',
  params: {
    travel: 3200,
    hint: '按住，拖出一条光',
  },
  diary: {
    date: '三月二十一日',
    weather: '雨后',
    lines: [
      '跑了三公里，鞋全湿了。',
      '一开始只是想让自己累一点，',
      '累到没有力气再想那些事。',
      '跑到第二公里的时候发现，',
      '脑子里还是那件事，只是不再吵了。',
      '它跟着我的呼吸，一上一下。',
      '原来身体动起来，心才有地方放。',
    ],
  },
  quotes: [
    {
      id: 'motion-1',
      text: '痛楚难以避免，而磨难可以选择。',
      source: '村上春树《当我谈跑步时我谈些什么》',
      moods: ['运动:喘不过气'],
      keywords: ['累', '疼', '跑', '撑'],
    },
    {
      id: 'motion-2',
      text: '不要相信任何不是在户外、在自由运动中产生的思想。',
      source: '尼采《偶像的黄昏》',
      moods: ['运动:放空'],
      keywords: ['走', '外面', '想', '空气'],
    },
    {
      id: 'motion-3',
      text: '我只有走路的时候才能思考。',
      source: '卢梭《忏悔录》',
      moods: ['运动:放空'],
      keywords: ['走', '想', '在路上', '一个人'],
    },
    {
      id: 'motion-4',
      text: '天行健，君子以自强不息。',
      source: '《周易·乾卦》',
      moods: ['运动:痛快'],
      keywords: ['动', '不停', '强', '坚持'],
    },
    {
      id: 'motion-5',
      text: '我们必须想象西西弗是幸福的。',
      source: '加缪《西西弗神话》',
      moods: ['运动:喘不过气', '运动:放空'],
      keywords: ['重复', '推', '没意义', '继续'],
    },
    {
      id: 'motion-6',
      text: '一个人可以被毁灭，但不能被打败。',
      source: '海明威《老人与海》',
      moods: ['运动:痛快'],
      keywords: ['输', '撑', '不服', '站起来'],
    },
    {
      id: 'motion-7',
      text: '生活中重要的不是胜利，而是奋斗。',
      source: '顾拜旦',
      moods: ['运动:痛快'],
      keywords: ['赢', '比赛', '努力', '结果'],
    },
    {
      id: 'motion-8',
      text: '不积跬步，无以至千里。',
      source: '《荀子·劝学》',
      moods: ['运动:放空', '运动:痛快'],
      keywords: ['一步', '慢慢', '开始', '坚持'],
    },
  ],
}

export default motion