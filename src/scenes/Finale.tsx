import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { themePool } from '../data/themes'
import type { State } from '../data/types'
import { summarize } from '../lib/summarize'
import { typograph } from '../lib/typography'

interface Props {
  state: State
  onBack: () => void
  onReset: () => void
}

export default function Finale({ state, onBack, onReset }: Props) {
  const [confirming, setConfirming] = useState(false)

  const entries = useMemo(
    () => [...state.entries].sort((a, b) => a.createdAt - b.createdAt),
    [state.entries],
  )
  // 落款句只在进入这一页时算一次，避免"换个说法"这类交互把它改掉
  const line = useMemo(() => summarize(entries, themePool), [entries])

  const handleReset = () => {
    if (!confirming) {
      setConfirming(true)
      window.setTimeout(() => setConfirming(false), 4000)
      return
    }
    onReset()
  }

  return (
    <motion.section
      className="scene scene--finale"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
    >
      <header className="finale__head">
        <h2 className="finale__title">我的光</h2>
        <p className="finale__sub">
          {entries.length === 0 ? '这里还空着，但光已经在了。' : '你写下的字，都还在这里。'}
        </p>
      </header>

      <div className="finale__notes">
        {entries.map((entry, i) => (
          <motion.p
            key={`${entry.createdAt}-${i}`}
            className="finale__note"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + i * 0.35, duration: 1.1, ease: 'easeOut' }}
          >
            {typograph(entry.text)}
          </motion.p>
        ))}
      </div>

      <motion.p
        className="finale__seal"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 + entries.length * 0.35, duration: 1.8, ease: 'easeOut' }}
      >
        {typograph(line)}
      </motion.p>

      <div className="finale__foot">
        <button type="button" className="finale__back" onClick={onBack}>
          回到桌上
        </button>
        <button
          type="button"
          className={`finale__reset${confirming ? ' is-confirming' : ''}`}
          onClick={handleReset}
        >
          {confirming ? '再点一次，就收起来' : '把这些都收起来'}
        </button>
      </div>
    </motion.section>
  )
}