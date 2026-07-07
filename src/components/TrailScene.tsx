import { useEffect, useRef, useState } from 'react'

type Band = {
  /* Scene image index (1-based) -> /trail/scene-0N.jpg. */
  scene: number
  /* Geometry in pixels, relative to the positioned trail-scene layer. */
  top: number
  height: number
}

/* Natural aspect ratio of the generated scenes (1536 x 1024). Every scene is
   rendered at this height for its width so all watercolors read at the same
   scale regardless of how tall their host section is. */
const SCENE_ASPECT = 1024 / 1536

/* Vertical point in the viewport the reference line rides at (fraction from the
   top). Sits in the lower portion where the painted trail lives. */
const RIDE = 0.72
/* Fraction of the trail over which the shoe fades in at the start / out at the
   end, so it hands off between stacked scenes. */
const FADE = 0.14

/* Hand-traced trail for each scene image, as normalized [x, y] points in image
   space (0..1, y down), ordered foreground (bottom) -> vanishing point (top).
   The shoe is driven along this polyline so it runs on the painted trail. */
const TRAIL_PATHS: Record<number, Array<[number, number]>> = {
  1: [
    [0.3, 1.0],
    [0.31, 0.9],
    [0.31, 0.82],
    [0.39, 0.76],
    [0.5, 0.71],
    [0.57, 0.66],
    [0.56, 0.63],
  ],
  2: [
    [0.6, 1.0],
    [0.53, 0.9],
    [0.43, 0.83],
    [0.36, 0.79],
    [0.4, 0.74],
    [0.45, 0.7],
    [0.44, 0.67],
  ],
  3: [
    [0.56, 1.0],
    [0.57, 0.88],
    [0.51, 0.79],
    [0.45, 0.73],
    [0.47, 0.68],
    [0.5, 0.65],
    [0.48, 0.63],
  ],
  4: [
    [0.42, 1.0],
    [0.45, 0.9],
    [0.47, 0.81],
    [0.5, 0.74],
    [0.53, 0.69],
    [0.55, 0.66],
  ],
}

/* Shoe scale at the foreground (near) and vanishing-point (far) ends of a trail,
   so it shrinks with distance as it heads into the scene. */
const SCALE_NEAR = 1.05
const SCALE_FAR = 0.42

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)
const clamp = (n: number, lo: number, hi: number) =>
  n < lo ? lo : n > hi ? hi : n
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/* Given a normalized image-y, find where the trail sits horizontally at that
   height (the paths are ordered foreground -> vanishing, i.e. decreasing y), and
   return the local tangent so the shoe can face its direction of travel. */
function sampleByY(
  path: Array<[number, number]>,
  ny: number,
): { x: number; dx: number; dy: number } {
  const n = path.length
  const yNear = path[0][1]
  const yFar = path[n - 1][1]
  const cy = Math.min(yNear, Math.max(yFar, ny))
  let i = 0
  while (i < n - 2 && cy < path[i + 1][1]) i++
  const [x0, y0] = path[i]
  const [x1, y1] = path[i + 1]
  const f = y0 === y1 ? 0 : (y0 - cy) / (y0 - y1)
  return { x: lerp(x0, x1, f), dx: x1 - x0, dy: y1 - y0 }
}

/* Smooth each hand-traced polyline into a flowing curve so the shoe follows a
   continuous path instead of visibly kinking at every A -> B -> C waypoint. A
   Catmull-Rom spline passes through the original points while rounding the turns;
   we densify to short segments so sampleByY reads a smooth curve and tangent. */
function catmullRom(points: Array<[number, number]>, perSeg = 20) {
  if (points.length < 3)
    return points.map(([x, y]) => [x, y] as [number, number])
  const out: Array<[number, number]> = []
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2 < points.length ? i + 2 : points.length - 1]
    for (let t = 0; t < perSeg; t++) {
      const u = t / perSeg
      const u2 = u * u
      const u3 = u2 * u
      const x =
        0.5 *
        (2 * p1[0] +
          (-p0[0] + p2[0]) * u +
          (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * u2 +
          (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * u3)
      const y =
        0.5 *
        (2 * p1[1] +
          (-p0[1] + p2[1]) * u +
          (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * u2 +
          (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * u3)
      out.push([x, y])
    }
  }
  out.push(points[points.length - 1])
  return out
}

const SMOOTH_PATHS: Record<
  number,
  Array<[number, number]>
> = Object.fromEntries(
  Object.entries(TRAIL_PATHS).map(([k, pts]) => [Number(k), catmullRom(pts)]),
)

export function TrailScene() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const runnerRef = useRef<HTMLDivElement>(null)
  const [bands, setBands] = useState<Band[]>([])
  /* Uniform pixel height every scene image is drawn at (width * aspect), so the
     watercolors share one scale even though their sections differ in height. */
  const [sceneH, setSceneH] = useState(0)

  /* Measure the mapped Home sections (tagged with data-trail-scene) and turn
     each into a full-width background band positioned behind that section. */
  useEffect(() => {
    const wrap = wrapRef.current
    const frame = wrap?.parentElement
    if (!wrap || !frame) return

    let raf = 0
    const measure = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const targets = Array.from(
          document.querySelectorAll<HTMLElement>('[data-trail-scene]'),
        )
        const frameTop = frame.getBoundingClientRect().top + window.scrollY
        setSceneH(Math.round(wrap.clientWidth * SCENE_ASPECT))
        const next = targets.map((el) => {
          const rect = el.getBoundingClientRect()
          return {
            scene: Number(el.dataset.trailScene) || 1,
            top: rect.top + window.scrollY - frameTop,
            height: rect.height,
          }
        })
        setBands(next)
      })
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    document
      .querySelectorAll('[data-trail-scene]')
      .forEach((el) => ro.observe(el))
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  /* Preload the scene images so bands appear without a flash of empty space. */
  useEffect(() => {
    const seen = new Set<number>()
    bands.forEach((b) => {
      if (seen.has(b.scene)) return
      seen.add(b.scene)
      const img = new Image()
      img.src = `/trail/scene-0${b.scene}.jpg`
    })
  }, [bands])

  /* Drive the shoe: for the active scene, map the scroll ride line to a height
     inside the image, look up the painted trail's x at that height, and place the
     shoe there so it runs down the trail — shrinking toward the vanishing point
     and fading out at each end. */
  useEffect(() => {
    const runner = runnerRef.current
    const wrap = wrapRef.current
    if (!runner || !wrap || bands.length === 0) return

    const frame = wrap.parentElement
    if (!frame) return

    const place = (rideY: number) => {
      const frameTop = frame.getBoundingClientRect().top + window.scrollY
      const ref = rideY - frameTop
      const width = wrap.clientWidth
      const imgH = sceneH || 0

      let active: Band | null = null
      for (const b of bands) {
        if (ref >= b.top && ref <= b.top + b.height) {
          active = b
          break
        }
      }
      const path = active ? SMOOTH_PATHS[active.scene] : undefined
      if (!active || !path || imgH === 0) {
        runner.style.opacity = '0'
        return
      }

      /* Map the scroll ride line to a height inside the scene image, then look up
         where the painted trail sits at that height. The shoe stays on the ride
         line (so it is always visible) while hugging the trail's horizontal
         curve, and shrinks as the trail recedes toward the vanishing point. */
      const imgTop = active.top + active.height - imgH
      const yNear = path[0][1]
      const yFar = path[path.length - 1][1]
      const nyTarget = (ref - imgTop) / imgH
      const prog = clamp01((nyTarget - yFar) / Math.max(0.001, yNear - yFar))

      const s = sampleByY(path, nyTarget)
      const x = s.x * width
      /* The sole sits on the ride line; the CSS gait provides the running hop. */
      const y = ref

      /* Perspective: bigger in the foreground (prog -> 1), smaller far away. */
      const scale = lerp(SCALE_FAR, SCALE_NEAR, prog)
      /* Travel runs foreground-ward as the reader scrolls down, i.e. the reverse
         of the stored near->far order. Face that direction and add a gentle tilt
         from the trail's screen-space slope. */
      const dxScreen = -s.dx * width
      const dyScreen = -s.dy * imgH
      const faceSign = dxScreen < 0 ? -1 : 1
      const tilt = clamp(
        (Math.atan2(dyScreen * 0.35, Math.abs(dxScreen) + 0.001) * 180) /
          Math.PI,
        -18,
        18,
      )

      const opacity =
        Math.min(clamp01(prog / FADE), clamp01((1 - prog) / FADE)) * 0.95
      runner.style.opacity = opacity.toFixed(3)
      runner.style.transform =
        `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) ` +
        `rotate(${tilt.toFixed(1)}deg) scale(${(faceSign * scale).toFixed(3)}, ${scale.toFixed(3)})`
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      /* Park the shoe partway along the first scene's trail, no scroll listener. */
      const first = bands[0]
      const path = SMOOTH_PATHS[first.scene]
      const imgH = sceneH || first.height
      const imgTop = first.top + first.height - imgH
      if (path) {
        const prog = 0.55
        const ny = lerp(path[path.length - 1][1], path[0][1], prog)
        const s = sampleByY(path, ny)
        const scale = lerp(SCALE_FAR, SCALE_NEAR, prog)
        runner.style.opacity = '0.9'
        runner.style.transform =
          `translate(${(s.x * wrap.clientWidth).toFixed(1)}px, ${(imgTop + ny * imgH).toFixed(1)}px) ` +
          `scale(${scale.toFixed(3)}, ${scale.toFixed(3)})`
      }
      return
    }

    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        place(window.scrollY + window.innerHeight * RIDE)
        ticking = false
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [bands, sceneH])

  return (
    <div className="trail-scene" ref={wrapRef} aria-hidden="true">
      {bands.map((b, i) => (
        <div
          key={`band-${i}`}
          className="trail-band"
          style={{ top: `${b.top}px`, height: `${b.height}px` }}
        >
          <img
            className="trail-band-img"
            src={`/trail/scene-0${b.scene}.jpg`}
            alt=""
            loading="eager"
            decoding="async"
            style={sceneH ? { height: `${sceneH}px` } : undefined}
          />
          <span className="trail-band-veil" />
        </div>
      ))}

      <div className="trail-runner" ref={runnerRef}>
        <img
          className="trail-runner-shoe"
          src="/trail/shoe.png"
          alt=""
          decoding="async"
        />
      </div>
    </div>
  )
}
