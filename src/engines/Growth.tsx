import { useEffect, useRef, useState } from 'react'
import { numParam, strParam } from '../lib/params'
import type { EngineProps } from './index'

/**
 * 成长：年轮的光。
 * 一圈一圈从中心往外长，长出来的不会退回去，就像年轮。
 * 时间自己在推它，你动一动会快一些。进度 = 长满了几圈。
 */
export default function Growth({ theme, onProgress, disabled = false }: EngineProps) {
  const progressRef = useRef(onProgress)
  const disabledRef = useRef(disabled)
  const [grown, setGrown] = useState(0)
  const [touched, setTouched] = useState(false)

  const rings = Math.max(1, Math.round(numParam(theme.params.rings, 6)))
  const rampMs = numParam(theme.params.rampMs, 14000)
  const hint = strParam(theme.params.hint, '待一会儿，看它一圈圈长出来')
  const accent = theme.accent

  useEffect(() => {
    progressRef.current = onProgress
  }, [onProgress])

  useEffect(() => {
    disabledRef.current = disabled
  }, [disabled])

  useEffect(() => {
    let boost = 0
    let value = 0
    let last = performance.now()

    const nudge = (amount: number) => {
      setTouched(true)
      boost += amount
    }
    const onMove = () => nudge(0.016)
    const onDown = () => nudge(0.04)

    const timer = window.setInterval(() => {
      const now = performance.now()
      const elapsed = now - last
      last = now
      if (disabledRef.current) return

      value = Math.min(1, value + elapsed / Math.max(1, rampMs) + boost * 0.1)
      boost *= 0.8
      setGrown(value)
      if (value >= 1) {
        window.clearInterval(timer)
        progressRef.current(1)
      } else {
        progressRef.current(Math.min(value, 0.999))
      }
    }, 120)

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerdown', onDown)
    return () => {
      window.clearInterval(timer)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [rampMs])

  return (
    <>
      <div className="growth__rings" aria-hidden="true">
        <svg viewBox="0 0 240 240" preserveAspectRatio="xMidYMid meet">
          <circle cx="120" cy="120" r="6" fill={accent} opacity={Math.min(1, grown * 6) * 0.55} />
          {Array.from({ length: rings }, (_, i) => i).map((i) => {
            const start = i / rings
            const local = Math.max(0, Math.min(1, (grown - start) / (0.7 / rings)))
            if (local <= 0) return null
            const targetR = 24 + i * 16
            return (
              <circle
                key={i}
                cx="120"
                cy="120"
                r={targetR * (0.28 + 0.72 * local)}
                fill="none"
                stroke={accent}
                strokeWidth={1}
                opacity={local * Math.max(0.1, 0.44 - i * 0.045)}
              />
            )
          })}
        </svg>
      </div>
      {!touched && <p className="engine__hint">{hint}</p>}
    </>
  )
}