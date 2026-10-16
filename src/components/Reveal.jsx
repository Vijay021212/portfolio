import { motion } from 'motion/react'
import { flags } from '../debug'

// Fade-and-rise once the element scrolls into view. Used for every section body.
export default function Reveal({ children, delay = 0, className = '' }) {
  if (flags.noreveal) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
