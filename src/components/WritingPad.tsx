import { useState } from 'react'
import { moodLabel, moodOptionsOf } from '../data/moods'
import type { Theme } from '../data/types'

interface Props {
  theme: Theme
  unlocked: boolean
  onSubmit: (text: string, mood: string | null) => void
}

export default function WritingPad({ theme, unlocked, onSubmit }: Props) {
  const [text, setText] = useState('')
  const [mood, setMood] = useState<string | null>(null)
  const options = moodOptionsOf(theme.quotes)
  const canSubmit = unlocked && text.trim().length > 0

  if (!unlocked) {
    return (
      <div className="pad pad--locked">
        <p className="pad__locked">先让光落下来，再写字。</p>
      </div>
    )
  }

  return (
    <form
      className="pad"
      onSubmit={(event) => {
        event.preventDefault()
        if (!canSubmit) return
        onSubmit(text.trim(), mood)
        setText('')
        setMood(null)
      }}
    >
      <textarea
        className="pad__input"
        value={text}
        rows={5}
        placeholder="写点什么，不用给谁看。"
        onChange={(event) => setText(event.target.value)}
      />
      {options.length > 0 && (
        <div className="pad__moods">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              className={`pad__mood${mood === option ? ' is-on' : ''}`}
              onClick={() => setMood(mood === option ? null : option)}
            >
              {moodLabel(option)}
            </button>
          ))}
        </div>
      )}
      <div className="pad__foot">
        <span className="pad__count">{text.trim().length} 字</span>
        <button type="submit" className="pad__submit" disabled={!canSubmit}>
          留在这一页
        </button>
      </div>
    </form>
  )
}