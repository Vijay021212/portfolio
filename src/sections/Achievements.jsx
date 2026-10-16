import Reveal from '../components/Reveal'
import { Heading, Label } from '../components/ui'
import { content } from '../data/content'

// "Receipts": a KPI row of stat tiles (the number is the chart) plus certifications.
export default function Achievements() {
  const { achievements } = content
  return (
    <section id="achievements" className="relative grid min-h-screen items-center gap-10 px-6 py-32 md:px-14 lg:grid-cols-2">
      {/* Robot stands on the left here; the receipts sit on the right. */}
      <div className="hidden lg:block" />
      <Reveal className="max-w-xl">
        <Label>05 / Achievements</Label>
        <Heading text={achievements.heading} className="mt-6 text-[clamp(3rem,7vw,6rem)]" />

        <dl className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-2">
          {achievements.stats.map((s) => (
            <div key={s.label} className="bg-white/50 p-6">
              <dt className="text-[13px] leading-snug text-mute">{s.label}</dt>
              <dd className="mt-3 font-sans text-5xl font-semibold tracking-tight text-ink">{s.value}</dd>
            </div>
          ))}
        </dl>

        <p className="label mt-14 text-dim">{achievements.recognitionTitle}</p>
        <ul className="mt-5 space-y-3">
          {achievements.recognition.map((c) => (
            <li key={c} className="flex gap-3 text-sm text-mute">
              <span className="shrink-0 text-gold">✓</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  )
}
