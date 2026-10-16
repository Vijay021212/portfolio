// Shared between the DOM (IntersectionObserver in SectionDots) and the Three.js frame loop (Robot).
// A plain object, not React state: the frame loop reads it 60 times a second without re-rendering anything.
export const scrollState = {
  section: 'hero',
  lastScrollAt: 0,
}

export const MODEL_URL = '/models/xbot.glb'

// Where the robot stands for each section, in world units. The model is ~1.8 units tall with its
// origin at the feet; the camera sits at (0, 0.4, 5.5) with a 35° field of view.
//   x: left/right (scaled down on narrow screens)   y: feet height   z: towards the camera (closer = bigger)
//   ry: rotation around the vertical axis           clip: animation to play while resting here
export const POSES = {
  hero: { x: 1.9, y: -1.6, z: 0, ry: -0.45, clip: 'idle' },
  about: { x: -2.0, y: -1.6, z: 0, ry: 0.55, clip: 'idle' },
  skills: { x: 0, y: -1.75, z: -1.6, ry: 0, clip: 'idle' },
  experience: { x: 0.62, y: -1.2, z: 4.2, ry: 0.55, clip: 'idle' }, // head-and-shoulders close-up on the right
  projects: { x: 2.0, y: -1.6, z: 0, ry: -0.3, clip: 'walk' },
  achievements: { x: -2.1, y: -1.6, z: 0, ry: 0.6, clip: 'agree' },
  contact: { x: 2.0, y: -1.6, z: 0, ry: -0.35, clip: 'idle' },
}
