import Reveal from '../components/Reveal'
import { ExternalIcon } from '../components/Icons'
import { Heading, Label, Pill } from '../components/ui'
import { content } from '../data/content'

export default function Projects() {
  const { projects } = content
  return (
    <section id="projects" className="relative px-6 py-32 md:px-14">
      <div className="max-w-xl">
        <Reveal>
          <Label>04 / Projects</Label>
          <Heading text={projects.heading} className="mt-6 text-[clamp(2.6rem,6vw,4.75rem)]" />
          <p className="mt-4 text-sm text-mute">{projects.sub}</p>
        </Reveal>

        <div className="mt-14 space-y-4">
          {projects.items.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <a
                href={p.href}
                target="_blank"
                rel="noreferrer"
                className="group block border border-line bg-white/50 p-6 transition hover:-translate-y-0.5 hover:border-gold/50 hover:bg-white/80"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-baseline gap-3">
                    <span className="label text-dim">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="font-serif text-2xl">{p.title}</h3>
                    {p.status && <span className="label text-gold">{p.status}</span>}
                  </div>
                  <span className="shrink-0 text-gold opacity-60 transition group-hover:opacity-100">
                    <ExternalIcon />
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-mute">{p.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <Pill key={t}>{t}</Pill>
                  ))}
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        {projects.footnote && (
          <Reveal>
            <p className="label mt-10 text-dim">
              {projects.footnote.text}{' '}
              <a href={projects.footnote.href} target="_blank" rel="noreferrer" className="text-gold transition hover:underline">
                {projects.footnote.linkText}
              </a>
            </p>
          </Reveal>
        )}
      </div>
    </section>
  )
}
