import React, { useEffect, useRef, useState, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import './index.css'

// ── constants ──────────────────────────────────────────────────────────────────
const SCALE = 111000   // approximate degrees → meters
const RAY_COUNT = 360

// ── types ──────────────────────────────────────────────────────────────────────
interface Seg { x1: number; z1: number; x2: number; z2: number }
interface SceneData {
  buildingPositions: Float32Array
  segments: Seg[]
  streetLines: Float32Array
}

// ── coordinate helpers ─────────────────────────────────────────────────────────
function computeCenter(geojson: any): [number, number] {
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity
  for (const f of geojson.features) {
    const polys = f.geometry.type === 'MultiPolygon'
      ? f.geometry.coordinates : [f.geometry.coordinates]
    for (const poly of polys)
      for (const ring of poly)
        for (const c of ring) {
          const x = c[0] * SCALE, z = c[1] * SCALE
          if (x < minX) minX = x; if (x > maxX) maxX = x
          if (z < minZ) minZ = z; if (z > maxZ) maxZ = z
        }
  }
  return [(minX + maxX) / 2, (minZ + maxZ) / 2]
}

// ── geometry parsers ───────────────────────────────────────────────────────────
function parseBuildingGeometry(geojson: any, cx: number, cz: number) {
  const pos: number[] = []
  const segs: Seg[] = []

  for (const f of geojson.features) {
    const polys = f.geometry.type === 'MultiPolygon'
      ? f.geometry.coordinates : [f.geometry.coordinates]
    for (const poly of polys) {
      for (const ring of poly) {
        const verts = ring.map((c: number[]) => ({
          x: c[0] * SCALE - cx,
          y: c[2],                 // Three.js Y = building height
          z: c[1] * SCALE - cz,
        }))
        const n = verts.length - 1 // last vertex closes the ring

        // Triangle fan across the face polygon
        for (let i = 1; i < n - 1; i++) {
          const a = verts[0], b = verts[i], cv = verts[i + 1]
          pos.push(a.x, a.y, a.z, b.x, b.y, b.z, cv.x, cv.y, cv.z)
        }

        // Ground-level edges (y ≈ 0) become isovist wall segments
        for (let i = 0; i < n - 1; i++) {
          const a = verts[i], b = verts[i + 1]
          if (Math.abs(a.y) < 0.5 && Math.abs(b.y) < 0.5) {
            const dx = b.x - a.x, dz = b.z - a.z
            if (dx * dx + dz * dz > 0.001)
              segs.push({ x1: a.x, z1: a.z, x2: b.x, z2: b.z })
          }
        }
      }
    }
  }

  return { buildingPositions: new Float32Array(pos), segments: segs }
}

function parseStreets(geojson: any, cx: number, cz: number): Float32Array {
  const pts: number[] = []
  for (const f of geojson.features) {
    if (f.geometry.type !== 'LineString') continue
    const coords = f.geometry.coordinates
    for (let i = 0; i < coords.length - 1; i++) {
      pts.push(
        coords[i][0] * SCALE - cx,     0.05, coords[i][1] * SCALE - cz,
        coords[i+1][0] * SCALE - cx,   0.05, coords[i+1][1] * SCALE - cz,
      )
    }
  }
  return new Float32Array(pts)
}

// ── isovist ray casting ────────────────────────────────────────────────────────
function raySegIntersect(
  ox: number, oz: number, dx: number, dz: number,
  x1: number, z1: number, x2: number, z2: number
): number | null {
  const ex = x2 - x1, ez = z2 - z1
  const denom = dx * ez - dz * ex
  if (Math.abs(denom) < 1e-10) return null
  const t = ((x1 - ox) * ez - (z1 - oz) * ex) / denom
  const u = ((x1 - ox) * dz - (z1 - oz) * dx) / denom
  if (t > 1e-4 && u >= 0 && u <= 1) return t
  return null
}

function computeIsovist(
  vx: number, vz: number, segs: Seg[],
  maxRadius: number, rangeAngle: number, rotationDeg: number
): THREE.Vector2[] {
  const pts: THREE.Vector2[] = []
  const isPartial = rangeAngle < 359.9
  const startRad = (rotationDeg * Math.PI) / 180
  const rangeRad = (rangeAngle * Math.PI) / 180

  // For partial range, include viewpoint so the shape closes as a pie slice
  if (isPartial) pts.push(new THREE.Vector2(vx, vz))

  // Cast RAY_COUNT rays; for partial range include both endpoints (RAY_COUNT+1)
  const steps = RAY_COUNT
  const count = isPartial ? steps + 1 : steps
  for (let i = 0; i < count; i++) {
    const angle = startRad + (i / steps) * rangeRad
    const dx = Math.cos(angle), dz = Math.sin(angle)
    let minT = maxRadius
    for (const s of segs) {
      const t = raySegIntersect(vx, vz, dx, dz, s.x1, s.z1, s.x2, s.z2)
      if (t !== null && t < minT) minT = t
    }
    pts.push(new THREE.Vector2(vx + dx * minT, vz + dz * minT))
  }
  return pts
}

// ── scene components ───────────────────────────────────────────────────────────
function Buildings({ positions }: { positions: Float32Array }) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.computeVertexNormals()
    return g
  }, [positions])

  return (
    <mesh geometry={geo}>
      <meshLambertMaterial color="white" side={THREE.DoubleSide} />
    </mesh>
  )
}

function Streets({ points }: { points: Float32Array }) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(points, 3))
    return g
  }, [points])

  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color="#cccccc" />
    </lineSegments>
  )
}

function IsovistPolygon({ pts, color }: { pts: THREE.Vector2[], color: string }) {
  const geo = useMemo(() => {
    const shape = new THREE.Shape(pts)
    return new THREE.ShapeGeometry(shape)
  }, [pts])

  // ShapeGeometry is in XY; rotate +90° around X to lay flat on XZ ground plane
  return (
    <mesh geometry={geo} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.2, 0]}>
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.35}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}

function ViewpointMarker({ x, z }: { x: number; z: number }) {
  return (
    <mesh position={[x, 2, z]}>
      <sphereGeometry args={[2, 16, 16]} />
      <meshBasicMaterial color="#ef4444" />
    </mesh>
  )
}

function GroundPlane({ onPlace }: { onPlace: (x: number, z: number) => void }) {
  const downPos = useRef<[number, number] | null>(null)

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      onPointerDown={(e: ThreeEvent<PointerEvent>) => {
        downPos.current = [e.clientX, e.clientY]
      }}
      onPointerUp={(e: ThreeEvent<PointerEvent>) => {
        if (!downPos.current) return
        const dx = e.clientX - downPos.current[0]
        const dy = e.clientY - downPos.current[1]
        if (Math.sqrt(dx * dx + dy * dy) < 5) {
          onPlace(e.point.x, e.point.z)
        }
        downPos.current = null
      }}
    >
      <planeGeometry args={[3000, 3000]} />
      <meshBasicMaterial visible={false} side={THREE.DoubleSide} />
    </mesh>
  )
}

// ── main app ───────────────────────────────────────────────────────────────────
const panelStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  right: 0,
  width: 260,
  height: '100vh',
  background: 'rgba(255,255,255,0.93)',
  borderLeft: '1px solid #e5e7eb',
  padding: '20px 16px',
  display: 'flex',
  flexDirection: 'column',
  gap: 22,
  overflowY: 'auto',
  backdropFilter: 'blur(8px)',
  zIndex: 10,
  boxSizing: 'border-box',
  fontFamily: 'system-ui, sans-serif',
}

const labelStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  fontSize: 13,
  color: '#374151',
}

const sliderStyle: React.CSSProperties = { width: '100%', accentColor: '#3b82f6' }

export default function App() {
  const [data, setData] = useState<SceneData | null>(null)
  const [viewpoint, setViewpoint] = useState<[number, number] | null>(null)

  // Panel controls
  const [isovistColor, setIsovistColor] = useState('#3b82f6')
  const [viewDepth, setViewDepth] = useState(200)
  const [viewRange, setViewRange] = useState(360)
  const [viewRotation, setViewRotation] = useState(0)

  useEffect(() => {
    Promise.all([
      fetch('./weimar-buildings-3d.geojson').then(r => r.json()),
      fetch('./weimar-streets.geojson').then(r => r.json()),
    ]).then(([buildings, streets]) => {
      const [cx, cz] = computeCenter(buildings)
      const { buildingPositions, segments } = parseBuildingGeometry(buildings, cx, cz)
      const streetLines = parseStreets(streets, cx, cz)
      setData({ buildingPositions, segments, streetLines })
    })
  }, [])

  const isovistPts = useMemo(() => {
    if (!data || !viewpoint) return null
    return computeIsovist(viewpoint[0], viewpoint[1], data.segments, viewDepth, viewRange, viewRotation)
  }, [data, viewpoint, viewDepth, viewRange, viewRotation])

  if (!data) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100vw', height: '100vh', color: '#888' }}>
        Loading…
      </div>
    )
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        camera={{ position: [0, 350, 450], fov: 45, near: 1, far: 3000 }}
        gl={{ antialias: true }}
        onCreated={({ scene }) => { scene.background = new THREE.Color('#ffffff') }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[200, 400, 200]} intensity={0.8} />

        <Buildings positions={data.buildingPositions} />
        <Streets points={data.streetLines} />

        {isovistPts && <IsovistPolygon pts={isovistPts} color={isovistColor} />}
        {viewpoint && <ViewpointMarker x={viewpoint[0]} z={viewpoint[1]} />}

        <GroundPlane onPlace={(x, z) => setViewpoint([x, z])} />

        <OrbitControls makeDefault />
      </Canvas>

      {/* Right-hand control panel */}
      <div style={panelStyle}>
        <div style={{ fontWeight: 600, fontSize: 15, color: '#111827', marginBottom: 4 }}>
          Isovist Controls
        </div>

        <label style={labelStyle}>
          <span>Color</span>
          <input
            type="color"
            value={isovistColor}
            onChange={e => setIsovistColor(e.target.value)}
            style={{ width: 48, height: 32, border: 'none', padding: 2, cursor: 'pointer', borderRadius: 4 }}
          />
        </label>

        <label style={labelStyle}>
          <span style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>View Depth</span><span style={{ color: '#6b7280' }}>{viewDepth} m</span>
          </span>
          <input type="range" min={20} max={500} step={5} value={viewDepth}
            onChange={e => setViewDepth(+e.target.value)} style={sliderStyle} />
        </label>

        <label style={labelStyle}>
          <span style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>View Range</span><span style={{ color: '#6b7280' }}>{viewRange}°</span>
          </span>
          <input type="range" min={1} max={360} step={1} value={viewRange}
            onChange={e => setViewRange(+e.target.value)} style={sliderStyle} />
        </label>

        <label style={labelStyle}>
          <span style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Rotation</span><span style={{ color: '#6b7280' }}>{viewRotation}°</span>
          </span>
          <input type="range" min={0} max={360} step={1} value={viewRotation}
            onChange={e => setViewRotation(+e.target.value)} style={sliderStyle} />
        </label>

        {!viewpoint && (
          <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 'auto' }}>
            Click on the ground to place a viewpoint.
          </p>
        )}
      </div>

      <div style={{
        position: 'absolute',
        bottom: 16,
        left: 'calc(50% - 130px)',
        transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.55)',
        color: 'white',
        padding: '6px 14px',
        borderRadius: 8,
        fontSize: 13,
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
      }}>
        Click on the ground to place viewpoint · Drag to orbit
      </div>
    </div>
  )
}
