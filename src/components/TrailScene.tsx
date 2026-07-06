import { useEffect, useRef, useState } from 'react'

/* Deterministic PRNG so the generated landscape is stable between renders. */
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type Pt = { x: number; y: number }

/* Smooth path through points using a Catmull-Rom -> cubic Bezier conversion. */
function smoothPath(points: Pt[], closed = false, tension = 1): string {
  if (points.length < 2) return ''
  const p = points
  const last = p.length - 1
  let d = `M${p[0].x.toFixed(1)},${p[0].y.toFixed(1)}`
  for (let i = 0; i < last; i++) {
    const p0 = p[i - 1] ?? p[i]
    const p1 = p[i]
    const p2 = p[i + 1]
    const p3 = p[i + 2] ?? p2
    const c1x = p1.x + ((p2.x - p0.x) / 6) * tension
    const c1y = p1.y + ((p2.y - p0.y) / 6) * tension
    const c2x = p2.x - ((p3.x - p1.x) / 6) * tension
    const c2y = p2.y - ((p3.y - p1.y) / 6) * tension
    d += `C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`
  }
  if (closed) d += 'Z'
  return d
}

/* Trail waypoints as fractions of the page box. The trail begins at the top-left
   near the hero eyebrow, then meanders left/right while descending the page so it
   weaves across content and ducks behind opaque components. */
const TRAIL_WAYPOINTS: Pt[] = [
  { x: 0.06, y: 0.035 },
  { x: 0.13, y: 0.075 },
  { x: 0.08, y: 0.15 },
  { x: 0.17, y: 0.235 },
  { x: 0.34, y: 0.29 },
  { x: 0.26, y: 0.375 },
  { x: 0.12, y: 0.45 },
  { x: 0.28, y: 0.53 },
  { x: 0.5, y: 0.55 },
  { x: 0.4, y: 0.64 },
  { x: 0.22, y: 0.71 },
  { x: 0.42, y: 0.78 },
  { x: 0.64, y: 0.77 },
  { x: 0.54, y: 0.855 },
  { x: 0.72, y: 0.915 },
  { x: 0.9, y: 0.88 },
  { x: 0.82, y: 0.955 },
  { x: 0.98, y: 0.99 },
]

type Ridge = { d: string; opacity: number }
type Tree = { x: number; y: number; s: number }
type Rock = { x: number; y: number; s: number }
type Scene = {
  w: number
  h: number
  trail: string
  ridges: Ridge[]
  pines: Tree[]
  rocks: Rock[]
  bushes: Rock[]
  grass: Pt[]
}

/* Build a rolling ridgeline that fills from its crest down to the bottom edge. */
function ridge(
  w: number,
  h: number,
  baseY: number,
  amp: number,
  segments: number,
  rng: () => number,
): string {
  const pts: Pt[] = []
  for (let i = 0; i <= segments; i++) {
    const x = (-0.08 + (1.16 * i) / segments) * w
    const y = baseY + (rng() - 0.5) * 2 * amp
    pts.push({ x, y })
  }
  const crest = smoothPath(pts)
  return `${crest} L${(1.08 * w).toFixed(1)},${h.toFixed(1)} L${(-0.08 * w).toFixed(1)},${h.toFixed(1)} Z`
}

function buildScene(w: number, h: number): Scene {
  const rng = mulberry32(20260706)
  const trail = smoothPath(TRAIL_WAYPOINTS.map((p) => ({ x: p.x * w, y: p.y * h })))

  /* Distant, layered ranges spread across the page so the trail weaves over them. */
  const ridges: Ridge[] = [
    { d: ridge(w, h, h * 0.34, h * 0.03, 7, rng), opacity: 0.05 },
    { d: ridge(w, h, h * 0.58, h * 0.045, 8, rng), opacity: 0.06 },
    { d: ridge(w, h, h * 0.75, h * 0.05, 9, rng), opacity: 0.08 },
    { d: ridge(w, h, h * 0.88, h * 0.04, 10, rng), opacity: 0.11 },
  ]

  /* Tree line: denser and taller toward the right, thinning to the left, echoing
     the reference. Sizes are in pixels so they read consistently at any width. */
  const pines: Tree[] = []
  const pineCount = Math.round(Math.min(46, Math.max(20, w / 34)))
  for (let i = 0; i < pineCount; i++) {
    const r = rng()
    const rightBias = Math.pow(rng(), 0.5)
    const x = rightBias * 1.02 * w - 0.01 * w
    const band = 0.62 + rng() * 0.34
    const y = h * band
    const size = (18 + r * 34) * (0.7 + rightBias * 1.05)
    pines.push({ x, y, s: size })
  }
  pines.sort((a, b) => a.y - b.y)

  const rocks: Rock[] = []
  const rockCount = Math.round(Math.min(26, Math.max(10, w / 60)))
  for (let i = 0; i < rockCount; i++) {
    rocks.push({
      x: rng() * w,
      y: h * (0.78 + rng() * 0.2),
      s: 6 + rng() * 12,
    })
  }

  const bushes: Rock[] = []
  const bushCount = Math.round(Math.min(20, Math.max(8, w / 80)))
  for (let i = 0; i < bushCount; i++) {
    bushes.push({
      x: rng() * w,
      y: h * (0.74 + rng() * 0.22),
      s: 5 + rng() * 9,
    })
  }

  const grass: Pt[] = []
  const grassCount = Math.round(Math.min(48, Math.max(18, w / 30)))
  for (let i = 0; i < grassCount; i++) {
    grass.push({ x: rng() * w, y: h * (0.7 + rng() * 0.28) })
  }

  return { w, h, trail, ridges, pines, rocks, bushes, grass }
}

/* Detailed side-profile trail-running shoe, drawn pointing to the right so it can
   be rotated to the trail's local tangent. Origin is roughly the ground contact. */
function Shoe({ className }: { className: string }) {
  return (
    <g className={className}>
      <path
        className="shoe-outsole"
        d="M-15,-1 L13.5,-1 C15,-1 15.6,-0.2 15,0.6 L-14.2,0.6 C-15.6,0.6 -16,-0.4 -15,-1 Z"
      />
      <path className="shoe-lugs" d="M-14,1 L14,0.4" />
      <path
        className="shoe-midsole"
        d="M-15.5,-1.2 C-16.4,-3 -15.8,-4.4 -13,-4.6 L10.5,-4.6 C13.8,-4.6 15.8,-3.4 15.2,-1.2 C15.4,-1 -15.7,-1 -15.5,-1.2 Z"
      />
      <path className="shoe-midline" d="M-14.5,-2.4 L14.2,-2.4" />
      <path
        className="shoe-upper"
        d="M-14,-4.6 C-14.6,-7.6 -14.2,-9.2 -12,-9.3 C-10.5,-9.4 -9.6,-8.4 -8.5,-7.6 C-7.4,-6.8 -6.6,-6.4 -6,-6.5 C-5,-6.6 -3,-7.9 -1,-8.6 C2,-9.5 5,-9.7 9,-9.5 C12.6,-9.3 15.4,-7.2 14.8,-4.6 L-14,-4.6 Z"
      />
      <path className="shoe-toe" d="M10.5,-5 C12.8,-5.6 14.2,-6.8 14.6,-8.4" />
      <path
        className="shoe-lace"
        d="M0,-6.4 L3,-8 M2,-5.9 L5,-7.6 M4,-5.4 L7,-7.4"
      />
      <path className="shoe-tab" d="M-13.4,-9.1 C-15,-9.6 -15,-11 -13.4,-11.2" />
    </g>
  )
}

export function TrailScene() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const trailRef = useRef<SVGPathElement>(null)
  const drawnRef = useRef<SVGPathElement>(null)
  const shoeRef = useRef<SVGGElement>(null)
  const [scene, setScene] = useState<Scene | null>(null)

  /* Measure the full document box and (re)build the scene on resize. */
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    let frame = 0
    const measure = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const w = el.clientWidth
        const h = el.clientHeight
        if (w > 0 && h > 0) setScene(buildScene(w, h))
      })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(frame)
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  /* Drive the shoe along the trail and progressively draw the line from scroll. */
  useEffect(() => {
    if (!scene) return
    const trail = trailRef.current
    const drawn = drawnRef.current
    const shoe = shoeRef.current
    if (!trail || !drawn || !shoe) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const total = trail.getTotalLength()

    const place = (progress: number) => {
      /* Keep the runner slightly ahead of the origin marker so the two shoes
         read as distinct (start marker + runner) even at the top of the page. */
      const p = 0.045 + Math.min(1, Math.max(0, progress)) * 0.94
      const at = p * total
      const point = trail.getPointAtLength(at)
      const ahead = trail.getPointAtLength(Math.min(total, at + 1))
      const behind = trail.getPointAtLength(Math.max(0, at - 1))
      const angle =
        (Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180) / Math.PI
      const s = Math.min(1.9, Math.max(1.1, scene.w / 900))
      shoe.setAttribute(
        'transform',
        `translate(${point.x.toFixed(1)} ${point.y.toFixed(1)}) rotate(${angle.toFixed(1)}) scale(${s.toFixed(3)})`,
      )
      drawn.style.strokeDashoffset = String(1 - p)
    }

    if (reduce) {
      place(0.16)
      return
    }

    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const doc = document.documentElement
        const max = doc.scrollHeight - window.innerHeight
        place(max > 0 ? window.scrollY / max : 0)
        ticking = false
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [scene])

  return (
    <div className="trail-scene" ref={wrapRef} aria-hidden="true">
      {scene && (
        <svg
          className="trail-svg"
          viewBox={`0 0 ${scene.w} ${scene.h}`}
          preserveAspectRatio="none"
          width={scene.w}
          height={scene.h}
        >
          <defs>
            <path
              id="ts-pine"
              d="M0,-1 L0.12,-0.62 L0.05,-0.62 L0.2,-0.3 L0.09,-0.3 L0.28,0.04 L-0.28,0.04 L-0.09,-0.3 L-0.2,-0.3 L-0.05,-0.62 L-0.12,-0.62 Z"
            />
            <path
              id="ts-rock"
              d="M-1,0 C-1.2,-0.5 -0.7,-0.95 -0.05,-1 C0.55,-1.05 1.15,-0.6 1.05,0 C1,0.25 -0.9,0.3 -1,0 Z"
            />
            <path
              id="ts-bush"
              d="M-1,0 C-1.2,-0.55 -0.55,-0.9 -0.2,-0.7 C0,-1.1 0.75,-1.05 0.8,-0.55 C1.25,-0.55 1.2,0 0.65,0 Z"
            />
          </defs>

          <g className="scene-hills">
            {scene.ridges.map((r, i) => (
              <path key={`ridge-${i}`} d={r.d} style={{ opacity: r.opacity }} />
            ))}
          </g>

          <g className="scene-trees">
            {scene.pines.map((t, i) => (
              <g
                key={`pine-${i}`}
                transform={`translate(${t.x.toFixed(1)} ${t.y.toFixed(1)}) scale(${t.s.toFixed(1)})`}
              >
                <rect
                  className="tree-trunk"
                  x={-0.05}
                  y={0}
                  width={0.1}
                  height={0.16}
                />
                <use href="#ts-pine" className="tree-body" />
              </g>
            ))}
          </g>

          <g className="scene-bushes">
            {scene.bushes.map((b, i) => (
              <use
                key={`bush-${i}`}
                href="#ts-bush"
                transform={`translate(${b.x.toFixed(1)} ${b.y.toFixed(1)}) scale(${b.s.toFixed(1)})`}
              />
            ))}
          </g>

          <g className="scene-rocks">
            {scene.rocks.map((r, i) => (
              <use
                key={`rock-${i}`}
                href="#ts-rock"
                transform={`translate(${r.x.toFixed(1)} ${r.y.toFixed(1)}) scale(${r.s.toFixed(1)})`}
              />
            ))}
          </g>

          <g className="scene-grass">
            {scene.grass.map((g, i) => {
              const h = 6 + ((i * 7) % 6)
              return (
                <path
                  key={`grass-${i}`}
                  transform={`translate(${g.x.toFixed(1)} ${g.y.toFixed(1)})`}
                  d={`M0,0 L${(-h * 0.4).toFixed(1)},${(-h).toFixed(1)} M0,0 L0,${(-h * 1.3).toFixed(1)} M0,0 L${(h * 0.4).toFixed(1)},${(-h).toFixed(1)}`}
                />
              )
            })}
          </g>

          <path className="trail-base" d={scene.trail} />
          <path
            className="trail-line"
            ref={trailRef}
            pathLength={1}
            d={scene.trail}
          />
          <path
            className="trail-draw"
            ref={drawnRef}
            pathLength={1}
            d={scene.trail}
          />

          <g className="trail-origin" transform={`translate(${(scene.w * TRAIL_WAYPOINTS[0].x).toFixed(1)} ${(scene.h * TRAIL_WAYPOINTS[0].y).toFixed(1)}) rotate(-24) scale(${Math.min(1.7, Math.max(1, scene.w / 900)).toFixed(3)})`}>
            <Shoe className="runner origin-shoe" />
          </g>

          <g className="trail-runner" ref={shoeRef}>
            <Shoe className="runner" />
          </g>
        </svg>
      )}
    </div>
  )
}
