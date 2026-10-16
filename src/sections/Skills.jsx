import Reveal from '../components/Reveal'
import { Heading, Label, Pill } from '../components/ui'
import { content } from '../data/content'
import { flags } from '../debug'

export default function Skills() {
  const { skills } = content
  return (
    <section id="skills" className="relative px-6 py-32 md:px-14">
      <Reveal className="text-center">
        <Label>02 / Skills</Label>
        <Heading text={skills.heading} className="mt-6 text-[clamp(3rem,7vw,6rem)]" />
      </Reveal>
      <div className="mx-auto mt-24 grid max-w-6xl gap-px border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
        {skills.groups.map((g, i) => (
          <Reveal key={g.title} delay={i * 0.06} className={`bg-white/60 p-7 ${flags.noblur ? '' : 'backdrop-blur-sm'}`}>
            <p className="label text-dim">{g.title}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {g.items.map((s) => (
                <Pill key={s}>{s}</Pill>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
