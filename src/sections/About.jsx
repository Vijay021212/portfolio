import Reveal from '../components/Reveal'
import { Heading, Label, RichText } from '../components/ui'
import { content } from '../data/content'

export default function About() {
  const { about } = content
  return (
    <section id="about" className="relative grid min-h-screen items-center gap-10 px-6 py-32 md:px-14 lg:grid-cols-2">
      {/* Left half is left empty on desktop: the robot stands there. */}
      <div className="hidden lg:block" />
      <Reveal>
        <Label>01 / About</Label>
        <Heading text={about.heading} className="mt-6 text-[clamp(2.4rem,5.5vw,4.6rem)]" />
        <div className="mt-10 max-w-xl space-y-4 text-[15px] leading-relaxed text-mute">
          {about.body.map((p, i) => (
            <p key={i}>
              <RichText text={p} />
            </p>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
