import { useEffect, useRef, useState } from 'react'
import { numParam, strParam } from '../lib/params'
import type { EngineProps } from './index'

function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) return [224, 138, 74]
  const n = Number.parseInt(m[1], 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

interface Point {
  x: number
  y: number
  t: number
}

/**
 * 运动：流动的光。
 * 按住拖拽画出一条会发光的轨迹，松手之后余晖慢慢退掉。
 * 进度 = 画过的总长度，所以"动起来"这件事本身就是进度。
 */
export default function Trail({ theme, onProgress, disabled = false }: EngineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const progressRef = useRef(onProgress)
  const disabledRef = useRef(disabled)
  const [touched, setTouched] = useState(false)

  const target = numParam(theme.params.travel, 3200)
  const hint = strParam(theme.params.hint, '按住，拖出一条光')
  const accent = theme.accent

  useEffect(() => {
    progressRef.current = onProgress
  }, [onProgress])

  useEffect(() => {
    disabledRef.current = disabled
  }, [disabled])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const [cr, cg, cb] = hexToRgb(accent)
    const LIFE = 2200

    let dpr = 1
    let w = 0
    let h = 0
    let raf = 0
    let drawn = 0
    let finished = false
    let pressing = false
    let cursor: { x: number; y: number } | null = null
    let trail: Point[] = []

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = Math.max(1, Math.floor(rect.width * dpr))
      h = Math.max(1, Math.floor(rect.height * dpr))
      canvas.width = w
      canvas.height = h
    }

    const frame = (now: number) => {
      ctx.clearRect(0, 0, w, h)
      trail = trail.filter((p) => now - p.t < LIFE)

      ctx.globalCompositeOperation = 'lighter'
      ctx.lineCap = 'round'
      for (let i = 1; i < trail.length; i += 1) {
        const a = trail[i - 1]
        const b = trail[i]
        const age = Math.max(0, (now - b.t) / LIFE)
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${(1 - age) * 0.55})`
        ctx.lineWidth = Math.max(1, 8 * dpr * (1 - age))
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }

      if (cursor) {
        const g = ctx.createRadialGradient(cursor.x, cursor.y, 0, cursor.x, cursor.y, 48 * dpr)
        g.addColorStop(0, `rgba(255, 240, 214, ${pressing ? 0.5 : 0.22})`)
        g.addColorStop(1, `rgba(${cr},${cg},${cb},0)`)
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(cursor.x, cursor.y, 48 * dpr, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalCompositeOperation = 'source-over'

      raf = requestAnimationFrame(frame)
    }

    const push = (x: number, y: number) => {
      const prev = trail[trail.length - 1]
      if (prev) drawn += Math.hypot(x - prev.x, y - prev.y)
      trail.push({ x, y, t: performance.now() })
      if (finished) return
      const ratio = Math.min(1, drawn / Math.max(200, target * dpr))
      if (ratio >= 1) {
        finished = true
        progressRef.current(1)
      } else {
        progressRef.current(Math.min(ratio, 0.999))
      }
    }

    const local = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      return { x: (event.clientX - rect.left) * dpr, y: (event.clientY - rect.top) * dpr }
    }

    const onDown = (event: PointerEvent) => {
      if (disabledRef.current || finished) return
      setTouched(true)
      pressing = true
      canvas.setPointerCapture(event.pointerId)
      const p = local(event)
      cursor = p
      trail.push({ x: p.x, y: p.y, t: performance.now() })
    }

    const onMove = (event: PointerEvent) => {
      if (disabledRef.current) return
      const p = local(event)
      cursor = p
      if (pressing && !finished) push(p.x, p.y)
    }

    const onUp = () => {
      pressing = false
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onUp)
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
    }
  }, [accent, target])

  return (
    <>
      <canvas ref={canvasRef} className="trail__canvas" aria-hidden="true" />
      {!touched && <p className="engine__hint">{hint}</p>}
    </>
  )
}