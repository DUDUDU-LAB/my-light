import { useEffect, useMemo, useRef, useState } from 'react'
import { strParam } from '../lib/params'
import { typograph } from '../lib/typography'
import type { EngineProps } from './index'

interface CardItem {
  id: string
  front: string
  back: string
  source: string
}

/** 题材数据是配置，读不到就退回空列表，界面不崩 */
function readCards(params: Record<string, unknown>): CardItem[] {
  const raw = params.cards
  if (!Array.isArray(raw)) return []
  const out: CardItem[] = []
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue
    const r = item as Record<string, unknown>
    if (typeof r.id !== 'string' || typeof r.back !== 'string') continue
    out.push({
      id: r.id,
      front: typeof r.front === 'string' ? r.front : '翻过来看看',
      back: r.back,
      source: typeof r.source === 'string' ? r.source : '',
    })
  }
  return out
}

/**
 * 书籍：字里行间的光。
 * 每张卡片正面只写着半句话，翻过去才看得到完整的那一句。
 * 进度 = 翻开过的页数。
 */
export default function Cards({ theme, onProgress, disabled = false }: EngineProps) {
  const cards = useMemo(() => readCards(theme.params), [theme.params])
  const hint = strParam(theme.params.hint, '把每一页都翻过去')
  const [flipped, setFlipped] = useState<string[]>([])
  const progressRef = useRef(onProgress)

  useEffect(() => {
    progressRef.current = onProgress
  }, [onProgress])

  useEffect(() => {
    if (cards.length === 0) {
      progressRef.current(1)
      return
    }
    if (flipped.length >= cards.length) progressRef.current(1)
    else progressRef.current(Math.min(flipped.length / cards.length, 0.999))
  }, [flipped, cards])

  const flip = (id: string) => {
    if (disabled) return
    setFlipped((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }

  return (
    <div className="cards__panel">
      <p className="engine__hint">{hint}</p>
      <ul className="cards__list">
        {cards.map((card, i) => {
          const isFlipped = flipped.includes(card.id)
          return (
            <li key={card.id} className={`bookcard${isFlipped ? ' is-flipped' : ''}`}>
              <button
                type="button"
                className="bookcard__inner"
                onClick={() => flip(card.id)}
                disabled={disabled}
                aria-pressed={isFlipped}
              >
                <span className="bookcard__face bookcard__face--front">
                  <span className="bookcard__index" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className="bookcard__front">{typograph(card.front)}</span>
                </span>
                <span className="bookcard__face bookcard__face--back">
                  <span className="bookcard__back">{typograph(card.back)}</span>
                  {card.source !== '' && (
                    <span className="bookcard__source">{typograph(card.source)}</span>
                  )}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}