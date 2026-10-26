import { useEffect, useRef } from 'react'

/**
 * 那一束跟着鼠标的暖光。
 * 全程只写 CSS 变量，不触发 React 重渲染；
 * 用 lerp 逼近指针，制造手电筒的迟滞手感。
 */
export default function LightCursor() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let targetX = window.innerWidth * 0.5
    let targetY = window.innerHeight * 0.55
    let x = targetX
    let y = targetY
    let idleSince = performance.now()
    let everMoved = false
    let raf = 0

    const onPointer = (event: PointerEvent) => {
      targetX = event.clientX
      targetY = event.clientY
      idleSince = performance.now()
      everMoved = true
    }

    const tick = (now: number) => {
      // 一直没人动：让光自己在桌上慢慢游移，像有人在别处呼吸
      if (!everMoved && now - idleSince > 1800 && !reduce) {
        const t = now / 11000
        targetX = window.innerWidth * (0.5 + 0.2 * Math.sin(t))
        targetY = window.innerHeight * (0.55 + 0.15 * Math.cos(t * 0.8))
      }
      const k = reduce ? 0.4 : 0.08
      x += (targetX - x) * k
      y += (targetY - y) * k
      el.style.setProperty('--mx', `${x.toFixed(1)}px`)
      el.style.setProperty('--my', `${y.toFixed(1)}px`)
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    window.addEventListener('pointermove', onPointer, { passive: true })
    window.addEventListener('pointerdown', onPointer, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('pointerdown', onPointer)
    }
  }, [])

  return <div ref={ref} className="light-cursor" aria-hidden="true" />
}