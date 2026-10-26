import { useEffect, useRef, useState } from 'react'
import { numParam, strParam } from '../lib/params'
import type { EngineProps } from './index'

/** 夜与晨两端，中间靠拖拽插值 */
const NIGHT = { skyTop: '#141b2b', skyBot: '#2b3040', sun: '#8fa8c8', far: '#1b2231', near: '#12161f' }
const DAWN = { skyTop: '#3c2a2a', skyBot: '#8f5f3c', sun: '#ffd89b', far: '#4c3829', near: '#2b1f18' }

function parseHex(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [0, 2, 4].map((i) => Number.parseInt(h.slice(i, i + 2), 16)) as [number, number, number]
}

function mix(a: string, b: string, t: number): string {
  const A = parseHex(a)
  const B = parseHex(b)
  const r = Math.round(A[0] + (B[0] - A[0]) * t)
  const g = Math.round(A[1] + (B[1] - A[1]) * t)
  const bl = Math.round(A[2] + (B[2] - A[2]) * t)
  return `rgb(${r}, ${g}, ${bl})`
}

/**
 * 风景：地平线的光。
 * 按住横向漫游，天光从夜慢慢挪到晨；远山近山走不同的速度，画面就有纵深。
 * 进度 = 走过的最远距离。
 */
export default function Pan({ theme, onProgress, disabled = false }: EngineProps) {
  const viewRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef(onProgress)
  const disabledRef = useRef(disabled)
  const [touched, setTouched] = useState(false)

  const maxPan = numParam(theme.params.maxPan, 420)
  const hint = strParam(theme.params.hint, '按住，往一边慢慢走')

  useEffect(() => {
    progressRef.current = onProgress
  }, [onProgress])

  useEffect(() => {
    disabledRef.current = disabled
  }, [disabled])

  useEffect(() => {
    const el = viewRef.current
    if (!el) return

    let offset = 0
    let furthest = 0
    let startX = 0
    let dragging = false
    let finished = false

    const render = (p: number, shift: number) => {
      el.style.setProperty('--pan-sky-top', mix(NIGHT.skyTop, DAWN.skyTop, p))
      el.style.setProperty('--pan-sky-bot', mix(NIGHT.skyBot, DAWN.skyBot, p))
      el.style.setProperty('--pan-sun', mix(NIGHT.sun, DAWN.sun, p))
      el.style.setProperty('--pan-far', mix(NIGHT.far, DAWN.far, p))
      el.style.setProperty('--pan-near', mix(NIGHT.near, DAWN.near, p))
      el.style.setProperty('--pan-shift', `${shift.toFixed(1)}px`)
      el.style.setProperty('--pan', p.toFixed(4))
    }

    const report = () => {
      if (finished) return
      const ratio = Math.min(1, furthest / Math.max(80, maxPan))
      if (ratio >= 1) {
        finished = true
        progressRef.current(1)
      } else {
        progressRef.current(Math.min(ratio, 0.999))
      }
    }

    render(0, 0)

    const onDown = (event: PointerEvent) => {
      if (disabledRef.current || finished) return
      setTouched(true)
      dragging = true
      startX = event.clientX
      el.setPointerCapture(event.pointerId)
    }

    const onMove = (event: PointerEvent) => {
      if (disabledRef.current || !dragging) return
      offset = event.clientX - startX
      const clamped = Math.max(-maxPan * 1.6, Math.min(maxPan * 1.6, offset))
      furthest = Math.max(furthest, Math.abs(clamped))
      const p = Math.min(1, furthest / Math.max(80, maxPan))
      render(p * p * (3 - 2 * p), clamped)
      report()
    }

    const onUp = () => {
      dragging = false
    }

    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)
    return () => {
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
    }
  }, [maxPan])

  return (
    <>
      <div ref={viewRef} className="pan__view" aria-hidden="true">
        <div className="pan__sky" />
        <div className="pan__sun" />
        <div className="pan__hills pan__hills--far" />
        <div className="pan__hills pan__hills--near" />
      </div>
      {!touched && <p className="engine__hint">{hint}</p>}
    </>
  )
}