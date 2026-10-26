import { motion } from 'framer-motion'
import { useState } from 'react'
import Fragment from '../components/Fragment'
import type { Spot } from '../components/Fragment'
import { themePool } from '../data/themes'
import type { State } from '../data/types'
import { drawThemes } from '../lib/draw'

/**
 * 桌面上的落点：错落、有疏有密，刻意避开整齐的网格。
 * 前六个是常用的（默认抽六张），后三个是池子变大时才用到的空位。
 */
const SPOTS: Spot[] = [
  { x: 14, y: 26, r: -6 },
  { x: 56, y: 17, r: 4 },
  { x: 30, y: 58, r: -3 },
  { x: 78, y: 47, r: 7 },
  { x: 52, y: 74, r: -5 },
  { x: 82, y: 20, r: -4 },
  { x: 11, y: 68, r: 5 },
  { x: 40, y: 38, r: 2 },
  { x: 66, y: 66, r: -7 },
]

interface Props {
  state: State
  onOpen: (id: string) => void
  onFinale: () => void
}

export default function Desk({ state, onOpen, onFinale }: Props) {
  // 每次回到桌上重新抽一次：这张桌子今晚和明晚不太一样
  const [tonight] = useState(() => drawThemes(themePool, state))
  const litCount = state.lit.length

  return (
    <motion.section
      className="scene scene--desk"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <header className="desk__head">
        <h1 className="desk__title">散落在桌上的，都是你。</h1>
        <p className="desk__sub">
          {litCount === 0 ? '今晚还没有写下什么。' : `已经写下 ${litCount} 页。`}
        </p>
      </header>

      <div className="desk__field">
        {tonight.map((theme, i) => (
          <Fragment
            key={theme.id}
            theme={theme}
            index={i}
            lit={state.lit.includes(theme.id)}
            spot={SPOTS[i % SPOTS.length]}
            onOpen={onOpen}
          />
        ))}
      </div>

      <button type="button" className="desk__lamp" onClick={onFinale}>
        <span className="desk__lamp-glow" aria-hidden="true" />
        <span className="desk__lamp-text">我的光</span>
      </button>
    </motion.section>
  )
}