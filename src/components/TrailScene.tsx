import { useEffect, useRef, useState } from 'react'

/* Trail-running shoe drawn in side profile, pointing to the right so it reads as
   moving left -> right across each scene. Origin is roughly the ground contact
   point. Reused as a small overlay that rides across the active scene. */
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
      <path
        className="shoe-tab"
        d="M-13.4,-9.1 C-15,-9.6 -15,-11 -13.4,-11.2"
      />
    </g>
  )
}

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

/* Vertical point in the viewport the shoe rides at (fraction from the top).
   Sits in the lower portion where the painted trail lives. */
const RIDE = 0.72
/* Fraction of a scene over which the shoe fades in on the left / out on the
   right, so it hands off between stacked scenes. */
const FADE = 0.12

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)

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

  /* Drive the shoe: as the reader scrolls through a scene, map progress to a
     horizontal position (left -> right) and crossfade at the boundaries. */
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

      let active: Band | null = null
      for (const b of bands) {
        if (ref >= b.top && ref <= b.top + b.height) {
          active = b
          break
        }
      }
      if (!active) {
        runner.style.opacity = '0'
        return
      }

      /* The scene image occupies the bottom `sceneH` of its section (clipped for
         short sections). Ride the shoe across that painted region only, so it
         never walks over the paper above a scene in tall sections. */
      const sceneBottom = active.top + active.height
      const sceneTop = Math.max(
        active.top,
        sceneBottom - (sceneH || active.height),
      )
      if (ref < sceneTop) {
        runner.style.opacity = '0'
        return
      }

      const p = clamp01((ref - sceneTop) / Math.max(1, sceneBottom - sceneTop))
      const marginX = Math.max(28, width * 0.07)
      const x = marginX + p * (width - marginX * 2)
      /* Gentle arc so the shoe rides the trail rather than sliding flat. */
      const bob = Math.sin(p * Math.PI) * -10
      const y = ref + bob

      const opacity =
        Math.min(clamp01(p / FADE), clamp01((1 - p) / FADE)) * 0.95
      runner.style.opacity = opacity.toFixed(3)
      runner.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      /* Park the shoe near the start of the first scene, no scroll listener. */
      const first = bands[0]
      const firstBottom = first.top + first.height
      const firstSceneTop = Math.max(
        first.top,
        firstBottom - (sceneH || first.height),
      )
      const ref = firstSceneTop + (firstBottom - firstSceneTop) * 0.2
      const width = wrap.clientWidth
      const marginX = Math.max(28, width * 0.07)
      runner.style.opacity = '0.9'
      runner.style.transform = `translate(${marginX.toFixed(1)}px, ${ref.toFixed(1)}px)`
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
        <svg viewBox="-18 -13 36 16" width="34" height="15">
          <Shoe className="runner" />
        </svg>
      </div>
    </div>
  )
}
