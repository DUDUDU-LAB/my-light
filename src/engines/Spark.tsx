import { useEffect, useRef, useState } from 'react'
import { numParam, strParam } from '../lib/params'
import type { EngineProps } from './index'

function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) return [229, 193, 104]
  const n = Number.parseInt(m[1], 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

interface SparkPoint {
  x: number
  y: number
  t: number
  seed: number
}

/**
 * 爱好：跳跃的光。
 * 随手一点，就留下一个会闪的光点；点得越多，这一页越亮。
 * 进度 = 点亮的个数。这件事没有任何用处，它的用处就是好玩。
 */
export default function Spark({ theme, onProgress, disabled = false }: EngineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const progressRef = useRef(onProgress)
  const disabledRef = useRef(disabled)
  const [touched, setTouched] = useState(false)

  const target = Math.max(1, Math.round(numParam(theme.params.sparks, 6)))
  const hint = strParam(theme.params.hint, '随手点几下，看它亮起来')
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
    let dpr = 1
    let w = 0
    let h = 0
    let raf = 0
    let placed = 0
    let points: SparkPoint[] = []

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
      ctx.globalCompositeOperation = 'lighter'
      for (const p of points) {
        const pulse = 0.55 + 0.45 * Math.sin(now / 620 + p.seed)
        // rAF 的时间戳是这一帧开始的时刻，可能早于刚发生的点击，
        // 所以这里必须夹住下界，否则半径为负，createRadialGradient 会直接抛错
        const grow = Math.max(0, Math.min(1, (now - p.t) / 420))
        const radius = 30 * dpr * grow * (0.85 + 0.3 * pulse)
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius)
        g.addColorStop(0, `rgba(255, 246, 224, ${0.62 * pulse})`)
        g.addColorStop(0.28, `rgba(${cr},${cg},${cb},${0.34 * pulse})`)
        g.addColorStop(1, `rgba(${cr},${cg},${cb},0)`)
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
        ctx.fill()

        // 四点星芒：光是"闪"出来的，不是糊上去的
        const arm = radius * 0.72
        ctx.strokeStyle = `rgba(255, 248, 230, ${0.36 * pulse * grow})`
        ctx.lineWidth = 1.1 * dpr
        ctx.beginPath()
        ctx.moveTo(p.x - arm, p.y)
        ctx.lineTo(p.x + arm, p.y)
        ctx.moveTo(p.x, p.y - arm)
        ctx.lineTo(p.x, p.y + arm)
        ctx.stroke()
      }
      ctx.globalCompositeOperation = 'source-over'
      raf = requestAnimationFrame(frame)
    }

    const onDown = (event: PointerEvent) => {
      if (disabledRef.current) return
      setTouched(true)
      const rect = canvas.getBoundingClientRect()
      points.push({
        x: (event.clientX - rect.left) * dpr,
        y: (event.clientY - rect.top) * dpr,
        t: performance.now(),
        seed: Math.random() * Math.PI * 2,
      })
      if (points.length > 40) points = points.slice(-40)

      placed += 1
      if (placed >= target) progressRef.current(1)
      else progressRef.current(Math.min(placed / target, 0.999))
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    canvas.addEventListener('pointerdown', onDown)
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      canvas.removeEventListener('pointerdown', onDown)
    }
  }, [accent, target])

  return (
    <>
      <canvas ref={canvasRef} className="spark__canvas" aria-hidden="true" />
      {!touched && <p className="engine__hint">{hint}</p>}
    </>
  )
}