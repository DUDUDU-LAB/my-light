import { useEffect, useRef, useState } from 'react'
import { numParam, strParam } from '../lib/params'
import type { EngineProps } from './index'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  a: number
}

interface Ripple {
  x: number
  y: number
  r: number
  a: number
}

function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) return [232, 176, 106]
  const n = Number.parseInt(m[1], 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/**
 * 治愈：呼吸的光。
 * 粒子缓慢漂浮，光圈按接近舒缓呼吸的节奏涨缩。
 * 进度按时间爬升，不是"完成任务"，而是"在这里待够一会儿"。
 */
export default function Particles({ theme, onProgress, disabled = false }: EngineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const progressRef = useRef(onProgress)
  const disabledRef = useRef(disabled)
  const [touched, setTouched] = useState(false)

  const breathMs = numParam(theme.params.breathMs, 8000)
  const rampMs = numParam(theme.params.rampMs, 12000)
  const count = numParam(theme.params.particleCount, 64)
  const hint = strParam(theme.params.hint, '跟着光圈，慢慢呼吸')
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

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const [cr, cg, cb] = hexToRgb(accent)

    let dpr = 1
    let w = 0
    let h = 0
    let raf = 0
    let last = performance.now()
    let startedAt = performance.now()
    let pausedFor = 0
    let pausedAt: number | null = null
    let finished = false
    let lastRipple = 0
    let particles: Particle[] = []
    const ripples: Ripple[] = []

    // 预渲染一张光点贴图：每帧为每个粒子新建渐变会非常贵
    const sprite = document.createElement('canvas')
    sprite.width = 64
    sprite.height = 64
    const sctx = sprite.getContext('2d')
    if (sctx) {
      const g = sctx.createRadialGradient(32, 32, 0, 32, 32, 32)
      g.addColorStop(0, `rgba(${cr},${cg},${cb},0.9)`)
      g.addColorStop(0.35, `rgba(${cr},${cg},${cb},0.22)`)
      g.addColorStop(1, `rgba(${cr},${cg},${cb},0)`)
      sctx.fillStyle = g
      sctx.fillRect(0, 0, 64, 64)
    }

    const seed = () => {
      particles = []
      for (let i = 0; i < count; i += 1) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.16 * dpr,
          vy: (Math.random() - 0.5) * 0.16 * dpr,
          r: (6 + Math.random() * 22) * dpr,
          a: 0.12 + Math.random() * 0.4,
        })
      }
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = Math.max(1, Math.floor(rect.width * dpr))
      h = Math.max(1, Math.floor(rect.height * dpr))
      canvas.width = w
      canvas.height = h
      seed()
    }
    const frame = (now: number) => {
      const dt = Math.min(32, now - last)
      last = now

      if (disabledRef.current) {
        if (pausedAt === null) pausedAt = now
      } else if (pausedAt !== null) {
        pausedFor += now - pausedAt
        pausedAt = null
      }

      const elapsed = Math.max(0, now - startedAt - pausedFor)
      const phase = (elapsed / breathMs) * Math.PI * 2

      if (!finished && !disabledRef.current) {
        const p = Math.min(elapsed / rampMs, 1)
        progressRef.current(p)
        if (p >= 1) finished = true
      }

      ctx.clearRect(0, 0, w, h)

      // 呼吸光圈
      const base = Math.min(w, h) * 0.46
      const pulse = reduce ? 0 : 0.16 * Math.sin(phase)
      const ringR = base * (1 + pulse)
      const ringA = 0.05 + (reduce ? 0.02 : 0.05 * (0.5 + 0.5 * Math.sin(phase)))
      ctx.save()
      ctx.strokeStyle = `rgba(${cr},${cg},${cb},${ringA})`
      ctx.lineWidth = 1.2 * dpr
      ctx.beginPath()
      ctx.arc(w / 2, h / 2, ringR, 0, Math.PI * 2)
      ctx.stroke()
      ctx.strokeStyle = `rgba(${cr},${cg},${cb},${ringA * 0.5})`
      ctx.beginPath()
      ctx.arc(w / 2, h / 2, ringR * 1.25, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()

      // 漂浮的光点
      ctx.globalCompositeOperation = 'lighter'
      for (const p of particles) {
        if (!reduce) {
          p.x += p.vx * dt * 0.06
          p.y += p.vy * dt * 0.06
        }
        if (p.x < -40) p.x = w + 40
        if (p.x > w + 40) p.x = -40
        if (p.y < -40) p.y = h + 40
        if (p.y > h + 40) p.y = -40
        const size = p.r * 4
        ctx.globalAlpha = Math.max(0, p.a * (0.7 + 0.3 * Math.sin(phase + p.x * 0.01)))
        ctx.drawImage(sprite, p.x - size / 2, p.y - size / 2, size, size)
      }
      ctx.globalAlpha = 1

      // 指针经过留下的涟漪
      for (let i = ripples.length - 1; i >= 0; i -= 1) {
        const rp = ripples[i]
        rp.r += dt * 0.09 * dpr
        rp.a -= dt * 0.0004
        if (rp.a <= 0) {
          ripples.splice(i, 1)
          continue
        }
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${rp.a})`
        ctx.lineWidth = 1 * dpr
        ctx.beginPath()
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.globalCompositeOperation = 'source-over'

      raf = requestAnimationFrame(frame)
    }

    const onMove = (event: PointerEvent) => {
      if (disabledRef.current) return
      setTouched(true)
      const now = performance.now()
      if (now - lastRipple < 130) return
      lastRipple = now
      const rect = canvas.getBoundingClientRect()
      ripples.push({
        x: (event.clientX - rect.left) * dpr,
        y: (event.clientY - rect.top) * dpr,
        r: 6 * dpr,
        a: 0.45,
      })
      if (ripples.length > 14) ripples.shift()
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    canvas.addEventListener('pointermove', onMove)
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      canvas.removeEventListener('pointermove', onMove)
    }
  }, [accent, breathMs, count, rampMs])

  return (
    <>
      <canvas ref={canvasRef} className="particles__field" aria-hidden="true" />
      {!touched && <p className="engine__hint">{hint}</p>}
    </>
  )
}