import { content } from '../data/content'

export default function Footer() {
  const { name, footer } = content
  return (
    <footer className="flex flex-col gap-3 border-t border-line px-6 py-8 md:flex-row md:items-center md:justify-between md:px-14">
      <p className="label text-dim">
        © {name.first} {name.last}
      </p>
      <p className="label text-dim">{footer.built}</p>
    </footer>
  )
}
