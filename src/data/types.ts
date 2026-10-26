/** 九种光影，各对应一种和自己的相处方式 */
export type EngineKind =
  | 'reveal' // 恐惧：擦开雾
  | 'clarity' // 反思：让水面静下来
  | 'cards' // 书籍：翻开一页
  | 'choice' // 电影：选一句台词
  | 'trail' // 运动：拖出一条发光的轨迹
  | 'pan' // 风景：横向漫游
  | 'spark' // 爱好：随手点亮
  | 'particles' // 治愈：呼吸的光
  | 'growth' // 成长：年轮向外长

export interface Quote {
  id: string
  text: string
  source: string
  /** 形如 '恐惧:钝痛'，冒号前是题材，冒号后是给人看的标签 */
  moods: string[]
  keywords: string[]
}

export interface Theme {
  id: string
  title: string
  sigil: string
  accent: string
  engine: EngineKind
  /** 各引擎私有参数，引擎内部防御式读取 */
  params: Record<string, unknown>
  diary: { date: string; weather: string; lines: string[] }
  quotes: Quote[]
}

export interface Entry {
  themeId: string
  text: string
  mood: string | null
  quoteId: string
  createdAt: number
}

export interface State {
  entries: Entry[]
  lit: string[]
  seen: Record<string, number>
}