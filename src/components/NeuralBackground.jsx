import { useEffect, useRef } from 'react'
import { flags } from '../debug'

// A soft "neural network" behind the page: drifting nodes, edges between neighbours (thicker edge =
// heavier weight) and gold pulses travelling along edges like signals. Every node has a depth, and
// scrolling moves deeper nodes further, so the net shifts in parallax as you scroll.
// Plain 2D canvas: ~100 nodes means a few thousand distance checks per frame, cheap on any device.

const GOLD = '120, 86, 24' // the page's gold accent as rgb, for canvas rgba() strings
const LINK_DIST = 150 // px: nodes closer than this get an edge
const DRIFT = 0.18 // px per frame of idle movement
const PARALLAX = 0.12 // how far the deepest nodes move per scrolled pixel
const MAX_PULSES = 8

export default function NeuralBackground() {
  const ref = useRef(null)

  useEffect(() => {
    if (flags.nonet) return undefined
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let nodes = []
    let pulses = []
    let raf = 0
    let w = 0
    let h = 0
    let lastScroll = window.scrollY
    let scrollBoost = 0

    // (Re)build the node field for the current viewport size.
    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.min(w < 768 ? 45 : 110, Math.round((w * h) / 16000))
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * DRIFT,
        vy: (Math.random() - 0.5) * DRIFT,
        r: 1.2 + Math.random() * 1.8,
        depth: 0.35 + Math.random() * 0.65, // deeper = moves more with scroll, drawn stronger
        weight: 0.4 + Math.random() * 1.1, // edge thickness hint
      }))
      pulses = []
    }

    // Where a node appears on screen once scroll parallax is applied (wrapped so nodes recycle).
    const screenPos = (n) => {
      const sy = window.scrollY
      const y = n.y - sy * PARALLAX * n.depth
      const x = n.x + Math.sin(sy * 0.002 + n.depth * 6) * 8 * n.depth
      return { x, y: ((y % h) + h) % h }
    }

    const frame = () => {
      // Fast scrolling briefly speeds everything up, then it settles.
      const sy = window.scrollY
      scrollBoost = Math.min(3, scrollBoost * 0.9 + Math.abs(sy - lastScroll) * 0.01)
      lastScroll = sy
      const speed = 1 + scrollBoost

      ctx.clearRect(0, 0, w, h)

      for (const n of nodes) {
        n.x += n.vx * speed
        n.y += n.vy * speed
        if (n.x < -20) n.x = w + 20
        else if (n.x > w + 20) n.x = -20
        if (n.y < -20) n.y = h + 20
        else if (n.y > h + 20) n.y = -20
      }
      const pts = nodes.map((n) => ({ n, ...screenPos(n) }))

      // Edges between neighbours; opacity fades with distance, width follows the lighter "weight".
      const edges = []
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y)
          if (d >= LINK_DIST) continue
          ctx.strokeStyle = `rgba(${GOLD}, ${(1 - d / LINK_DIST) * 0.26})`
          ctx.lineWidth = Math.min(pts[i].n.weight, pts[j].n.weight)
          ctx.beginPath()
          ctx.moveTo(pts[i].x, pts[i].y)
          ctx.lineTo(pts[j].x, pts[j].y)
          ctx.stroke()
          edges.push([pts[i].n, pts[j].n])
        }
      }

      for (const p of pts) {
        ctx.fillStyle = `rgba(${GOLD}, ${0.2 + p.n.depth * 0.3})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.n.r, 0, Math.PI * 2)
        ctx.fill()
      }

      // Pulses: a bright dot that travels from one node to the other along an existing edge.
      if (edges.length && pulses.length < MAX_PULSES && Math.random() < 0.08 * speed) {
        const [a, b] = edges[Math.floor(Math.random() * edges.length)]
        pulses.push({ a, b, t: 0 })
      }
      pulses = pulses.filter((p) => p.t < 1)
      for (const p of pulses) {
        p.t += 0.012 * speed
        const a = screenPos(p.a)
        const b = screenPos(p.b)
        if (Math.abs(a.y - b.y) > LINK_DIST) continue // endpoints wrapped to opposite edges; skip this frame
        ctx.fillStyle = `rgba(${GOLD}, ${0.9 * Math.sin(Math.PI * p.t)})`
        ctx.beginPath()
        ctx.arc(a.x + (b.x - a.x) * p.t, a.y + (b.y - a.y) * p.t, 2.2, 0, Math.PI * 2)
        ctx.fill()
      }

      if (!reduced) raf = requestAnimationFrame(frame)
    }

    // Don't burn battery while the tab is hidden.
    const onVisibility = () => {
      cancelAnimationFrame(raf)
      if (!document.hidden) raf = requestAnimationFrame(frame)
    }

    build()
    raf = requestAnimationFrame(frame)
    window.addEventListener('resize', build)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', build)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  if (flags.nonet) return null
  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-0 max-md:opacity-60" aria-hidden />
}
