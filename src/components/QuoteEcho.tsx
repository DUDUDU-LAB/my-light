import { motion } from 'framer-motion'
import type { Quote } from '../data/types'
import { typograph } from '../lib/typography'

interface Props {
  quote: Quote
  userText: string
  onSwap: () => void
}

/** 回响：像有人在你写的字下面，用另一支笔补了一句批注 */
export default function QuoteEcho({ quote, userText, onSwap }: Props) {
  return (
    <motion.div
      className="echo"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
    >
      <p className="echo__written">{typograph(userText)}</p>
      <div className="echo__note">
        <p className="echo__quote">{typograph(quote.text)}</p>
        <p className="echo__source">{typograph(quote.source)}</p>
      </div>
      <button type="button" className="echo__swap" onClick={onSwap}>
        换个说法
      </button>
    </motion.div>
  )
}