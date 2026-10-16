import Reveal from '../components/Reveal'
import { DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon } from '../components/Icons'
import { Heading } from '../components/ui'
import { content } from '../data/content'

// Closing section: a heading, the resume download, and the three places to find Vijay.
export default function Contact() {
  const { contact, email, links } = content
  const link = 'inline-flex items-center gap-2 text-sm text-mute transition hover:text-gold'

  return (
    <section id="contact" className="relative flex min-h-[70vh] items-center px-6 py-32 md:px-14">
      <Reveal className="max-w-xl">
        <Heading text={contact.heading} className="text-[clamp(2.4rem,5vw,4rem)]" />
        {/* `download` makes browsers save the file instead of opening it in a tab. */}
        <a
          href={contact.resume.href}
          download
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-medium text-paper transition hover:brightness-110"
        >
          <DownloadIcon size={15} /> {contact.resume.label}
        </a>
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
          <a href={`mailto:${email}`} className={link}>
            <MailIcon size={16} /> {email}
          </a>
          <a href={links.github} target="_blank" rel="noreferrer" className={link}>
            <GitHubIcon size={16} /> GitHub
          </a>
          <a href={links.linkedin} target="_blank" rel="noreferrer" className={link}>
            <LinkedInIcon size={16} /> LinkedIn
          </a>
        </div>
      </Reveal>
    </section>
  )
}
