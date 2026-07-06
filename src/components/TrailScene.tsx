const TRAIL =
  'M-20,272 C180,266 300,279 480,272 C660,265 780,279 960,272 C1080,268 1180,270 1240,271'

type Placed = { x: number; y: number; s: number }

const pines: Placed[] = [
  { x: 250, y: 236, s: 0.5 },
  { x: 296, y: 243, s: 0.4 },
  { x: 590, y: 230, s: 0.55 },
  { x: 636, y: 238, s: 0.42 },
  { x: 1000, y: 250, s: 1.3 },
  { x: 1058, y: 258, s: 0.95 },
  { x: 1112, y: 251, s: 1.55 },
  { x: 1168, y: 245, s: 1.15 },
]

const rocks: Placed[] = [
  { x: 180, y: 274, s: 0.7 },
  { x: 430, y: 283, s: 1.0 },
  { x: 520, y: 276, s: 0.6 },
  { x: 690, y: 285, s: 1.2 },
  { x: 800, y: 278, s: 0.8 },
  { x: 975, y: 289, s: 1.3 },
  { x: 1120, y: 283, s: 0.9 },
]

const bushes: Placed[] = [
  { x: 330, y: 280, s: 1.0 },
  { x: 610, y: 287, s: 1.2 },
  { x: 895, y: 282, s: 1.0 },
  { x: 1055, y: 286, s: 1.3 },
]

const grass: Array<{ x: number; y: number }> = [
  { x: 120, y: 270 },
  { x: 262, y: 278 },
  { x: 470, y: 285 },
  { x: 745, y: 287 },
  { x: 862, y: 281 },
  { x: 1005, y: 291 },
  { x: 1150, y: 286 },
]

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

export function TrailScene() {
  return (
    <>
      <svg
        className="trail-scene"
        viewBox="0 0 1200 300"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden="true"
      >
        <defs>
          <path
            id="pine"
            d="M0,-50 L6,-33 L2.6,-33 L9,-17 L4.6,-17 L13,3 L-13,3 L-4.6,-17 L-9,-17 L-2.6,-33 L-6,-33 Z"
          />
          <rect id="trunk" x="-1.6" y="2" width="3.2" height="6" />
          <path
            id="rock"
            d="M-13,3 C-16,-3 -10,-11 -1,-12 C7,-13 15,-8 14,0 C13.6,3 -12,4 -13,3 Z"
          />
          <path
            id="bush"
            d="M-11,3 C-13,-3 -7,-8 -3,-6 C-1,-11 7,-11 8,-5 C13,-5 13,3 7,3 Z"
          />
        </defs>

        <g className="scene-hills">
          <path
            className="hill hill-back"
            d="M-20,190 C120,150 240,158 360,182 C500,210 640,150 780,168 C900,183 1040,150 1220,178 L1220,300 L-20,300 Z"
          />
          <path
            className="hill hill-mid"
            d="M-20,225 C160,196 320,206 480,214 C660,223 820,188 1000,206 C1100,216 1160,222 1220,226 L1220,300 L-20,300 Z"
          />
          <path
            className="hill hill-front"
            d="M-20,258 C220,242 460,250 700,252 C920,254 1060,246 1220,252 L1220,300 L-20,300 Z"
          />
        </g>

        <g className="scene-ridge">
          <path d="M120,153 C240,159 300,168 360,182" />
          <path d="M640,152 C700,158 740,164 780,168" />
          <path d="M320,205 C400,210 440,213 480,214" />
          <path d="M820,190 C900,200 950,203 1000,206" />
        </g>

        <g className="scene-trees">
          {pines.map((p, i) => (
            <g
              key={`pine-${i}`}
              transform={`translate(${p.x} ${p.y}) scale(${p.s})`}
            >
              <use href="#trunk" className="tree-trunk" />
              <use href="#pine" className="tree-body" />
            </g>
          ))}
        </g>

        <g className="scene-bushes">
          {bushes.map((b, i) => (
            <use
              key={`bush-${i}`}
              href="#bush"
              transform={`translate(${b.x} ${b.y}) scale(${b.s})`}
            />
          ))}
        </g>

        <g className="scene-rocks">
          {rocks.map((r, i) => (
            <use
              key={`rock-${i}`}
              href="#rock"
              transform={`translate(${r.x} ${r.y}) scale(${r.s})`}
            />
          ))}
        </g>

        <g className="scene-grass">
          {grass.map((g, i) => (
            <path
              key={`grass-${i}`}
              transform={`translate(${g.x} ${g.y})`}
              d="M0,3 L-3,-6 M0,3 L0,-8 M0,3 L3,-6"
            />
          ))}
        </g>

        <path className="trail-base" d={TRAIL} />
        <path className="trail-line" pathLength={1} d={TRAIL} />
      </svg>

      <div className="trail-runner" aria-hidden="true">
        <svg className="runner-shoe" viewBox="-17 -12.5 35 16.5">
          <Shoe className="runner" />
        </svg>
      </div>
    </>
  )
}
