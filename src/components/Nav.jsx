import { content } from '../data/content'
import { GitHubIcon, LinkedInIcon, MailIcon } from './Icons'

// Fixed top bar: just the three contact icons, right-aligned.
export default function Nav() {
  const { links, email } = content
  const icon = 'text-ink/60 transition hover:text-gold'
  return (
    <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-end bg-linear-to-b from-paper/90 to-transparent px-6 py-5 md:px-14">
      <nav className="flex items-center gap-5">
        <a href={links.github} target="_blank" rel="noreferrer" aria-label="GitHub" className={icon}>
          <GitHubIcon />
        </a>
        <a href={links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className={icon}>
          <LinkedInIcon />
        </a>
        <a href={`mailto:${email}`} aria-label="Email" className={icon}>
          <MailIcon />
        </a>
      </nav>
    </header>
  )
}
