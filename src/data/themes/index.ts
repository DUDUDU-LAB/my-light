import type { Theme } from '../types'
import fear from './fear'
import reflection from './reflection'
import books from './books'
import film from './film'
import motion from './motion'
import landscape from './landscape'
import hobby from './hobby'
import healing from './healing'
import growth from './growth'

/**
 * 题材池：九种光影，九种和自己的相处方式。
 * 往这里加一个 Theme 就等于往桌上多放一张纸，
 * 场景、引擎、抽取逻辑都不需要改动。
 */
export const themePool: Theme[] = [
  fear,
  reflection,
  books,
  film,
  motion,
  landscape,
  hobby,
  healing,
  growth,
]

export function themeById(id: string): Theme | undefined {
  return themePool.find((t) => t.id === id)
}