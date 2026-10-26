import type { Theme } from '../data/types'
import { typograph } from '../lib/typography'

interface Props {
  theme: Theme
  /** 0..1，由引擎驱动。每行按自己的阈值连续浮现，而不是一刀切开 */
  reveal: number
}

export default function DiarySheet({ theme, reveal }: Props) {
  const lines = theme.diary.lines
  const step = lines.length > 0 ? 1 / lines.length : 1

  return (
    <article className="diary">
      <header className="diary__head">
        <span className="diary__date">{typograph(theme.diary.date)}</span>
        <span className="diary__weather">{typograph(theme.diary.weather)}</span>
      </header>
      <div className="diary__lines">
        {lines.map((line, i) => {
          const threshold = i * step * 0.85
          const local = Math.min(1, Math.max(0, (reveal - threshold) / Math.max(0.001, step * 0.9)))
          return (
            <p
              key={`${theme.id}-${i}`}
              className="diary__line"
              style={{ opacity: local, filter: `blur(${(1 - local) * 5}px)` }}
            >
              {typograph(line)}
            </p>
          )
        })}
      </div>
    </article>
  )
}