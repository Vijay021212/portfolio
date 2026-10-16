import { useEffect, useState } from 'react'
import { content } from '../data/content'
import { scrollState } from './three/scrollState'

// Which section is crossing the middle of the viewport. Drives the dot nav and the robot's pose.
function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
            scrollState.section = entry.target.id
          }
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [ids])
  return active
}

const ids = content.sections.map((s) => s.id)

export default function SectionDots() {
  const active = useActiveSection(ids)
  return (
    <nav className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex" aria-label="Sections">
      {content.sections.map((s) => {
        const on = s.id === active
        return (
          <a key={s.id} href={`#${s.id}`} className="group flex items-center gap-3">
            <span className={`label transition-opacity ${on ? 'text-gold opacity-100' : 'opacity-0 group-hover:opacity-60'}`}>
              {s.label}
            </span>
            <span className={`h-px transition-all ${on ? 'w-8 bg-gold' : 'w-4 bg-ink/20 group-hover:bg-ink/50'}`} />
          </a>
        )
      })}
    </nav>
  )
}
