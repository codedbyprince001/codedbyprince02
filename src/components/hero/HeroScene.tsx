import { useEffect, useMemo, useRef } from 'react'
import type { ReactNode } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Float, Lightformer } from '@react-three/drei'
import * as THREE from 'three'

interface HeroSceneProps {
  active: boolean
  reducedMotion: boolean
  finePointer: boolean
  onContextLost: () => void
}

const LIME = '#c8ff2e'
const VAULT_SIZE = 3.3
const BASE_SCENE_WIDTH = 6.8

function createCoinFace(): THREE.CanvasTexture {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return new THREE.CanvasTexture(canvas)

  const base = ctx.createRadialGradient(size * 0.4, size * 0.35, 20, size / 2, size / 2, size * 0.7)
  base.addColorStop(0, '#f6f6ef')
  base.addColorStop(0.55, '#c9c9c0')
  base.addColorStop(1, '#8d8d86')
  ctx.fillStyle = base
  ctx.fillRect(0, 0, size, size)

  ctx.strokeStyle = 'rgba(20,20,18,0.55)'
  ctx.lineWidth = 6
  ctx.beginPath()
  ctx.arc(size / 2, size / 2, size * 0.4, 0, Math.PI * 2)
  ctx.stroke()
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(size / 2, size / 2, size * 0.36, 0, Math.PI * 2)
  ctx.stroke()

  ctx.fillStyle = '#161614'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `700 ${size * 0.5}px "Bricolage Grotesque Variable", system-ui, sans-serif`
  ctx.fillText('₦', size / 2, size / 2 + size * 0.02)

  ctx.fillStyle = 'rgba(22,22,20,0.7)'
  ctx.font = `600 ${size * 0.05}px "JetBrains Mono Variable", monospace`
  ctx.fillText('LAST KNOWN COIN', size / 2, size * 0.8)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  return texture
}

function Coin({ speed }: { speed: number }) {
  const spin = useRef<THREE.Group>(null)
  const face = useMemo(() => createCoinFace(), [])

  useEffect(() => () => face.dispose(), [face])

  useFrame((_, delta) => {
    if (spin.current) spin.current.rotation.y += delta * speed
  })

  return (
    <group ref={spin}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[1, 1, 0.16, 96]} />
        <meshStandardMaterial attach="material-0" color="#d8d8d0" metalness={1} roughness={0.16} />
        <meshStandardMaterial attach="material-1" map={face} metalness={0.85} roughness={0.2} envMapIntensity={1.3} />
        <meshStandardMaterial attach="material-2" map={face} metalness={0.85} roughness={0.2} envMapIntensity={1.3} />
      </mesh>
      {[0.085, -0.085].map((z) => (
        <mesh key={z} position={[0, 0, z]}>
          <torusGeometry args={[0.95, 0.025, 12, 96]} />
          <meshStandardMaterial color="#e4e4dc" metalness={1} roughness={0.12} />
        </mesh>
      ))}
    </group>
  )
}

function Vault({ speed }: { speed: number }) {
  const outer = useRef<THREE.Group>(null)
  const inner = useRef<THREE.Group>(null)

  const outerEdges = useMemo(
    () => new THREE.EdgesGeometry(new THREE.BoxGeometry(VAULT_SIZE, VAULT_SIZE, VAULT_SIZE)),
    [],
  )
  const innerEdges = useMemo(
    () => new THREE.EdgesGeometry(new THREE.BoxGeometry(VAULT_SIZE * 0.72, VAULT_SIZE * 0.72, VAULT_SIZE * 0.72)),
    [],
  )

  useEffect(
    () => () => {
      outerEdges.dispose()
      innerEdges.dispose()
    },
    [outerEdges, innerEdges],
  )

  useFrame((_, delta) => {
    if (outer.current) {
      outer.current.rotation.y += delta * speed * 0.35
      outer.current.rotation.x += delta * speed * 0.12
    }
    if (inner.current) {
      inner.current.rotation.y -= delta * speed * 0.6
      inner.current.rotation.z += delta * speed * 0.2
    }
  })

  return (
    <>
      <group ref={outer}>
        <lineSegments geometry={outerEdges}>
          <lineBasicMaterial color={LIME} transparent opacity={0.7} />
        </lineSegments>
        <mesh>
          <boxGeometry args={[VAULT_SIZE, VAULT_SIZE, VAULT_SIZE]} />
          <meshPhysicalMaterial
            color={LIME}
            transparent
            opacity={0.045}
            roughness={0.08}
            metalness={0.2}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </group>
      <group ref={inner}>
        <lineSegments geometry={innerEdges}>
          <lineBasicMaterial color="#f1e9d6" transparent opacity={0.22} />
        </lineSegments>
      </group>
    </>
  )
}

function OrbitRing({ radius, tilt, speed, phase }: { radius: number; tilt: [number, number]; speed: number; phase: number }) {
  const dot = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (dot.current) dot.current.rotation.z += delta * speed
  })

  return (
    <group rotation={[tilt[0], tilt[1], 0]}>
      <mesh>
        <torusGeometry args={[radius, 0.004, 6, 180]} />
        <meshBasicMaterial color={LIME} transparent opacity={0.35} />
      </mesh>
      <group ref={dot} rotation={[0, 0, phase]}>
        <mesh position={[radius, 0, 0]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color={LIME} />
        </mesh>
      </group>
    </group>
  )
}

function Rig({ children, followPointer }: { children: ReactNode; followPointer: boolean }) {
  const group = useRef<THREE.Group>(null)
  const target = useRef({ x: 0, y: 0 })
  const width = useThree((state) => state.size.width)
  const height = useThree((state) => state.size.height)
  const aspect = width / Math.max(height, 1)

  useEffect(() => {
    if (!followPointer) return
    const onMove = (event: PointerEvent) => {
      target.current.x = (event.clientX / window.innerWidth) * 2 - 1
      target.current.y = (event.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [followPointer])

  useFrame((state, delta) => {
    const node = group.current
    if (!node) return
    const idleX = followPointer ? 0 : Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    const idleY = followPointer ? 0 : Math.cos(state.clock.elapsedTime * 0.4) * 0.14
    node.rotation.y = THREE.MathUtils.damp(node.rotation.y, target.current.x * 0.38 + idleY, 3, delta)
    node.rotation.x = THREE.MathUtils.damp(node.rotation.x, target.current.y * 0.22 + idleX, 3, delta)
  })

  const visibleWidth = 2 * 9 * Math.tan(THREE.MathUtils.degToRad(17.5)) * aspect
  const scale = THREE.MathUtils.clamp(visibleWidth / BASE_SCENE_WIDTH, 0.62, 1.05)

  return (
    <group ref={group} scale={scale}>
      {children}
    </group>
  )
}

export default function HeroScene({ active, reducedMotion, finePointer, onContextLost }: HeroSceneProps) {
  const speed = reducedMotion ? 0 : 1

  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.6]}
      shadows={false}
      camera={{ position: [0, 0.3, 9], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', onContextLost, { once: true })
      }}
      aria-hidden
    >
      <ambientLight intensity={0.25} />
      <spotLight position={[-5, 6, 5]} angle={0.4} penumbra={1} intensity={90} color="#fff4dc" />
      <pointLight position={[4, -2, 3]} intensity={18} color={LIME} />

      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={6} position={[0, 5, -4]} scale={[10, 2, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={5} position={[0, 0.5, 8]} scale={[7, 5, 1]} color="#fff6e4" />
        <Lightformer form="rect" intensity={2.5} position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[6, 4, 1]} color="#fff0d2" />
        <Lightformer form="rect" intensity={3.2} position={[5, 0, 2]} rotation-y={-Math.PI / 2} scale={[5, 3, 1]} color={LIME} />
        <Lightformer form="ring" intensity={1.8} position={[0, -3, 4]} scale={4} color="#ffffff" />
      </Environment>

      <Rig followPointer={finePointer && !reducedMotion}>
        <Vault speed={speed} />
        <Float speed={reducedMotion ? 0 : 1.8} rotationIntensity={0.12} floatIntensity={0.55}>
          <Coin speed={speed * 0.9} />
        </Float>
        <OrbitRing radius={2.55} tilt={[1.25, 0.2]} speed={speed * 0.6} phase={0.4} />
        <OrbitRing radius={2.9} tilt={[0.55, -0.7]} speed={-speed * 0.4} phase={2.2} />
      </Rig>

      <ContactShadows position={[0, -2.35, 0]} opacity={0.55} scale={9} blur={2.8} far={4} resolution={512} color="#000000" />
    </Canvas>
  )
}
