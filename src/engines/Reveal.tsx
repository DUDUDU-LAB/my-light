import { useEffect, useRef, useState } from 'react'
import { numParam, strParam } from '../lib/params'
import type { EngineProps } from './index'

const PROBE_W = 48
const PROBE_H = 32

/**
 * 恐惧：缝隙里的光。
 * 一层雾盖住日记正文，指针经过的地方被擦开。
 * 进度 = 被擦掉的比例，擦到 readyAt 就认为这一页准备好了。
 */
export default function Reveal({ theme, onProgress, disabled = false }: EngineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const progressRef = useRef(onProgress)
  const [done, setDone] = useState(false)
  const [touched, setTouched] = useState(false)
  const disabledRef = useRef(disabled)

  const readyAt = numParam(theme.params.readyAt, 0.9)
  const brush = numParam(theme.params.brushRadius, 140)
  const hint = strParam(theme.params.hint, '把雾推开')

  useEffect(() => {
    progressRef.current = onProgress
  }, [onProgress])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const probe = document.createElement('canvas')
    probe.width = PROBE_W
    probe.height = PROBE_H
    const pctx = probe.getContext('2d')
    if (!pctx) return

    let dpr = 1
    let w = 0
    let h = 0
    let finished = false
    let last: { x: number; y: number } | null = null
    let hasErased = false

    const paintFog = () => {
      ctx.globalCompositeOperation = 'source-over'
      ctx.clearRect(0, 0, w, h)
      const grad = ctx.createLinearGradient(0, 0, w, h)
      grad.addColorStop(0, 'rgba(36, 32, 40, 0.93)')
      grad.addColorStop(0.5, 'rgba(25, 22, 29, 0.90)')
      grad.addColorStop(1, 'rgba(40, 35, 44, 0.93)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)
      // 絮状纹理：让雾不是一整块平整的色块，而且是偏冷的灰紫，好在暖底色上被看出来
      for (let i = 0; i < 90; i += 1) {
        const x = Math.random() * w
        const y = Math.random() * h
        const r = (40 + Math.random() * 120) * dpr
        const rg = ctx.createRadialGradient(x, y, 0, x, y, r)
        rg.addColorStop(0, 'rgba(118, 112, 132, 0.13)')
        rg.addColorStop(1, 'rgba(118, 112, 132, 0)')
        ctx.fillStyle = rg
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const nextDpr = Math.min(window.devicePixelRatio || 1, 2)
      const nextW = Math.max(1, Math.floor(rect.width * nextDpr))
      const nextH = Math.max(1, Math.floor(rect.height * nextDpr))
      if (nextW === w && nextH === h) return

      // 已经擦出痕迹时缩放保留，而不是重画。
      // 字体加载会让正文重排，直接重画会把用户刚擦开的雾整块还回来。
      let keep: HTMLCanvasElement | null = null
      if (w > 0 && h > 0 && hasErased) {
        keep = document.createElement('canvas')
        keep.width = w
        keep.height = h
        keep.getContext('2d')?.drawImage(canvas, 0, 0)
      }

      dpr = nextDpr
      w = nextW
      h = nextH
      canvas.width = w
      canvas.height = h

      if (keep) {
        ctx.globalCompositeOperation = 'source-over'
        ctx.drawImage(keep, 0, 0, w, h)
      } else if (!finished) {
        paintFog()
      }
    }

    const eraseAt = (px: number, py: number, strength: number) => {
      const radius = brush * dpr
      ctx.globalCompositeOperation = 'destination-out'
      const g = ctx.createRadialGradient(px, py, 0, px, py, radius)
      g.addColorStop(0, `rgba(0,0,0,${strength})`)
      g.addColorStop(0.55, `rgba(0,0,0,${strength * 0.7})`)
      g.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(px, py, radius, 0, Math.PI * 2)
      ctx.fill()
    }

    // 指针移动快时会跳点，沿路径补插，避免出现断裂的光路
    const stroke = (from: { x: number; y: number }, to: { x: number; y: number }) => {
      const radius = brush * dpr
      const dist = Math.hypot(to.x - from.x, to.y - from.y)
      const steps = Math.max(1, Math.ceil(dist / Math.max(8, radius * 0.35)))
      for (let i = 1; i <= steps; i += 1) {
        const t = i / steps
        eraseAt(from.x + (to.x - from.x) * t, from.y + (to.y - from.y) * t, 1)
      }
    }

    const measure = () => {
      if (finished) return
      if (w === 0 || h === 0) return
      pctx.clearRect(0, 0, PROBE_W, PROBE_H)
      pctx.drawImage(canvas, 0, 0, PROBE_W, PROBE_H)
      const data = pctx.getImageData(0, 0, PROBE_W, PROBE_H).data
      let cleared = 0
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] < 40) cleared += 1
      }
      const ratio = cleared / (PROBE_W * PROBE_H)
      if (ratio >= readyAt) {
        finished = true
        progressRef.current(1)
        setDone(true)
      } else {
        progressRef.current(Math.min(ratio / readyAt, 0.999))
      }
    }

    const onMove = (event: PointerEvent) => {
      if (disabledRef.current || finished) return
      setTouched(true)
      hasErased = true
      const rect = canvas.getBoundingClientRect()
      const point = {
        x: (event.clientX - rect.left) * dpr,
        y: (event.clientY - rect.top) * dpr,
      }
      if (last) stroke(last, point)
      else eraseAt(point.x, point.y, 1)
      last = point
    }

    const onLeave = () => {
      last = null
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    const timer = window.setInterval(measure, 180)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerleave', onLeave)

    return () => {
      observer.disconnect()
      window.clearInterval(timer)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerleave', onLeave)
    }
  }, [theme.id, readyAt, brush])

  useEffect(() => {
    disabledRef.current = disabled
  }, [disabled])

  return (
    <>
      <canvas
        ref={canvasRef}
        className={`reveal__fog${done ? ' reveal__fog--gone' : ''}`}
        aria-hidden="true"
        style={{ pointerEvents: disabled || done ? 'none' : 'auto' }}
      />
      {!touched && !done && <p className="engine__hint">{hint}</p>}
    </>
  )
}