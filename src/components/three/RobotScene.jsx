import { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import Robot from './Robot'
import SceneBoundary from './SceneBoundary'
import { flags } from '../../debug'
import { scrollState } from './scrollState'

// Fixed, click-through canvas behind the page. The robot inside it repositions itself per section.
export default function RobotScene() {
  useEffect(() => {
    if (flags.no3d) return undefined
    const onScroll = () => {
      scrollState.lastScrollAt = performance.now()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (flags.no3d) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-0 max-md:opacity-40" aria-hidden>
      <SceneBoundary>
        <Canvas
        camera={{ position: [0, 0.4, 5.5], fov: 35 }}
        dpr={flags.dpr1 ? 1 : [1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        {/* Lit for a light page: bright white key and fill, a gold rim from the left. */}
        <ambientLight intensity={0.7} />
        <spotLight position={[4, 6, 4]} angle={0.45} penumbra={1} intensity={90} color="#ffffff" />
        <directionalLight position={[-5, 3, -3]} intensity={1.0} color="#d9b25a" />
        {/* Studio-style reflections built from light panels, so nothing has to be downloaded. */}
        {!flags.noenv && (
          <Environment resolution={128}>
            <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
            <Lightformer intensity={1.2} rotation-y={Math.PI / 2} position={[-6, 1, -1]} scale={[12, 2, 1]} />
            <Lightformer intensity={1.5} color="#d9b25a" rotation-y={-Math.PI / 2} position={[6, 1, 0]} scale={[12, 1, 1]} />
          </Environment>
        )}
          <Suspense fallback={null}>
            <Robot />
          </Suspense>
        </Canvas>
      </SceneBoundary>
    </div>
  )
}
