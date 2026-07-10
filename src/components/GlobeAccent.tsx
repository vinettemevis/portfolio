import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { CanvasBoundary } from "./CanvasBoundary";
import { useIsMobile, usePrefersReducedMotion, isWebglSupported } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import type { GlobeAccentProps } from "@/types/portfolio";

const EARTH_DAY_URL = "https://unpkg.com/three-globe/example/img/earth-day.jpg";
const EARTH_BUMP_URL = "https://unpkg.com/three-globe/example/img/earth-topology.png";

const GLOBE_RADIUS = 1.4;
// Single unlabeled marker dot; never attach a label/tooltip to this.
const BENGALURU_LAT_LNG: [number, number] = [12.97, 77.59];

function latLngToVec3(lat: number, lng: number, radius: number) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

const atmosphereVertex = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmosphereFragment = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    float fresnel = pow(max(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 2.6);
    vec3 glow = mix(vec3(0.55, 0.78, 1.0), vec3(1.0, 1.0, 1.0), fresnel);
    gl_FragColor = vec4(glow, fresnel * 0.9);
  }
`;

interface GlobeSphereProps {
  segments: number;
  frozen: boolean;
}

/**
 * useLoader throws-to-suspend while pending and rejects-to-error-boundary on
 * a load failure (offline / blocked host / CORS), so a bad texture URL falls
 * through to the same procedural fallback as a missing WebGL context instead
 * of ever rendering a black sphere.
 */
function GlobeSphere({ segments, frozen }: GlobeSphereProps) {
  const [dayMap, bumpMap] = useLoader(THREE.TextureLoader, [
    EARTH_DAY_URL,
    EARTH_BUMP_URL,
  ]) as THREE.Texture[];

  const groupRef = useRef<THREE.Group>(null);

  const globeGeometry = useMemo(
    () => new THREE.SphereGeometry(GLOBE_RADIUS, segments, segments),
    [segments]
  );

  const globeMaterial = useMemo(() => {
    dayMap.colorSpace = THREE.SRGBColorSpace;
    return new THREE.MeshStandardMaterial({
      map: dayMap,
      bumpMap,
      bumpScale: 0.02,
      roughness: 0.75,
      metalness: 0.05,
    });
  }, [dayMap, bumpMap]);

  const atmosphereGeometry = useMemo(
    () => new THREE.SphereGeometry(GLOBE_RADIUS * 1.09, segments, segments),
    [segments]
  );

  const atmosphereMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: atmosphereVertex,
        fragmentShader: atmosphereFragment,
        transparent: true,
        depthWrite: false,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  const dotGeometry = useMemo(() => new THREE.SphereGeometry(GLOBE_RADIUS * 0.02, 12, 12), []);
  const dotMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ffd27a",
        emissive: "#ffb347",
        emissiveIntensity: 1.4,
        roughness: 0.4,
      }),
    []
  );
  const dotPosition = useMemo(
    () => latLngToVec3(BENGALURU_LAT_LNG[0], BENGALURU_LAT_LNG[1], GLOBE_RADIUS * 1.01),
    []
  );

  useFrame((_state, delta) => {
    if (frozen) return;
    const group = groupRef.current;
    if (!group) return;
    group.rotation.y += delta * 0.08;
  });

  return (
    <group ref={groupRef}>
      <mesh geometry={globeGeometry} material={globeMaterial} />
      <mesh geometry={atmosphereGeometry} material={atmosphereMaterial} />
      <mesh geometry={dotGeometry} material={dotMaterial} position={dotPosition} />
    </group>
  );
}

function GlobeFallback() {
  return (
    <div
      className="h-full w-full rounded-full"
      style={{
        backgroundImage: [
          "radial-gradient(ellipse 26% 16% at 32% 38%, rgba(158,206,140,0.85), transparent 70%)",
          "radial-gradient(ellipse 20% 13% at 60% 30%, rgba(190,218,142,0.75), transparent 70%)",
          "radial-gradient(ellipse 16% 20% at 54% 64%, rgba(172,204,132,0.7), transparent 70%)",
          "radial-gradient(ellipse 13% 9% at 24% 60%, rgba(206,192,144,0.6), transparent 70%)",
          "radial-gradient(circle at 30% 28%, #f2f9ff 0%, #a9d6f7 20%, #5fa8e6 44%, #2f7dc4 70%, #1a5490 100%)",
        ].join(", "),
        boxShadow:
          "0 0 30px 4px rgba(130,195,255,0.4), inset -10px -12px 26px rgba(10,40,80,0.28)",
      }}
    />
  );
}

export default function GlobeAccent({ placement, className }: GlobeAccentProps) {
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();
  const segments = placement === "hero-corner" ? (isMobile ? 32 : 48) : isMobile ? 24 : 36;

  if (!isWebglSupported()) {
    return (
      <div
        role="img"
        aria-label="Small decorative rotating globe"
        className={cn("relative h-full w-full", className)}
      >
        <GlobeFallback />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label="Small decorative rotating globe"
      className={cn("relative h-full w-full", className)}
    >
      <CanvasBoundary fallback={<GlobeFallback />}>
        <Suspense fallback={<GlobeFallback />}>
          <Canvas
            dpr={isMobile ? [1, 1] : [1, 1.5]}
            camera={{ position: [0, 0, 3.2], fov: 40 }}
            gl={{ antialias: true, alpha: true }}
          >
            <ambientLight intensity={0.9} />
            <directionalLight position={[3, 2, 4]} intensity={1.3} color="#fff2df" />
            <GlobeSphere segments={segments} frozen={reducedMotion} />
          </Canvas>
        </Suspense>
      </CanvasBoundary>
    </div>
  );
}
