import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  Suspense,
  type RefObject,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { CanvasBoundary } from "@/components/CanvasBoundary";
import { SKY_BANDS } from "@/config/palette";
import {
  isWebglSupported,
  useInViewport,
  useIsMobile,
  usePrefersReducedMotion,
} from "@/lib/hooks";
import { cn } from "@/lib/utils";
import type { CityId, CitySceneProps, SkyBand } from "@/types/portfolio";

/* ---------------------------------------------------------------------- */
/* Seeded, deterministic layout helpers                                    */
/* ---------------------------------------------------------------------- */

function seedFromString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash || 1;
}

/** Park-Miller LCG — deterministic per seed, no external deps. */
function createRng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function parseTriplet(triplet: string): [number, number, number] {
  const [h, s, l] = triplet.split(/\s+/).map((v) => parseFloat(v));
  return [h, s, l];
}

function toThreeColor(triplet: string): THREE.Color {
  const [h, s, l] = parseTriplet(triplet);
  return new THREE.Color().setHSL(h / 360, s / 100, l / 100);
}

const WHITE = new THREE.Color(1, 1, 1);

/* ---------------------------------------------------------------------- */
/* Building + window layout                                                */
/* ---------------------------------------------------------------------- */

interface BuildingSpec {
  x: number;
  z: number;
  width: number;
  height: number;
  depth: number;
  lightness: number;
}

function generateBuildings(city: CityId, count: number): BuildingSpec[] {
  const rng = createRng(seedFromString(`${city}-buildings-${count}`));
  const spread = 12;
  const specs: BuildingSpec[] = [];
  for (let i = 0; i < count; i++) {
    const jitter = (rng() - 0.5) * (spread / count) * 0.7;
    const x = -spread / 2 + (spread * (i + 0.5)) / count + jitter;
    const width = 0.55 + rng() * 0.75;
    const heightRange = city === "hanoi" ? 1.7 : 2.7;
    const height = 0.7 + rng() * heightRange;
    const depth = 0.55 + rng() * 0.65;
    const z = -1.8 - rng() * 2.6;
    const lightness = (rng() - 0.5) * 0.16;
    specs.push({ x, z, width, height, depth, lightness });
  }
  return specs;
}

interface WindowSpec {
  x: number;
  y: number;
  z: number;
  phase: number;
}

function generateWindows(city: CityId, buildings: BuildingSpec[]): WindowSpec[] {
  const rng = createRng(seedFromString(`${city}-windows`));
  const windows: WindowSpec[] = [];
  buildings.forEach((b) => {
    const rows = Math.max(2, Math.round(b.height * 1.8));
    for (let i = 0; i < rows; i++) {
      if (rng() > 0.55) continue;
      const wx = b.x + (rng() - 0.5) * b.width * 0.7;
      const wy = ((i + 0.5) / rows) * b.height;
      const wz = b.z + b.depth / 2 + 0.02;
      windows.push({ x: wx, y: wy, z: wz, phase: rng() * Math.PI * 2 });
    }
  });
  return windows;
}

interface CloudSpec {
  x: number;
  y: number;
  z: number;
  scale: number;
}

function generateClouds(city: CityId, count: number): CloudSpec[] {
  const rng = createRng(seedFromString(`${city}-clouds-${count}`));
  const specs: CloudSpec[] = [];
  for (let i = 0; i < count; i++) {
    specs.push({
      x: -7 + rng() * 14,
      y: 2.6 + rng() * 2,
      z: -6 - rng() * 3,
      scale: 0.9 + rng() * 1.1,
    });
  }
  return specs;
}

/* ---------------------------------------------------------------------- */
/* CSS + SVG fallback scene                                                 */
/* ---------------------------------------------------------------------- */

function generateSkylineRects(city: CityId, count: number) {
  const rng = createRng(seedFromString(`${city}-svg-skyline`));
  const rects: { x: number; width: number; height: number }[] = [];
  for (let i = 0; i < count; i++) {
    const width = 18 + rng() * 22;
    const x = (400 / count) * i + rng() * 6;
    const height = 20 + rng() * 70;
    rects.push({ x, width, height });
  }
  return rects;
}

function LandmarkSvg({ city }: { city: CityId }) {
  switch (city) {
    case "london":
      return (
        <>
          <rect x="176" y="60" width="18" height="120" />
          <circle cx="185" cy="82" r="9" fill="none" stroke="currentColor" strokeWidth="3" />
          <circle cx="270" cy="140" r="34" fill="none" stroke="currentColor" strokeWidth="4" />
        </>
      );
    case "tokyo":
      return (
        <>
          <path d="M198 180 L206 40 L214 180 Z" />
          <path d="M200 150 L212 110 L224 150 Z" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M197 175 L215 130 L233 175 Z" fill="none" stroke="currentColor" strokeWidth="2" />
        </>
      );
    case "singapore":
      return (
        <>
          <rect x="170" y="70" width="14" height="110" />
          <rect x="198" y="55" width="14" height="125" />
          <rect x="226" y="70" width="14" height="110" />
          <path
            d="M164 100 Q205 122 246 100 L246 112 Q205 134 164 112 Z"
            fill="currentColor"
          />
        </>
      );
    case "bali":
      return (
        <>
          <path d="M150 180 L150 130 L172 130 L172 110 L190 110 L190 90 L180 90 L180 180 Z" />
          <path d="M260 180 L260 130 L238 130 L238 110 L220 110 L220 90 L230 90 L230 180 Z" />
          <path d="M100 180 L100 100" stroke="currentColor" strokeWidth="3" fill="none" />
          <path
            d="M100 100 L84 92 M100 100 L116 92 M100 100 L100 84"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
          />
          <path d="M320 180 L320 108" stroke="currentColor" strokeWidth="3" fill="none" />
          <path
            d="M320 108 L306 100 M320 108 L334 100 M320 108 L320 92"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
          />
        </>
      );
    case "hanoi":
      return (
        <>
          <path d="M205 40 L235 66 L175 66 Z" />
          <rect x="190" y="66" width="30" height="16" />
          <path d="M205 82 L245 108 L165 108 Z" />
          <rect x="182" y="108" width="46" height="16" />
          <path d="M205 124 L255 150 L155 150 Z" />
          <rect x="174" y="150" width="62" height="30" />
        </>
      );
    case "bangalore":
    default:
      return (
        <>
          <path d="M150 180 L150 140 A28 28 0 0 1 206 140 L206 180 Z" />
          <path d="M214 180 L214 150 A20 20 0 0 1 254 150 L254 180 Z" />
          <rect x="266" y="96" width="34" height="84" />
          <rect x="304" y="118" width="26" height="62" />
        </>
      );
  }
}

function FallbackScene({ city, sky }: { city: CityId; sky: SkyBand }) {
  const skylineRects = useMemo(() => generateSkylineRects(city, 9), [city]);
  const gradient = `linear-gradient(to bottom, hsl(${sky.stops[0]}) 0%, hsl(${sky.stops[1]}) 33%, hsl(${sky.stops[2]}) 66%, hsl(${sky.stops[3]}) 100%)`;
  const silhouette = `hsl(${sky.silhouette})`;

  return (
    <div className="absolute inset-0 z-0" style={{ background: gradient }}>
      <svg
        viewBox="0 0 400 200"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-full w-full"
        style={{ color: silhouette }}
      >
        <g fill={silhouette}>
          {skylineRects.map((r, i) => (
            <rect key={i} x={r.x} y={200 - r.height} width={r.width} height={r.height} />
          ))}
        </g>
        <g fill={silhouette}>
          <LandmarkSvg city={city} />
        </g>
      </svg>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Low-poly landmarks (real 3D geometry)                                    */
/* ---------------------------------------------------------------------- */

function Landmark({
  city,
  baseColor,
  glowColor,
}: {
  city: CityId;
  baseColor: THREE.Color;
  glowColor: THREE.Color;
}) {
  const bodyProps = { color: baseColor, roughness: 0.85, metalness: 0.05, flatShading: true };
  const glowProps = {
    color: glowColor,
    emissive: glowColor,
    emissiveIntensity: 1.1,
    toneMapped: false,
  };

  switch (city) {
    case "london":
      return (
        <group position={[0, 0, -0.6]}>
          <mesh position={[-0.6, 1.5, 0]}>
            <boxGeometry args={[0.55, 3, 0.55]} />
            <meshStandardMaterial {...bodyProps} />
          </mesh>
          <mesh position={[-0.6, 1.7, 0.28]}>
            <cylinderGeometry args={[0.16, 0.16, 0.05, 12]} />
            <meshStandardMaterial {...glowProps} />
          </mesh>
          <mesh position={[-0.6, 3.05, 0]}>
            <coneGeometry args={[0.32, 0.4, 4]} />
            <meshStandardMaterial {...bodyProps} />
          </mesh>
          <mesh position={[1.1, 0.95, -0.4]} rotation={[0, 0, 0]}>
            <torusGeometry args={[0.85, 0.045, 8, 24]} />
            <meshStandardMaterial {...bodyProps} />
          </mesh>
          <mesh position={[1.1, 0.95, -0.4]}>
            <cylinderGeometry args={[0.06, 0.06, 1.7, 6]} />
            <meshStandardMaterial {...bodyProps} />
          </mesh>
        </group>
      );
    case "tokyo":
      return (
        <group position={[0, 0, -0.4]}>
          <mesh position={[0, 1.7, 0]}>
            <cylinderGeometry args={[0.08, 0.5, 3.4, 4]} />
            <meshStandardMaterial {...bodyProps} />
          </mesh>
          <mesh position={[0, 0.55, 0]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[1.1, 0.06, 0.06]} />
            <meshStandardMaterial {...bodyProps} />
          </mesh>
          <mesh position={[0, 0.55, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <boxGeometry args={[1.1, 0.06, 0.06]} />
            <meshStandardMaterial {...bodyProps} />
          </mesh>
          <mesh position={[0, 1.15, 0]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.75, 0.05, 0.05]} />
            <meshStandardMaterial {...bodyProps} />
          </mesh>
          <mesh position={[0, 1.15, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <boxGeometry args={[0.75, 0.05, 0.05]} />
            <meshStandardMaterial {...bodyProps} />
          </mesh>
          <mesh position={[0, 3.5, 0]}>
            <sphereGeometry args={[0.09, 6, 6]} />
            <meshStandardMaterial {...glowProps} />
          </mesh>
        </group>
      );
    case "singapore":
      return (
        <group position={[0, 0, -0.7]}>
          {[-0.55, 0, 0.55].map((x, i) => (
            <mesh key={i} position={[x, 1.1 + (i === 1 ? 0.15 : 0), 0]}>
              <cylinderGeometry args={[0.16, 0.2, 2.2 + (i === 1 ? 0.3 : 0), 6]} />
              <meshStandardMaterial {...bodyProps} />
            </mesh>
          ))}
          <mesh position={[0, 1.95, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.62, 0.09, 8, 16, Math.PI]} />
            <meshStandardMaterial {...glowProps} />
          </mesh>
        </group>
      );
    case "bali":
      return (
        <group position={[0, 0, -0.5]}>
          {[-1, 1].map((side) => (
            <group key={side} position={[side * 0.55, 0, 0]} scale={[side, 1, 1]}>
              <mesh position={[0, 0.4, 0]}>
                <boxGeometry args={[0.55, 0.8, 0.4]} />
                <meshStandardMaterial {...bodyProps} />
              </mesh>
              <mesh position={[0.08, 1.05, 0]}>
                <boxGeometry args={[0.4, 0.6, 0.3]} />
                <meshStandardMaterial {...bodyProps} />
              </mesh>
              <mesh position={[0.14, 1.55, 0]}>
                <boxGeometry args={[0.28, 0.4, 0.22]} />
                <meshStandardMaterial {...bodyProps} />
              </mesh>
              <mesh position={[0.18, 1.9, 0]}>
                <coneGeometry args={[0.2, 0.4, 4]} />
                <meshStandardMaterial {...glowProps} />
              </mesh>
            </group>
          ))}
          {[-2.1, -1.55, 2.3].map((x, i) => (
            <group key={i} position={[x, 0, -0.3 - i * 0.15]}>
              <mesh position={[0, 0.55, 0]}>
                <cylinderGeometry args={[0.045, 0.06, 1.1, 6]} />
                <meshStandardMaterial {...bodyProps} />
              </mesh>
              {[0, 1, 2].map((f) => (
                <mesh
                  key={f}
                  position={[Math.sin(f * 2.1) * 0.18, 1.1 + f * 0.02, Math.cos(f * 2.1) * 0.18]}
                  rotation={[0.3, f * 2.1, 0]}
                >
                  <coneGeometry args={[0.12, 0.4, 3]} />
                  <meshStandardMaterial {...bodyProps} />
                </mesh>
              ))}
            </group>
          ))}
        </group>
      );
    case "hanoi":
      return (
        <group position={[0, 0, -0.6]}>
          {[0, 1, 2, 3].map((tier) => {
            const width = 1.1 - tier * 0.2;
            const y = tier * 0.55;
            return (
              <group key={tier} position={[0, y, 0]}>
                <mesh position={[0, 0.18, 0]}>
                  <cylinderGeometry args={[width * 0.4, width * 0.4, 0.36, 8]} />
                  <meshStandardMaterial {...bodyProps} />
                </mesh>
                <mesh position={[0, 0.42, 0]}>
                  <coneGeometry args={[width * 0.65, 0.3, 8]} />
                  <meshStandardMaterial {...bodyProps} />
                </mesh>
              </group>
            );
          })}
          <mesh position={[0, 2.55, 0]}>
            <sphereGeometry args={[0.07, 6, 6]} />
            <meshStandardMaterial {...glowProps} />
          </mesh>
        </group>
      );
    case "bangalore":
    default:
      return (
        <group position={[0, 0, -0.6]}>
          <mesh position={[-0.5, 0.35, 0]}>
            <cylinderGeometry args={[0.42, 0.42, 0.3, 10]} />
            <meshStandardMaterial {...bodyProps} />
          </mesh>
          <mesh position={[-0.5, 0.5, 0]}>
            <sphereGeometry args={[0.42, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial {...bodyProps} />
          </mesh>
          <mesh position={[0.15, 0.22, -0.15]}>
            <cylinderGeometry args={[0.28, 0.28, 0.18, 10]} />
            <meshStandardMaterial {...bodyProps} />
          </mesh>
          <mesh position={[0.15, 0.36, -0.15]}>
            <sphereGeometry args={[0.28, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial {...bodyProps} />
          </mesh>
          <mesh position={[0.95, 1.1, -0.3]}>
            <boxGeometry args={[0.55, 2.1, 0.5]} />
            <meshStandardMaterial {...glowProps} emissiveIntensity={0.35} />
          </mesh>
        </group>
      );
  }
}

/* ---------------------------------------------------------------------- */
/* Window twinkle shader                                                    */
/* ---------------------------------------------------------------------- */

const WINDOW_VERTEX_SHADER = `
  attribute float phase;
  uniform float uTime;
  uniform float uFrozen;
  varying float vBrightness;
  void main() {
    float osc = 0.5 + 0.5 * sin(uTime * 1.6 + phase);
    vBrightness = mix(osc, 0.75, uFrozen);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = 46.0 / -mvPosition.z;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const WINDOW_FRAGMENT_SHADER = `
  uniform vec3 uColor;
  varying float vBrightness;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    if (length(uv) > 0.5) discard;
    gl_FragColor = vec4(uColor * vBrightness, vBrightness);
  }
`;

function WindowLights({
  windows,
  glowColor,
  reducedMotion,
}: {
  windows: WindowSpec[];
  glowColor: THREE.Color;
  reducedMotion: boolean;
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const { positions, phases } = useMemo(() => {
    const pos = new Float32Array(windows.length * 3);
    const ph = new Float32Array(windows.length);
    windows.forEach((w, i) => {
      pos[i * 3] = w.x;
      pos[i * 3 + 1] = w.y;
      pos[i * 3 + 2] = w.z;
      ph[i] = w.phase;
    });
    return { positions: pos, phases: ph };
  }, [windows]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: glowColor.clone() },
      uFrozen: { value: reducedMotion ? 1 : 0 },
    }),
    [glowColor]
  );

  useEffect(() => {
    uniforms.uFrozen.value = reducedMotion ? 1 : 0;
  }, [reducedMotion, uniforms]);

  useFrame((state) => {
    if (reducedMotion || !materialRef.current) return;
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-phase" args={[phases, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={WINDOW_VERTEX_SHADER}
        fragmentShader={WINDOW_FRAGMENT_SHADER}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ---------------------------------------------------------------------- */
/* Buildings (instanced)                                                    */
/* ---------------------------------------------------------------------- */

function Buildings({
  buildings,
  baseColor,
  groupRef,
}: {
  buildings: BuildingSpec[];
  baseColor: THREE.Color;
  groupRef: RefObject<THREE.Group>;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    buildings.forEach((b, i) => {
      dummy.position.set(b.x, b.height / 2 - 0.55, b.z);
      dummy.scale.set(b.width, b.height, b.depth);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      color.copy(baseColor).offsetHSL(0, 0, b.lightness);
      mesh.setColorAt(i, color);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [buildings, baseColor]);

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, buildings.length]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.9} metalness={0.03} flatShading />
      </instancedMesh>
    </group>
  );
}

/* ---------------------------------------------------------------------- */
/* Clouds + plane                                                           */
/* ---------------------------------------------------------------------- */

function Clouds({
  clouds,
  color,
  groupRef,
}: {
  clouds: CloudSpec[];
  color: THREE.Color;
  groupRef: RefObject<THREE.Group>;
}) {
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1, 0), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        transparent: true,
        opacity: 0.55,
        flatShading: true,
        roughness: 1,
      }),
    [color]
  );

  return (
    <group ref={groupRef}>
      {clouds.map((c, i) => (
        <mesh
          key={i}
          position={[c.x, c.y, c.z]}
          scale={[c.scale * 1.4, c.scale * 0.55, c.scale]}
          geometry={geometry}
          material={material}
        />
      ))}
    </group>
  );
}

function Plane({
  planeRef,
  color,
  visible,
}: {
  planeRef: RefObject<THREE.Mesh>;
  color: THREE.Color;
  visible: boolean;
}) {
  const geometry = useMemo(() => new THREE.ConeGeometry(0.05, 0.32, 3), []);
  const material = useMemo(() => new THREE.MeshBasicMaterial({ color }), [color]);

  return (
    <mesh
      ref={planeRef}
      geometry={geometry}
      material={material}
      rotation={[0, 0, -Math.PI / 2]}
      visible={visible}
    />
  );
}

/* ---------------------------------------------------------------------- */
/* Parallax                                                                 */
/* ---------------------------------------------------------------------- */

function useParallaxTargets(rootRef: RefObject<HTMLDivElement>, reducedMotion: boolean) {
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start end", "end start"],
  });
  const buildingsY = useTransform(scrollYProgress, [0, 1], [-14, 14]);
  const cloudsY = useTransform(scrollYProgress, [0, 1], [-45, 45]);

  const buildingsTarget = useRef(0);
  const cloudsTarget = useRef(0);

  useMotionValueEvent(buildingsY, "change", (v) => {
    if (!reducedMotion) buildingsTarget.current = v;
  });
  useMotionValueEvent(cloudsY, "change", (v) => {
    if (!reducedMotion) cloudsTarget.current = v;
  });

  return { buildingsTarget, cloudsTarget };
}

/* ---------------------------------------------------------------------- */
/* Scene                                                                    */
/* ---------------------------------------------------------------------- */

function Scene({
  city,
  sky,
  isMobile,
  reducedMotion,
  rootRef,
}: {
  city: CityId;
  sky: SkyBand;
  isMobile: boolean;
  reducedMotion: boolean;
  rootRef: RefObject<HTMLDivElement>;
}) {
  const buildingCount = isMobile ? 10 : 20;
  const cloudCount = isMobile ? 2 : 6;

  const buildings = useMemo(() => generateBuildings(city, buildingCount), [city, buildingCount]);
  const windows = useMemo(
    () => (isMobile ? [] : generateWindows(city, buildings)),
    [city, buildings, isMobile]
  );
  const clouds = useMemo(() => generateClouds(city, cloudCount), [city, cloudCount]);

  const silhouetteColor = useMemo(() => toThreeColor(sky.silhouette), [sky.silhouette]);
  const glowColor = useMemo(() => toThreeColor(sky.glow), [sky.glow]);
  const cloudColor = useMemo(() => toThreeColor(sky.stops[0]).lerp(WHITE, 0.4), [sky.stops]);
  const planeColor = useMemo(
    () => silhouetteColor.clone().lerp(WHITE, 0.35),
    [silhouetteColor]
  );

  const buildingsGroupRef = useRef<THREE.Group>(null);
  const cloudsGroupRef = useRef<THREE.Group>(null);
  const planeRef = useRef<THREE.Mesh>(null);

  const { buildingsTarget, cloudsTarget } = useParallaxTargets(rootRef, reducedMotion);

  useFrame((state, delta) => {
    const lerpFactor = Math.min(1, delta * 4);

    if (buildingsGroupRef.current) {
      const target = reducedMotion ? 0 : buildingsTarget.current * 0.02;
      buildingsGroupRef.current.position.y = THREE.MathUtils.lerp(
        buildingsGroupRef.current.position.y,
        target,
        lerpFactor
      );
    }

    if (cloudsGroupRef.current) {
      const target = reducedMotion ? 0 : cloudsTarget.current * 0.02;
      cloudsGroupRef.current.position.y = THREE.MathUtils.lerp(
        cloudsGroupRef.current.position.y,
        target,
        lerpFactor
      );
      if (!reducedMotion) {
        cloudsGroupRef.current.children.forEach((cloud, i) => {
          cloud.position.x += delta * 0.06 * (i % 2 === 0 ? 1 : -1);
          if (cloud.position.x > 8) cloud.position.x = -8;
          if (cloud.position.x < -8) cloud.position.x = 8;
        });
      }
    }

    if (planeRef.current && !isMobile && !reducedMotion) {
      const period = 52;
      const p = (state.clock.elapsedTime % period) / period;
      planeRef.current.position.set(-9 + p * 18, 3.3 + Math.sin(p * Math.PI) * 1.1, -5);
      planeRef.current.rotation.z = -Math.PI / 2 + Math.cos(p * Math.PI) * 0.15;
    }
  });

  return (
    <>
      <ambientLight intensity={0.7} color={0xffffff} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} color={glowColor} />

      <Buildings buildings={buildings} baseColor={silhouetteColor} groupRef={buildingsGroupRef} />
      <Landmark city={city} baseColor={silhouetteColor} glowColor={glowColor} />
      {!isMobile && windows.length > 0 && (
        <WindowLights windows={windows} glowColor={glowColor} reducedMotion={reducedMotion} />
      )}
      <Clouds clouds={clouds} color={cloudColor} groupRef={cloudsGroupRef} />
      {!isMobile && (
        <Plane planeRef={planeRef} color={planeColor} visible={!reducedMotion} />
      )}
    </>
  );
}

/* ---------------------------------------------------------------------- */
/* Public component                                                         */
/* ---------------------------------------------------------------------- */

export default function CityScene({ city, timeOfDay, className }: CitySceneProps) {
  const [rootRef, inView] = useInViewport<HTMLDivElement>();
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();
  const [canvasReady, setCanvasReady] = useState(false);

  const sky = SKY_BANDS[timeOfDay];
  const canRender3D = inView && isWebglSupported();

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <FallbackScene city={city} sky={sky} />

      {canRender3D && (
        <div
          className="absolute inset-0 z-10"
          style={{ opacity: canvasReady ? 1 : 0, transition: "opacity 700ms ease" }}
        >
          <CanvasBoundary fallback={null}>
            <Suspense fallback={null}>
              <Canvas
                dpr={isMobile ? [1, 1] : [1, 2]}
                gl={{ antialias: true, alpha: true }}
                camera={{ position: [0, 1.1, 6], fov: 42 }}
                onCreated={() => setCanvasReady(true)}
              >
                <Scene
                  city={city}
                  sky={sky}
                  isMobile={isMobile}
                  reducedMotion={reducedMotion}
                  rootRef={rootRef}
                />
              </Canvas>
            </Suspense>
          </CanvasBoundary>
        </div>
      )}
    </div>
  );
}
