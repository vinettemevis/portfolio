/**
 * A soft, painterly valley — distant mountains, rolling hills, a
 * winding stream and scattered wildflowers — standing in for a photo
 * background using only layered SVG, gradients and a touch of blur.
 */

const FLOWERS: { x: number; y: number; color: string; s: number }[] = [
  { x: 60, y: 660, color: "#f3a13a", s: 1 },
  { x: 130, y: 690, color: "#fdfaf1", s: 0.85 },
  { x: 240, y: 645, color: "#f3a13a", s: 0.8 },
  { x: 340, y: 685, color: "#c9b6e6", s: 0.9 },
  { x: 520, y: 655, color: "#fdfaf1", s: 0.75 },
  { x: 610, y: 690, color: "#f3a13a", s: 0.85 },
  { x: 980, y: 660, color: "#c9b6e6", s: 0.8 },
  { x: 1080, y: 640, color: "#fdfaf1", s: 0.75 },
  { x: 1220, y: 685, color: "#f3a13a", s: 0.9 },
  { x: 1380, y: 655, color: "#fdfaf1", s: 0.8 },
  { x: 1480, y: 690, color: "#c9b6e6", s: 0.85 },
];

function Flower({ x, y, color, s }: (typeof FLOWERS)[number]) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} opacity={0.9}>
      <path d="M0,0 L0,10" stroke="#4d7a3a" strokeWidth={2} strokeLinecap="round" />
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse
          key={a}
          cx={0}
          cy={-6}
          rx={3.2}
          ry={5.5}
          fill={color}
          transform={`rotate(${a})`}
        />
      ))}
      <circle cx={0} cy={0} r={2.4} fill="#e9a63f" />
    </g>
  );
}

export default function GardenScene() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1600 700"
      preserveAspectRatio="xMidYMax slice"
      className="absolute inset-0 h-full w-full"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#eef7f1" />
          <stop offset="55%" stopColor="#dcebe0" />
          <stop offset="100%" stopColor="#cfe4d4" />
        </linearGradient>
        <linearGradient id="hillsBack" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9dc17f" />
          <stop offset="100%" stopColor="#84ac66" />
        </linearGradient>
        <linearGradient id="hillsMid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7fac5c" />
          <stop offset="100%" stopColor="#699149" />
        </linearGradient>
        <linearGradient id="hillsFront" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5f8f43" />
          <stop offset="100%" stopColor="#4c7635" />
        </linearGradient>
        <linearGradient id="water" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#dff0ec" />
          <stop offset="100%" stopColor="#b9dedb" />
        </linearGradient>
        <radialGradient id="sunGlow" cx="22%" cy="12%" r="55%">
          <stop offset="0%" stopColor="#fff6df" stopOpacity={0.55} />
          <stop offset="100%" stopColor="#fff6df" stopOpacity={0} />
        </radialGradient>
        <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      <rect x={0} y={0} width={1600} height={700} fill="url(#sky)" />

      {/* distant peaks */}
      <path
        d="M0,420 L90,300 L180,380 L270,240 L350,340 L430,255 L530,370
           L630,275 L730,400 L830,265 L920,360 L1010,245 L1110,350
           L1230,255 L1330,380 L1430,295 L1600,400 L1600,700 L0,700 Z"
        fill="#b7cddd"
        opacity={0.65}
        filter="url(#soft)"
      />
      <path
        d="M0,480 L110,380 L230,460 L350,360 L470,450 L590,370 L710,470
           L830,380 L960,460 L1090,370 L1210,460 L1330,390 L1450,470
           L1600,420 L1600,700 L0,700 Z"
        fill="#a2bfcf"
        opacity={0.75}
        filter="url(#soft)"
      />

      {/* rolling hills, back to front */}
      <path
        d="M0,510 C220,465 420,555 640,495 C840,445 1040,535 1240,485
           C1400,450 1520,505 1600,475 L1600,700 L0,700 Z"
        fill="url(#hillsBack)"
      />
      <path
        d="M0,575 C260,530 460,610 680,555 C880,515 1080,595 1280,545
           C1420,515 1520,565 1600,545 L1600,700 L0,700 Z"
        fill="url(#hillsMid)"
      />

      {/* trees, tucked into the mid hill */}
      <g opacity={0.92}>
        {[
          { x: 120, y: 540 },
          { x: 175, y: 565 },
          { x: 90, y: 575 },
        ].map((t, i) => (
          <g key={i} transform={`translate(${t.x},${t.y})`}>
            <rect x={-3} y={10} width={6} height={22} fill="#5c4630" />
            <circle cx={0} cy={0} r={26} fill="#5f8f43" />
            <circle cx={-8} cy={-8} r={14} fill="#79a858" opacity={0.8} />
          </g>
        ))}
      </g>

      {/* foreground grass the character stands on */}
      <path
        d="M0,640 C300,605 600,650 900,620 C1150,598 1400,635 1600,615
           L1600,700 L0,700 Z"
        fill="url(#hillsFront)"
      />

      {/* stream */}
      <path
        d="M420,470 C520,510 470,550 590,575 C700,598 660,630 780,650
           C860,665 900,680 1000,690"
        fill="none"
        stroke="url(#water)"
        strokeWidth={22}
        strokeLinecap="round"
        opacity={0.85}
      />
      <path
        d="M420,470 C520,510 470,550 590,575 C700,598 660,630 780,650
           C860,665 900,680 1000,690"
        fill="none"
        stroke="#f4fbf9"
        strokeWidth={3}
        strokeLinecap="round"
        opacity={0.5}
      />

      {FLOWERS.map((f, i) => (
        <Flower key={i} {...f} />
      ))}

      <rect x={0} y={0} width={1600} height={700} fill="url(#sunGlow)" />
    </svg>
  );
}
