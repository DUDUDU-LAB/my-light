import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface Props {
  onEnter: () => void
}

export default function Intro({ onEnter }: Props) {
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setShowHint(true), 4200)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const enter = () => onEnter()
    window.addEventListener('keydown', enter)
    window.addEventListener('wheel', enter, { passive: true })
    return () => {
      window.removeEventListener('keydown', enter)
      window.removeEventListener('wheel', enter)
    }
  }, [onEnter])

  return (
    <motion.section
      className="scene scene--intro"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.4, ease: 'easeInOut' }}
      onClick={onEnter}
    >
      <motion.p
        className="intro__line"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 2, ease: 'easeOut' }}
      >
        今天，把时间留给自己吧。
      </motion.p>
      <motion.span
        className="intro__hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: showHint ? 1 : 0 }}
        transition={{ duration: 1.6 }}
      >
        轻触进入
      </motion.span>
    </motion.section>
  )
}