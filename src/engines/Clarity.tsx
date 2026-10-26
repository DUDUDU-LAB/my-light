import { useEffect, useRef, useState } from 'react'
import { numParam, strParam } from '../lib/params'
import type { EngineProps } from './index'

/**
 * 反思：水面的光。
 * 一层"水面"盖在日记上（backdrop-filter 糊掉底下的字）。
 * 指针反复掠过水面，波光慢慢平下去，字才逐渐清晰。
 * 进度 = 走过的距离，所以"看清"这件事必须动手。
 */
export default function Clarity({ theme, onProgress, disabled = false }: EngineProps) {
  const layerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef(onProgress)
  const disabledRef = useRef(disabled)
  const [touched, setTouched] = useState(false)

  const travel = numParam(theme.params.travel, 2600)
  const maxBlur = numParam(theme.params.maxBlur, 14)
  const hint = strParam(theme.params.hint, '慢慢掠过水面，让它静下来')

  useEffect(() => {
    progressRef.current = onProgress
  }, [onProgress])

  useEffect(() => {
    disabledRef.current = disabled
  }, [disabled])

  useEffect(() => {
    const el = layerRef.current
    if (!el) return

    let moved = 0
    let last: { x: number; y: number } | null = null
    let done = false

    // 直接写 DOM：指针每动一下都触发 React 重渲染太浪费
    const apply = (settled: number) => {
      const blur = (1 - settled) * maxBlur
      el.style.backdropFilter = `blur(${blur.toFixed(2)}px)`
      el.style.setProperty('-webkit-backdrop-filter', `blur(${blur.toFixed(2)}px)`)
      el.style.setProperty('--settle', settled.toFixed(4))
    }

    const onMove = (event: PointerEvent) => {
      if (disabledRef.current || done) return
      setTouched(true)
      const point = { x: event.clientX, y: event.clientY }
      if (last) moved += Math.hypot(point.x - last.x, point.y - last.y)
      last = point

      const ratio = Math.min(1, moved / travel)
      const settled = ratio * ratio * (3 - 2 * ratio)
      apply(settled)
      if (ratio >= 1) {
        done = true
        progressRef.current(1)
      } else {
        progressRef.current(Math.min(ratio, 0.999))
      }
    }

    const onLeave = () => {
      last = null
    }

    apply(0)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [travel, maxBlur])

  return (
    <>
      <div ref={layerRef} className="clarity__water" aria-hidden="true">
        <div className="clarity__ripple" />
        <div className="clarity__sheen" />
      </div>
      {!touched && <p className="engine__hint">{hint}</p>}
    </>
  )
}