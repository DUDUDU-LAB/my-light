import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'
import type { Theme } from '../data/types'

export interface Spot {
  x: number
  y: number
  r: number
}

interface Props {
  theme: Theme
  index: number
  lit: boolean
  spot: Spot
  onOpen: (id: string) => void
}

/**
 * 桌上的一张纸片。
 * 定位交给外层 anchor（纯 CSS transform 居中），旋转和悬停交给 motion，
 * 两者不抢同一个 transform，错落感才稳。
 */
export default function Fragment({ theme, index, lit, spot, onOpen }: Props) {
  const anchorStyle: CSSProperties = { left: `${spot.x}%`, top: `${spot.y}%` }
  const cardStyle: CSSProperties & Record<string, string> = {}
  cardStyle['--accent'] = theme.accent

  return (
    <div className="fragment__anchor" style={anchorStyle}>
      <motion.button
        type="button"
        className={`fragment${lit ? ' is-lit' : ''}`}
        style={cardStyle}
        initial={{ opacity: 0, y: 18, rotate: spot.r - 4 }}
        animate={{ opacity: 1, y: 0, rotate: spot.r }}
        transition={{ delay: index * 0.12, duration: 0.7, ease: 'easeOut' }}
        whileHover={{ y: -6, rotate: spot.r * 0.5 }}
        onClick={() => onOpen(theme.id)}
      >
        <span className="fragment__tape" aria-hidden="true" />
        <span className="fragment__sigil" aria-hidden="true">
          {theme.sigil}
        </span>
        <span className="fragment__title">{theme.title}</span>
        <span className="fragment__meta">{lit ? '已经写过' : '还没打开'}</span>
      </motion.button>
    </div>
  )
}