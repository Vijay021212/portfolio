import { useEffect, useState } from 'react'
import { useProgress } from '@react-three/drei'
import { AnimatePresence, motion } from 'motion/react'

// Full-screen curtain while the 3D model downloads. Stays up for at least 1.1s so it never flashes,
// and gives up after 6s so a slow connection never blocks the page.
export default function Loader() {
  const { loaded, total } = useProgress()
  const [minPassed, setMinPassed] = useState(false)
  const [timedOut, setTimedOut] = useState(false)

  useEffect(() => {
    const a = setTimeout(() => setMinPassed(true), 1100)
    const b = setTimeout(() => setTimedOut(true), 6000)
    return () => {
      clearTimeout(a)
      clearTimeout(b)
    }
  }, [])

  // Latched: once the curtain has lifted it never comes back, even if something else starts loading later.
  const [done, setDone] = useState(false)
  const assetsDone = total > 0 && loaded >= total
  useEffect(() => {
    if (!done && minPassed && (assetsDone || timedOut)) setDone(true)
  }, [done, minPassed, assetsDone, timedOut])

  useEffect(() => {
    document.body.style.overflow = done ? '' : 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [done])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-paper"
        >
          <div className="relative size-12">
            <div className="absolute inset-0 rounded-full border border-gold/20" />
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-gold" />
          </div>
          <p className="label text-dim">Booting the robot. Good things take a few milliseconds.</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
