import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { strParam } from '../lib/params'
import { typograph } from '../lib/typography'
import type { EngineProps } from './index'

interface Palette {
  wash: string
  glow: string
  ink: string
}

interface ChoiceItem {
  id: string
  text: string
  source: string
  palette: Palette
}

const DEFAULT_PALETTE: Palette = {
  wash: 'rgba(217, 143, 95, 0.14)',
  glow: '#e0a878',
  ink: '#f2e2d2',
}

function readPalette(value: unknown): Palette {
  if (!value || typeof value !== 'object') return DEFAULT_PALETTE
  const raw = value as Record<string, unknown>
  return {
    wash: typeof raw.wash === 'string' ? raw.wash : DEFAULT_PALETTE.wash,
    glow: typeof raw.glow === 'string' ? raw.glow : DEFAULT_PALETTE.glow,
    ink: typeof raw.ink === 'string' ? raw.ink : DEFAULT_PALETTE.ink,
  }
}

/** 题材数据是配置，读不到就退回空列表，界面不崩 */
function readChoices(params: Record<string, unknown>): ChoiceItem[] {
  const raw = params.choices
  if (!Array.isArray(raw)) return []
  const out: ChoiceItem[] = []
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue
    const r = item as Record<string, unknown>
    if (typeof r.id !== 'string' || typeof r.text !== 'string') continue
    out.push({
      id: r.id,
      text: r.text,
      source: typeof r.source === 'string' ? r.source : '',
      palette: readPalette(r.palette),
    })
  }
  return out
}

/**
 * 电影：放映机的光。
 * 每翻一句台词，整页的色调就朝那句的光挪一点。
 * 进度 = 翻过的句子占比，翻完才算这一页准备好。
 */
export default function Choice({ theme, onProgress, disabled = false }: EngineProps) {
  const choices = useMemo(() => readChoices(theme.params), [theme.params])
  const hint = strParam(theme.params.hint, '把每句都翻一遍，看光怎么变')
  const [explored, setExplored] = useState<string[]>([])
  const [active, setActive] = useState<ChoiceItem | null>(null)
  const progressRef = useRef(onProgress)

  useEffect(() => {
    progressRef.current = onProgress
  }, [onProgress])

  useEffect(() => {
    if (choices.length === 0) {
      progressRef.current(1)
      return
    }
    if (explored.length >= choices.length) progressRef.current(1)
    else progressRef.current(Math.min(explored.length / choices.length, 0.999))
  }, [explored, choices])

  const pick = (item: ChoiceItem) => {
    if (disabled) return
    setActive(item)
    setExplored((prev) => (prev.includes(item.id) ? prev : [...prev, item.id]))
  }

  const panelStyle: CSSProperties & Record<string, string> = {}
  if (active) panelStyle['--choice-glow'] = active.palette.glow

  return (
    <>
      <div
        className="choice__wash"
        aria-hidden="true"
        style={{ background: active ? active.palette.wash : 'transparent' }}
      />
      <div className="choice__panel" style={panelStyle}>
        <p className="engine__hint">{hint}</p>
        <ul className="choice__list">
          {choices.map((item) => {
            const seen = explored.includes(item.id)
            const isActive = active?.id === item.id
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={`choice__card${seen ? ' is-explored' : ''}${isActive ? ' is-active' : ''}`}
                  onClick={() => pick(item)}
                  disabled={disabled}
                >
                  <span className="choice__text">{typograph(item.text)}</span>
                  {item.source !== '' && (
                    <span className="choice__source">{typograph(item.source)}</span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}