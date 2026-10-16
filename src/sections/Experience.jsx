import Reveal from '../components/Reveal'
import { Heading, Label } from '../components/ui'
import { content } from '../data/content'

export default function Experience() {
  const { experience, education } = content
  return (
    <section id="experience" className="relative px-6 py-32 md:px-14">
      <div className="max-w-xl">
        <Reveal>
          <Label>03 / Experience</Label>
          <Heading text={experience.heading} className="mt-6 text-[clamp(2.6rem,6vw,4.75rem)]" />
        </Reveal>

        <div className="mt-16">
          {experience.roles.map((r) => (
            <Reveal key={r.company} className="border-t border-line pt-8 pb-12">
              <p className="label text-dim">{r.period}</p>
              <h3 className="mt-3 font-serif text-2xl md:text-3xl">{r.title}</h3>
              <p className="mt-1 text-sm text-gold">
                {r.company} · {r.location}
              </p>
              {r.summary && <p className="mt-4 text-sm leading-relaxed text-mute">{r.summary}</p>}
              <ul className="mt-5 space-y-3">
                {r.bullets.map((b, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed text-mute">
                    <span className="shrink-0 text-gold">—</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <Label className="mt-4">Education</Label>
          <div className="mt-6 space-y-4">
            {education.map((e) => (
              <div key={e.degree} className="border border-line bg-white/50 p-6">
                <p className="label text-dim">{e.period}</p>
                <h3 className="mt-2 font-serif text-xl">{e.degree}</h3>
                <p className="mt-1 text-xs text-gold">{e.school}</p>
                <p className="mt-3 text-sm text-mute">{e.note}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
