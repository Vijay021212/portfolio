import { motion } from 'motion/react'
import { Heading } from '../components/ui'
import { content } from '../data/content'

const rise = (delay) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] },
})

export default function Hero() {
  const { hero, name } = content
  return (
    <section id="hero" className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 pt-36 pb-28 md:px-14">
      <motion.p {...rise(0.05)} className="mb-3 text-lg text-mute md:text-xl">
        {hero.greeting}
      </motion.p>
      <motion.h1 {...rise(0.15)} className="font-serif text-[clamp(3rem,10vw,8rem)] leading-[0.95] tracking-tight whitespace-nowrap">
        {name.first} <em className="text-gold">{name.last}.</em>
      </motion.h1>

      {/* One line on desktop; wraps naturally on phones where it can't fit. */}
      <motion.div {...rise(0.3)}>
        <Heading as="p" text={hero.headline} className="mt-6 max-w-4xl text-[clamp(1.35rem,2.4vw,2rem)] lg:whitespace-nowrap" />
      </motion.div>

      <motion.div {...rise(0.45)} className="mt-7 max-w-2xl space-y-4">
        {hero.pitch.map((p, i) => (
          <p
            key={i}
            className={i === 0 ? 'text-base leading-relaxed text-ink/90 md:text-lg' : 'text-sm leading-relaxed text-mute md:text-[15px]'}
          >
            {p}
          </p>
        ))}
      </motion.div>

      {/* "Agentic AI | LangGraph | ..." as one bold line with gold separators. */}
      <motion.p {...rise(0.55)} className="mt-8 max-w-2xl text-sm font-semibold text-ink">
        {hero.tags.map((t, i) => (
          <span key={t}>
            {i > 0 && <span className="mx-2 text-gold">|</span>}
            {t}
          </span>
        ))}
      </motion.p>

      <p className="label absolute bottom-8 left-6 text-dim md:left-14">Scroll ↓</p>
      <p className="label absolute right-6 bottom-8 text-dim md:right-14">
        {name.first} {name.last}
      </p>
    </section>
  )
}
