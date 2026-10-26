import type { ComponentType } from 'react'
import type { EngineKind, Theme } from '../data/types'
import Reveal from './Reveal'
import Clarity from './Clarity'
import Cards from './Cards'
import Choice from './Choice'
import Trail from './Trail'
import Pan from './Pan'
import Spark from './Spark'
import Particles from './Particles'
import Growth from './Growth'

/** 引擎和场景之间唯一的契约：给一个题材，回报"这一页准备好了"的进度 */
export interface EngineProps {
  theme: Theme
  onProgress: (p: number) => void
  disabled?: boolean
}

/**
 * 场景只认这张表，永远不认识具体题材。
 * 加一个题材 = 加一个 Theme 数据；加一种玩法 = 加一个引擎并在这里登记。
 */
export const ENGINES: Record<EngineKind, ComponentType<EngineProps>> = {
  reveal: Reveal,
  clarity: Clarity,
  cards: Cards,
  choice: Choice,
  trail: Trail,
  pan: Pan,
  spark: Spark,
  particles: Particles,
  growth: Growth,
}