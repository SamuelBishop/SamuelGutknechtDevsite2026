import { useEffect, useRef, useState } from 'react'

type Band = {
  /* Scene image index (1-based) -> /trail/scene-0N.jpg. */
  scene: number
  /* Geometry in pixels, relative to the positioned trail-scene layer. */
  top: number
  height: number
}

/* Natural aspect ratio of the generated scenes (1536 x 1024). Every scene is
   drawn at this height for its width, then clipped to a shared band height so
   all illustrations read at the exact same scale regardless of how tall their
   host section is. */
const SCENE_ASPECT = 1024 / 1536

/* Portrait re-framings of the same five scenes (1280 x 1600), served on narrow
   phones where the landscape strip collapses to a thin, mostly-dissolved sliver.
   Same palette/shapes/feel, just cropped tall so the scene + its travelling
   object fill the stage. Desktop never loads these. */
const SCENE_ASPECT_PORTRAIT = 1600 / 1280

/* Viewport width at or below which we switch to the portrait art + paths. */
const PORTRAIT_MQ = '(max-width: 640px)'

/* Fraction of each scene (measured from the bottom) shown inside the band. The
   painted trails all live in the lower ~82% of the art, so we reveal that strip
   and trim the emptier sky above. Every band is this same pixel height, which is
   what makes all scenes read at one uniform scale. (Both orientations frame the
   trail in this lower window, so one value serves both.) */
const VISIBLE_FRAC = 0.82

/* Viewport line (fraction from the top) used to decide which scene is active and
   how far the object has progressed along its trail. */
const FOCUS = 0.52

/* Width in viewport px over which two neighbouring scenes cross-dissolve as the
   focus line moves from one band to the next. */
const FADE_VP = 170

/* Fraction of the path over which the object fades in at the start / out at the
   end, so it hands off cleanly between scenes. */
const FADE = 0.14

/* The object that traverses each scene, keyed by scene identity:
   1 Coder -> mouse cursor, 2 Mountains -> running shoe, 3 Tinkerer -> tiny
   robot, 4 Runner -> runner silhouette, 5 Lifelong Learner -> paper airplane.
   `flip` mirrors the art to face its travel direction (only for objects with a
   clear left/right heading); `lift` floats the object above the path line (for
   the cursor and the gliding plane). */
type SceneObject = { key: string; flip: boolean; lift: number }
const OBJECTS: Record<number, SceneObject> = {
  1: { key: 'cursor', flip: false, lift: 4 },
  2: { key: 'shoe', flip: true, lift: 0 },
  3: { key: 'robot', flip: false, lift: 0 },
  4: { key: 'runner', flip: true, lift: 0 },
  5: { key: 'plane', flip: false, lift: 26 },
}
const OBJECT_KEYS = Array.from(
  new Set(Object.values(OBJECTS).map((o) => o.key)),
)

/* Hand-traced path for each scene image, as normalized [x, y] points in image
   space (0..1, y down), ordered from the START of the route (foreground / near)
   to its END (far / receding). Calibrated against the painted trails with a
   Playwright dot-overlay so the object rides the actual line in each scene. The
   object is driven along this polyline by arc-length as the reader scrolls. */
const TRAIL_PATHS: Record<number, Array<[number, number]>> = {
  // Coder: enters on the desk-top dashes at the left edge, drops behind the pot
  // into the dashed "smile" under the desk front, then (the dashes stop mid-desk)
  // continues up along the desk front to the right edge.
  1: [
    [0.0, 0.725],
    [0.06, 0.735],
    [0.115, 0.765],
    [0.15, 0.783],
    [0.22, 0.85],
    [0.275, 0.905],
    [0.3, 0.932],
    [0.355, 0.945],
    [0.4, 0.947],
    [0.45, 0.94],
    [0.505, 0.918],
    [0.555, 0.888],
    [0.68, 0.862],
    [0.85, 0.845],
    [1.0, 0.837],
  ],
  // Mountains: follows the dashed centerline of the tan trail from where it
  // emerges up near the tree line, curving down-right then back down-left, and
  // out through the bottom edge in the foreground (top -> bottom travel).
  2: [
    [0.235, 0.8],
    [0.295, 0.812],
    [0.35, 0.826],
    [0.4, 0.843],
    [0.435, 0.862],
    [0.45, 0.885],
    [0.435, 0.905],
    [0.408, 0.925],
    [0.386, 0.945],
    [0.385, 0.97],
    [0.4, 1.0],
  ],
  // Tinkerer: rides the dashed hump up from the left edge to the desk corner
  // where the dashes stop, then continues along the desk front-top edge to the
  // right edge.
  3: [
    [0.0, 0.865],
    [0.035, 0.855],
    [0.06, 0.838],
    [0.09, 0.802],
    [0.115, 0.778],
    [0.145, 0.758],
    [0.185, 0.746],
    [0.22, 0.75],
    [0.255, 0.765],
    [0.285, 0.788],
    [0.34, 0.8],
    [0.5, 0.802],
    [0.66, 0.802],
    [0.82, 0.802],
    [1.0, 0.802],
  ],
  // Runner: follows the near (lower) arm of the dashed lane in from the left
  // edge, around the bend at its vertex where the dashes stop, then continues
  // along the track's curve out through the right edge.
  4: [
    [0.0, 0.825],
    [0.06, 0.808],
    [0.12, 0.788],
    [0.19, 0.765],
    [0.26, 0.745],
    [0.33, 0.725],
    [0.4, 0.705],
    [0.45, 0.688],
    [0.48, 0.665],
    [0.495, 0.645],
    [0.5, 0.635],
    [0.57, 0.598],
    [0.68, 0.568],
    [0.83, 0.565],
    [1.0, 0.595],
  ],
  // Lifelong Learner: gentle double-wave following the grey dashed line clear
  // across the desk, from the left edge to the right edge.
  5: [
    [0.0, 0.94],
    [0.08, 0.912],
    [0.15, 0.872],
    [0.23, 0.837],
    [0.31, 0.872],
    [0.4, 0.912],
    [0.5, 0.94],
    [0.57, 0.947],
    [0.66, 0.937],
    [0.75, 0.905],
    [0.84, 0.862],
    [0.92, 0.838],
    [1.0, 0.852],
  ],
}

/* Portrait-framed trail paths (image space for the 1280 x 1600 crops). Derived
   by transforming each calibrated landscape polyline through its scene's crop /
   pad window, then verified against the painted dashes with the dot-overlay. */
const TRAIL_PATHS_PORTRAIT: Record<number, Array<[number, number]>> = {
  1: [
    [0.0014, 0.9132],
    [0.0205, 0.9239],
    [0.0358, 0.9327],
    [0.0532, 0.941],
    [0.0869, 0.9453],
    [0.1206, 0.9495],
    [0.1516, 0.9522],
    [0.1791, 0.9528],
    [0.2084, 0.9535],
    [0.2385, 0.9518],
    [0.2691, 0.9495],
    [0.3001, 0.9465],
    [0.3338, 0.9393],
    [0.3675, 0.9321],
    [0.3997, 0.9238],
    [0.4323, 0.9133],
    [0.4629, 0.9036],
    [0.5324, 0.8949],
    [0.609, 0.8864],
    [0.6902, 0.8784],
    [0.7943, 0.8728],
    [0.8983, 0.8673],
  ],
  2: [
    [0.1692, 0.7352],
    [0.2089, 0.7394],
    [0.2486, 0.7437],
    [0.2857, 0.7485],
    [0.3235, 0.7536],
    [0.3579, 0.7591],
    [0.391, 0.7651],
    [0.4213, 0.7716],
    [0.4444, 0.7783],
    [0.4651, 0.7853],
    [0.4754, 0.7937],
    [0.4854, 0.8018],
    [0.4754, 0.8089],
    [0.4651, 0.8162],
    [0.4487, 0.8233],
    [0.4309, 0.8303],
    [0.4144, 0.8376],
    [0.3999, 0.8447],
    [0.391, 0.8525],
    [0.3903, 0.8616],
    [0.392, 0.8708],
    [0.4019, 0.8814],
  ],
  3: [
    [0.0011, 0.8364],
    [0.0181, 0.8384],
    [0.0351, 0.8404],
    [0.0521, 0.8423],
    [0.0887, 0.8433],
    [0.1381, 0.8437],
    [0.1875, 0.844],
    [0.237, 0.8443],
    [0.2864, 0.8446],
    [0.3358, 0.8447],
    [0.3853, 0.8447],
    [0.4347, 0.8447],
    [0.4841, 0.8447],
    [0.5336, 0.8447],
    [0.583, 0.8447],
    [0.6324, 0.8447],
    [0.6819, 0.8447],
    [0.7313, 0.8447],
    [0.7827, 0.8447],
    [0.8383, 0.8447],
    [0.8939, 0.8447],
    [0.9496, 0.8447],
  ],
  4: [
    [0.0016, 0.7576],
    [0.0483, 0.7506],
    [0.0971, 0.7422],
    [0.1459, 0.7335],
    [0.1994, 0.7241],
    [0.2564, 0.7142],
    [0.3133, 0.7055],
    [0.3702, 0.6968],
    [0.4247, 0.6885],
    [0.4817, 0.6798],
    [0.5386, 0.6711],
    [0.59, 0.6629],
    [0.6289, 0.6559],
    [0.6625, 0.6474],
    [0.6869, 0.6374],
    [0.7038, 0.6285],
    [0.716, 0.6199],
    [0.7228, 0.6141],
    [0.7268, 0.6097],
    [0.7708, 0.5967],
    [0.8277, 0.5807],
    [0.9138, 0.5673],
  ],
  5: [
    [0.0006, 0.8979],
    [0.0458, 0.9085],
    [0.0928, 0.9196],
    [0.1397, 0.9308],
    [0.1913, 0.9389],
    [0.2435, 0.9467],
    [0.296, 0.954],
    [0.3325, 0.9559],
    [0.3691, 0.9579],
    [0.4097, 0.958],
    [0.4566, 0.9552],
    [0.5062, 0.9523],
    [0.5532, 0.9454],
    [0.6001, 0.9365],
    [0.6471, 0.9276],
    [0.6941, 0.916],
    [0.741, 0.904],
    [0.7897, 0.8923],
    [0.8315, 0.8856],
    [0.8732, 0.8789],
    [0.915, 0.8763],
    [0.9567, 0.8802],
  ],
}

/* Object scale mapped from its height in the image: things low in the frame
   (near) render large, things high up (far) render small, so travelling toward
   a vanishing point reads as receding into the distance. */
const NY_NEAR = 1.0
const NY_FAR = 0.55
const SCALE_NEAR = 1.0
const SCALE_FAR = 0.5

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)
const clamp = (n: number, lo: number, hi: number) =>
  n < lo ? lo : n > hi ? hi : n
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

const nyToScale = (ny: number) =>
  clamp(
    lerp(SCALE_FAR, SCALE_NEAR, (ny - NY_FAR) / (NY_NEAR - NY_FAR)),
    SCALE_FAR,
    SCALE_NEAR,
  )

/* Smooth each hand-traced polyline into a flowing curve so the object follows a
   continuous path instead of visibly kinking at every A -> B -> C waypoint. A
   Catmull-Rom spline passes through the original points while rounding the
   turns; we densify to short segments for a smooth arc-length parameterization. */
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

/* A smoothed path with cumulative arc lengths, so it can be sampled by a
   normalized distance t (0..1) at a roughly constant travel speed. */
type ArcPath = {
  pts: Array<[number, number]>
  cum: number[]
  total: number
}

function buildArc(points: Array<[number, number]>): ArcPath {
  const pts = catmullRom(points)
  const cum = [0]
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i][0] - pts[i - 1][0]
    const dy = pts[i][1] - pts[i - 1][1]
    cum[i] = cum[i - 1] + Math.hypot(dx, dy)
  }
  return { pts, cum, total: cum[cum.length - 1] || 1 }
}

const ARC_PATHS: Record<number, ArcPath> = Object.fromEntries(
  Object.entries(TRAIL_PATHS).map(([k, pts]) => [Number(k), buildArc(pts)]),
)

const ARC_PATHS_PORTRAIT: Record<number, ArcPath> = Object.fromEntries(
  Object.entries(TRAIL_PATHS_PORTRAIT).map(([k, pts]) => [
    Number(k),
    buildArc(pts),
  ]),
)

/* Sample a path at normalized distance t (0..1): return the point and the local
   tangent so the object can face and tilt along its direction of travel. */
function sampleByT(
  path: ArcPath,
  t: number,
): { x: number; y: number; dx: number; dy: number } {
  const { pts, cum, total } = path
  const d = clamp01(t) * total
  let i = 0
  while (i < cum.length - 2 && cum[i + 1] < d) i++
  const seg = cum[i + 1] - cum[i]
  const f = seg <= 0 ? 0 : (d - cum[i]) / seg
  const [x0, y0] = pts[i]
  const [x1, y1] = pts[i + 1]
  return { x: lerp(x0, x1, f), y: lerp(y0, y1, f), dx: x1 - x0, dy: y1 - y0 }
}

export function TrailScene() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const runnerRef = useRef<HTMLDivElement>(null)
  const objRef = useRef<HTMLImageElement>(null)
  /* Remember which object is mounted so we only swap the <img> when the active
     scene actually changes, not on every animation frame. */
  const objKeyRef = useRef<string>('')
  const [bands, setBands] = useState<Band[]>([])
  /* Uniform pixel height every scene image is drawn at (width * aspect). The
     band reveals VISIBLE_FRAC of that, giving one shared scale for all scenes. */
  const [sceneH, setSceneH] = useState(0)
  /* On narrow phones we serve the portrait re-framings + their derived paths, so
     the scene fills the stage instead of collapsing to a thin strip. */
  const [isPortrait, setIsPortrait] = useState(
    () =>
      typeof window !== 'undefined' && window.matchMedia(PORTRAIT_MQ).matches,
  )

  useEffect(() => {
    const mq = window.matchMedia(PORTRAIT_MQ)
    const onChange = () => setIsPortrait(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  /* Measure the mapped Home sections (tagged with data-trail-scene) and turn
     each into a full-width background band. Geometry is stored relative to the
     positioned trail-scene layer. */
  useEffect(() => {
    const wrap = wrapRef.current
    const stage = stageRef.current
    const frame = wrap?.parentElement
    if (!wrap || !stage || !frame) return

    let raf = 0
    const measure = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const aspect = isPortrait ? SCENE_ASPECT_PORTRAIT : SCENE_ASPECT
        /* Measure the centered stage, whose width is capped by CSS max-width so
           the art (and every value derived from it: band height, section
           min-height, object x) stops growing past the stage cap on large
           monitors. */
        const sceneHpx = Math.round(stage.clientWidth * aspect)
        const bandHpx = Math.round(sceneHpx * VISIBLE_FRAC)
        /* Guarantee each mapped section is at least as tall as its band, so the
           band (centered on the section) is fully contained and neighbouring
           scenes can never overlap. Set before reading rects so the reflow below
           reports the grown, non-overlapping geometry. */
        frame.style.setProperty('--trail-band-h', `${bandHpx}px`)
        setSceneH(sceneHpx)
        const targets = Array.from(
          document.querySelectorAll<HTMLElement>('[data-trail-scene]'),
        )
        const frameTop = frame.getBoundingClientRect().top + window.scrollY
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
      frame.style.removeProperty('--trail-band-h')
    }
  }, [isPortrait])

  /* Preload the scene images and the object sprites so nothing flashes in. */
  useEffect(() => {
    const suffix = isPortrait ? '-portrait' : ''
    const seen = new Set<number>()
    bands.forEach((b) => {
      if (seen.has(b.scene)) return
      seen.add(b.scene)
      const img = new Image()
      img.src = `/trail/scene-0${b.scene}${suffix}.jpg`
    })
    OBJECT_KEYS.forEach((key) => {
      const img = new Image()
      img.src = `/trail/obj-${key}.png`
    })
  }, [bands, isPortrait])

  /* Drive the scene: the bands are positioned at document coordinates and scroll
     with the page (each shows the same lower strip of its scene, so all read at
     one uniform scale). We cross-dissolve between neighbouring scenes as the
     focus line crosses from one band to the next, and ride the active scene's
     object along its painted trail as that band scrolls through the focus line. */
  useEffect(() => {
    const runner = runnerRef.current
    const wrap = wrapRef.current
    const stage = stageRef.current
    const obj = objRef.current
    if (
      !runner ||
      !wrap ||
      !stage ||
      !obj ||
      bands.length === 0 ||
      sceneH === 0
    )
      return

    const frame = wrap.parentElement
    if (!frame) return

    const bandEls = Array.from(
      stage.querySelectorAll<HTMLElement>('.trail-band'),
    )
    const bandH = Math.round(sceneH * VISIBLE_FRAC)
    const arcPaths = isPortrait ? ARC_PATHS_PORTRAIT : ARC_PATHS

    /* The very first and very last bands can't be fully crossed by the focus
       line: at the top of the page it already sits partway down the opening
       band, and at the bottom it can never reach past partway through the final
       band. We remap those two bands' progress against the reachable scroll
       range (below) so the opening object still begins at the head of its trail
       and the final object still finishes at the end of its trail. */
    const firstBand = bands[0]
    const lastBand = bands[bands.length - 1]

    /* Swap the object sprite + sizing class only when the scene changes. */
    const setObject = (scene: number) => {
      const spec = OBJECTS[scene] ?? OBJECTS[1]
      if (objKeyRef.current === spec.key) return spec
      objKeyRef.current = spec.key
      obj.src = `/trail/obj-${spec.key}.png`
      runner.className = `trail-runner is-${spec.key}`
      return spec
    }

    /* Local top of a band within the trail layer: its uniform strip is centered
       vertically on its host section. */
    const bandTopLocal = (b: Band) => b.top + (b.height - bandH) / 2

    /* Map a normalized image-space y (0..1) to a local y offset within the band.
       The scene image is bottom-anchored and taller than the band, so only its
       lower VISIBLE_FRAC shows; a trail point at image-y `ny` lands here. */
    const imgYToBand = (ny: number) => bandH * (1 - (1 - ny) / VISIBLE_FRAC)

    /* Cross-fade every band by how close the focus line is to it, then place the
       active scene's object on its painted trail. Bands are laid out in document
       space (CSS `top`) and scroll natively; `objScroll` lags `realScroll` a
       little so the object trails the scrollbar and then catches up. When
       `staticP` is set the object is parked at that progress (reduced motion). */
    const render = (
      realScroll: number,
      objScroll: number,
      staticP?: number,
    ) => {
      const vh = window.innerHeight
      const width = stage.clientWidth
      const frameTop = frame.getBoundingClientRect().top + realScroll
      const centerVp = FOCUS * vh

      bands.forEach((b, i) => {
        const el = bandEls[i]
        if (!el) return
        const topVp = frameTop + bandTopLocal(b) - realScroll
        const edge = Math.min(centerVp - topVp, topVp + bandH - centerVp)
        el.style.opacity = clamp01(0.5 + edge / FADE_VP).toFixed(3)
      })

      /* Active band for the object: the one whose strip spans the focus line. */
      let active: Band | null = null
      let activeP = 0
      let activeWeight = 0
      for (const b of bands) {
        const topVp = frameTop + bandTopLocal(b) - objScroll
        const p = (centerVp - topVp) / bandH
        if (p >= 0 && p <= 1) {
          active = b
          activeP = p
          activeWeight = clamp01(
            0.5 +
              Math.min(centerVp - topVp, topVp + bandH - centerVp) / FADE_VP,
          )
          break
        }
      }
      const path = active ? arcPaths[active.scene] : undefined
      if (!active || !path) {
        runner.style.opacity = '0'
        return
      }

      const spec = setObject(active.scene)

      /* Stretch the opening / closing band's raw progress across the range the
         page can actually scroll, so neither the first object starts mid-trail
         nor the last object stops mid-trail. `pAtTop` is the progress the first
         band shows at scrollY 0; `pAtBottom` is the furthest the last band can
         reach at max scroll. Interior bands have full runway on both sides, so
         their bounds fall outside [0,1] and the remap is a no-op. */
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - vh)
      let progress = activeP
      if (active === firstBand) {
        const pAtTop = clamp01(
          (centerVp - frameTop - bandTopLocal(firstBand)) / bandH,
        )
        if (pAtTop < 1) progress = clamp01((activeP - pAtTop) / (1 - pAtTop))
      }
      if (active === lastBand) {
        const pAtBottom = clamp01(
          (centerVp - frameTop - bandTopLocal(lastBand) + maxScroll) / bandH,
        )
        if (pAtBottom > 0) progress = clamp01(activeP / pAtBottom)
      }

      const p = staticP ?? progress
      const s = sampleByT(path, p)
      const scale = nyToScale(s.y)

      /* Position in document space; the element scrolls with the page. */
      const x = s.x * width
      const y = bandTopLocal(active) + imgYToBand(s.y) - spec.lift * scale

      /* Face + tilt along the route's screen-space tangent. */
      const dxScreen = s.dx * width
      const dyScreen = (s.dy * bandH) / VISIBLE_FRAC
      const faceSign = spec.flip && dxScreen < 0 ? -1 : 1
      const tilt = clamp(
        (Math.atan2(dyScreen, Math.abs(dxScreen) + 0.001) * 180) / Math.PI,
        -18,
        18,
      )

      const pFade = Math.min(clamp01(p / FADE), clamp01((1 - p) / FADE))
      runner.style.opacity = (pFade * activeWeight * 0.97).toFixed(3)
      runner.style.transform =
        `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) ` +
        `rotate(${tilt.toFixed(1)}deg) scale(${(faceSign * scale).toFixed(3)}, ${scale.toFixed(3)})`
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      /* No scroll-driven traversal: park the object mid-trail on whichever scene
         is active and only update the gentle background cross-fade on scroll. */
      const draw = () => render(window.scrollY, window.scrollY, 0.5)
      draw()
      window.addEventListener('scroll', draw, { passive: true })
      window.addEventListener('resize', draw)
      return () => {
        window.removeEventListener('scroll', draw)
        window.removeEventListener('resize', draw)
      }
    }

    /* Ease the object's scroll position instead of snapping to it, so it lags a
       little behind the scrollbar and then catches up. The background bands stay
       locked to the real scroll for a crisp feel. */
    let lag = window.scrollY
    let raf = 0
    const FOLLOW = 0.08

    const tick = () => {
      const real = window.scrollY
      const gap = real - lag
      lag += gap * FOLLOW
      if (Math.abs(gap) < 0.5) lag = real
      render(real, lag)
      raf = Math.abs(real - lag) > 0.5 ? requestAnimationFrame(tick) : 0
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }

    render(window.scrollY, lag)
    window.addEventListener('scroll', kick, { passive: true })
    window.addEventListener('resize', kick)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', kick)
      window.removeEventListener('resize', kick)
    }
  }, [bands, sceneH, isPortrait])

  const bandH = sceneH ? Math.round(sceneH * VISIBLE_FRAC) : 0

  return (
    <div className="trail-scene" ref={wrapRef} aria-hidden="true">
      <div className="trail-stage" ref={stageRef}>
        {bands.map((b, i) => (
          <div
            key={`band-${i}`}
            className="trail-band"
            style={
              bandH
                ? {
                    top: `${(b.top + (b.height - bandH) / 2).toFixed(1)}px`,
                    height: `${bandH}px`,
                  }
                : undefined
            }
          >
            <img
              className="trail-band-img"
              src={`/trail/scene-0${b.scene}${isPortrait ? '-portrait' : ''}.jpg`}
              alt=""
              loading="eager"
              decoding="async"
              style={sceneH ? { height: `${sceneH}px` } : undefined}
            />
            <span className="trail-band-veil" />
          </div>
        ))}

        <div className="trail-runner is-cursor" ref={runnerRef}>
          <img
            className="trail-obj"
            ref={objRef}
            src="/trail/obj-cursor.png"
            alt=""
            decoding="async"
          />
        </div>
      </div>
    </div>
  )
}
