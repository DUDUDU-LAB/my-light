import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import type { CSSProperties } from 'react'
import DiarySheet from '../components/DiarySheet'
import QuoteEcho from '../components/QuoteEcho'
import WritingPad from '../components/WritingPad'
import type { Quote, Theme } from '../data/types'
import { ENGINES } from '../engines'
import { matchQuote } from '../lib/match'

interface Props {
  theme: Theme
  onBack: () => void
  onSave: (text: string, mood: string | null, quoteId: string) => void
}

interface Echo {
  text: string
  quote: Quote
  used: string[]
}

export default function Entry({ theme, onBack, onSave }: Props) {
  const [progress, setProgress] = useState(0)
  const [echo, setEcho] = useState<Echo | null>(null)
  const Engine = ENGINES[theme.engine]
  const ready = progress >= 1

  const handleSubmit = (text: string, mood: string | null) => {
    const quote = matchQuote(theme, text, mood, [])
    setEcho({ text, quote, used: [quote.id] })
    onSave(text, mood, quote.id)
  }

  const swap = () => {
    if (!echo) return
    const next = matchQuote(theme, echo.text, null, echo.used)
    setEcho({ ...echo, quote: next, used: [...echo.used, next.id] })
  }

  const stageStyle: CSSProperties & Record<string, string> = {}
  stageStyle['--accent'] = theme.accent

  return (
    <motion.section
      className="scene scene--entry"
      style={stageStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9 }}
    >
      <header className="entry__head">
        <button type="button" className="entry__back" onClick={onBack}>
          回到桌上
        </button>
        <span className="entry__sigil" aria-hidden="true">
          {theme.sigil}
        </span>
        <h2 className="entry__title">{theme.title}</h2>
        <span className="entry__bar" aria-hidden="true">
          <span className="entry__bar-fill" style={{ transform: `scaleX(${progress})` }} />
        </span>
      </header>

      <div className="entry__stage">
        <DiarySheet theme={theme} reveal={progress} />
        <Engine theme={theme} onProgress={setProgress} />
      </div>

      <div className="entry__write">
        <AnimatePresence mode="wait">
          {echo ? (
            <QuoteEcho key="echo" quote={echo.quote} userText={echo.text} onSwap={swap} />
          ) : (
            <WritingPad key="pad" theme={theme} unlocked={ready} onSubmit={handleSubmit} />
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  )
}