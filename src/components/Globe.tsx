import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Line, OrbitControls, Preload, Stars } from "@react-three/drei";
import * as THREE from "three";
import { useIsMobile, usePrefersReducedMotion } from "@/lib/hooks";

/* ---------- palette (mirrors the CSS variables in index.css) ---------- */
const col = (h: number, s: number, l: number) =>
  new THREE.Color().setHSL(h / 360, s / 100, l / 100, THREE.SRGBColorSpace);

const COLORS = {
  globe: col(224, 44, 9),
  dots: col(40, 33, 96),
  primary: col(22, 92, 62),
  accent: col(38, 96, 66),
  ocean: col(190, 70, 55),
};

const GLOBE_RADIUS = 2;

function latLongToVec3(lat: number, lon: number, radius: number) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

/* ---------- career stops rendered as destination pins ---------- */
interface Stop {
  label: string;
  sub: string;
  lat: number;
  lon: number;
}

const STOPS: Stop[] = [
  { label: "QA Engineer · Teknotrait", sub: "Bengaluru · 2017", lat: 12.97, lon: 77.59 },
  { label: "QA Engineer · Wieland IT", sub: "Bengaluru · 2019", lat: 19.07, lon: 72.87 },
  { label: "Quality Specialist · Kaleyra", sub: "Milan HQ · 2019", lat: 45.46, lon: 9.19 },
  { label: "Senior QA · SpotDraft", sub: "New York · 2022", lat: 40.71, lon: -74.0 },
  { label: "Product Manager · CallHub", sub: "Washington DC · 2025", lat: 38.9, lon: -77.03 },
  { label: "Next stop", sub: "Charting now", lat: 37.77, lon: -122.42 },
];

// arcs connect consecutive career stops
const ARC_PAIRS: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
];

/* ---------- dotted surface: one THREE.Points via Fibonacci sphere ---------- */
function GlobeDots({ count }: { count: number }) {
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    const r = GLOBE_RADIUS + 0.02;
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = golden * i;
      positions[i * 3] = Math.cos(theta) * radiusAtY * r;
      positions[i * 3 + 1] = y * r;
      positions[i * 3 + 2] = Math.sin(theta) * radiusAtY * r;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: COLORS.dots,
        size: 0.02,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.35,
        depthWrite: false,
      }),
    []
  );

  return <points geometry={geometry} material={material} />;
}

/* ---------- atmosphere: fresnel rim glow on a back-side sphere ---------- */
const atmosphereVertex = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmosphereFragment = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying vec3 vNormal;
  void main() {
    float fresnel = pow(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.5);
    vec3 tint = mix(uColorA, uColorB, clamp(vNormal.y * 0.5 + 0.5, 0.0, 1.0));
    gl_FragColor = vec4(tint, 1.0) * fresnel;
  }
`;

function Atmosphere() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: atmosphereVertex,
        fragmentShader: atmosphereFragment,
        uniforms: {
          uColorA: { value: COLORS.primary },
          uColorB: { value: COLORS.accent },
        },
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
      }),
    []
  );
  const geometry = useMemo(() => new THREE.SphereGeometry(2.15, 64, 64), []);
  return <mesh geometry={geometry} material={material} />;
}

/* ---------- destination pin with pulsing ring + hover tooltip ---------- */
function Pin({
  stop,
  index,
  frozen,
  sphereGeometry,
  ringGeometry,
}: {
  stop: Stop;
  index: number;
  frozen: boolean;
  sphereGeometry: THREE.SphereGeometry;
  ringGeometry: THREE.RingGeometry;
}) {
  const [hovered, setHovered] = useState(false);
  const ringRef = useRef<THREE.Mesh>(null);
  const ringMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: COLORS.primary,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    []
  );
  const pinMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: COLORS.primary,
        emissive: COLORS.primary,
        emissiveIntensity: 1.4,
        roughness: 0.4,
      }),
    []
  );

  const { position, quaternion } = useMemo(() => {
    const pos = latLongToVec3(stop.lat, stop.lon, GLOBE_RADIUS + 0.01);
    const q = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      pos.clone().normalize()
    );
    return { position: pos, quaternion: q };
  }, [stop]);

  useFrame(({ clock }) => {
    if (frozen || !ringRef.current) return;
    const phase = (clock.elapsedTime * 0.7 + index * 0.35) % 1;
    const s = 1 + phase * 1.6;
    ringRef.current.scale.setScalar(s);
    ringMaterial.opacity = 0.55 * (1 - phase);
  });

  return (
    <group position={position} quaternion={quaternion}>
      <mesh
        geometry={sphereGeometry}
        material={pinMaterial}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
      />
      <mesh ref={ringRef} geometry={ringGeometry} material={ringMaterial} />
      {hovered && (
        <Html center distanceFactor={6} style={{ pointerEvents: "none" }}>
          <div
            style={{
              transform: "translateY(-28px)",
              whiteSpace: "nowrap",
              background: "hsl(224 40% 10% / 0.92)",
              border: "1px solid hsl(224 30% 24%)",
              borderRadius: "10px",
              padding: "6px 10px",
              fontFamily: "'Inter', sans-serif",
              textAlign: "center",
              boxShadow: "0 4px 24px hsl(224 44% 4% / 0.6)",
            }}
          >
            <div style={{ color: "hsl(40 33% 96%)", fontSize: 12, fontWeight: 600 }}>
              {stop.label}
            </div>
            <div style={{ color: "hsl(220 14% 66%)", fontSize: 10 }}>{stop.sub}</div>
          </div>
        </Html>
      )}
    </group>
  );
}

/* ---------- animated great-circle arc with a traveling particle ---------- */
function Arc({
  from,
  to,
  index,
  frozen,
  particleGeometry,
}: {
  from: Stop;
  to: Stop;
  index: number;
  frozen: boolean;
  particleGeometry: THREE.SphereGeometry;
}) {
  const particleRef = useRef<THREE.Mesh>(null);

  const { curve, points, vertexColors } = useMemo(() => {
    const a = latLongToVec3(from.lat, from.lon, GLOBE_RADIUS + 0.01);
    const b = latLongToVec3(to.lat, to.lon, GLOBE_RADIUS + 0.01);
    const lift = GLOBE_RADIUS + 0.15 + a.distanceTo(b) * 0.28;
    const mid = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(lift);
    const c = new THREE.QuadraticBezierCurve3(a, mid, b);
    const pts = c.getPoints(48);
    const cols: [number, number, number][] = pts.map((_, i) => {
      const mixed = COLORS.primary.clone().lerp(COLORS.ocean, i / (pts.length - 1));
      return [mixed.r, mixed.g, mixed.b];
    });
    return { curve: c, points: pts, vertexColors: cols };
  }, [from, to]);

  const particleMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: COLORS.accent,
        transparent: true,
        opacity: 0.95,
      }),
    []
  );

  useFrame(({ clock }) => {
    if (frozen || !particleRef.current) return;
    const t = (clock.elapsedTime * 0.11 + index * 0.2) % 1;
    // write straight into the mesh position; no per-frame allocations
    curve.getPoint(t, particleRef.current.position);
  });

  return (
    <group>
      <Line
        points={points}
        vertexColors={vertexColors}
        lineWidth={1.4}
        transparent
        opacity={0.55}
      />
      <mesh
        ref={particleRef}
        geometry={particleGeometry}
        material={particleMaterial}
        position={points[0]}
      />
    </group>
  );
}

/* ---------- scene ---------- */
function GlobeScene({
  isMobile,
  reducedMotion,
}: {
  isMobile: boolean;
  reducedMotion: boolean;
}) {
  const dotCount = isMobile ? 800 : 1800;
  const arcs = isMobile ? ARC_PAIRS.slice(0, 3) : ARC_PAIRS;
  const frozen = reducedMotion;

  const globeGeometry = useMemo(() => new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64), []);
  const globeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: COLORS.globe,
        roughness: 0.35,
        metalness: 0.1,
      }),
    []
  );
  const pinGeometry = useMemo(() => new THREE.SphereGeometry(0.035, 16, 16), []);
  const ringGeometry = useMemo(() => new THREE.RingGeometry(0.05, 0.062, 32), []);
  const particleGeometry = useMemo(() => new THREE.SphereGeometry(0.02, 8, 8), []);

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 2, 4]} intensity={1.1} color={COLORS.accent} />
      <pointLight position={[-5, -2, -4]} intensity={0.5} color={COLORS.ocean} />

      <Stars radius={80} depth={40} count={3000} factor={2.4} saturation={0} fade speed={frozen ? 0 : 0.6} />

      <group rotation={[0.25, -0.6, 0]}>
        <mesh geometry={globeGeometry} material={globeMaterial} />
        <GlobeDots count={dotCount} />
        <Atmosphere />
        {STOPS.map((stop, i) => (
          <Pin
            key={stop.label}
            stop={stop}
            index={i}
            frozen={frozen}
            sphereGeometry={pinGeometry}
            ringGeometry={ringGeometry}
          />
        ))}
        {arcs.map(([a, b], i) => (
          <Arc
            key={`${a}-${b}`}
            from={STOPS[a]}
            to={STOPS[b]}
            index={i}
            frozen={frozen}
            particleGeometry={particleGeometry}
          />
        ))}
      </group>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={!isMobile}
        autoRotate={!frozen}
        autoRotateSpeed={0.55}
        enableDamping
        minPolarAngle={Math.PI * 0.32}
        maxPolarAngle={Math.PI * 0.68}
      />
      <Preload all />
    </>
  );
}

/* ---------- exported fixed backdrop ---------- */
export default function Globe() {
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div
      role="img"
      aria-label="Animated globe with glowing pins marking career stops and travel arcs between them"
      className="h-full w-full"
    >
      <Canvas
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        camera={{ position: [0, 0.5, 5.4], fov: 45 }}
        frameloop={reducedMotion ? "demand" : "always"}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <GlobeScene isMobile={isMobile} reducedMotion={reducedMotion} />
        </Suspense>
      </Canvas>
    </div>
  );
}
