import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useAnimations, useGLTF } from '@react-three/drei'
import { flags } from '../../debug'
import { MODEL_URL, POSES, scrollState } from './scrollState'

// Two re-skins of the Mixamo mannequin. Switch with LOOK below.
const LOOKS = {
  // Graphite body with gold joints: picks up the page's gold accent.
  graphite: {
    surface: { color: '#2b2b30', roughness: 0.32, metalness: 0.55, clearcoat: 0.7, clearcoatRoughness: 0.25 },
    joints: { color: '#c9a24a', roughness: 0.3, metalness: 0.95 },
  },
  // Light clear-coated body with dark joints (the v1 look).
  ivory: {
    surface: { color: '#efece5', roughness: 0.3, metalness: 0.15, clearcoat: 0.8, clearcoatRoughness: 0.2 },
    joints: { color: '#2a2a31', roughness: 0.45, metalness: 0.85 },
  },
}
const LOOK = 'graphite'
const { surface: SURFACE, joints: JOINTS } = LOOKS[LOOK]

export default function Robot() {
  const group = useRef()
  const { scene, animations } = useGLTF(MODEL_URL)
  // drei creates each action lazily the first time it is read, and only once `group` is attached,
  // so actions must be looked up inside the frame loop, never cached during render.
  const { actions, names } = useAnimations(animations, group)
  const current = useRef(null)
  const frameStats = useRef({ n: 0, t: 0 })
  const { viewport } = useThree()

  useEffect(() => {
    scene.traverse((obj) => {
      if (!obj.isMesh) return
      obj.frustumCulled = false // skinned meshes move outside their static bounds
      if (flags.nomat) return
      const isJoint = /joint/i.test(obj.name) || /joint/i.test(obj.material?.name ?? '')
      obj.material = new THREE.MeshPhysicalMaterial(isJoint ? JOINTS : SURFACE)
    })
  }, [scene])

  // Case-insensitive clip names ("walk" finds "Walk"), with the first clip as a fallback.
  const canonical = useMemo(() => Object.fromEntries(names.map((n) => [n.toLowerCase(), n])), [names])

  const play = (name) => {
    if (flags.noanim) return
    const next = actions[canonical[name.toLowerCase()] ?? names[0]]
    if (!next || next === current.current) return
    next.reset().fadeIn(0.45).play()
    current.current?.fadeOut(0.45)
    current.current = next
  }

  useFrame((_, delta) => {
    const g = group.current
    if (!g) return

    if (flags.debug) {
      const s = frameStats.current
      s.n += 1
      s.t += delta
      if (s.n === 60) {
        console.log(`[robot] ${((s.t / s.n) * 1000).toFixed(1)} ms/frame over 60 frames, section=${scrollState.section}`)
        s.n = 0
        s.t = 0
      }
    }

    const pose = POSES[scrollState.section] ?? POSES.hero
    const narrow = viewport.aspect < 1
    // Narrow screens: keep the robot near the centre, a little smaller and lower, so it sits under the
    // text rather than behind it, and never do the close-up (there is no room beside the text).
    const xScale = narrow ? 0.12 : Math.min(1, viewport.aspect / 1.8)
    const targetY = narrow ? pose.y - 0.45 : pose.y
    const targetZ = narrow ? Math.min(pose.z, 0) : pose.z
    const targetScale = narrow ? 0.85 : 1

    const k = 1 - Math.exp(-Math.min(delta, 0.1) * 2.4) // frame-rate independent easing
    g.position.x += (pose.x * xScale - g.position.x) * k
    g.position.y += (targetY - g.position.y) * k
    g.position.z += (targetZ - g.position.z) * k
    g.rotation.y += (pose.ry - g.rotation.y) * k
    g.scale.setScalar(g.scale.x + (targetScale - g.scale.x) * k)

    // Walk while the page is actually moving, then settle into the section's own clip.
    const scrolling = performance.now() - scrollState.lastScrollAt < 220
    play(scrolling && pose.z <= 0 ? 'walk' : pose.clip)
  })

  return (
    <group ref={group} position={[POSES.hero.x, POSES.hero.y, 0]} rotation={[0, POSES.hero.ry, 0]} dispose={null}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload(MODEL_URL)
