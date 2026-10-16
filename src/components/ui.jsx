// Small shared building blocks: section labels, headings with italic gold words, tag pills.

export function Label({ children, className = '' }) {
  return <p className={`label text-gold ${className}`}>{children}</p>
}

// "Where I've *built*.\nSecond line" -> serif heading, *words* italic gold, \n becomes a line break.
export function Heading({ text, as: Tag = 'h2', className = '' }) {
  const nodes = []
  text.split('*').forEach((part, i) => {
    const lines = part.split('\n')
    const inner = lines.flatMap((line, j) => (j === 0 ? [line] : [<br key={`br-${i}-${j}`} />, line]))
    nodes.push(
      i % 2 ? (
        <em key={i} className="text-gold">
          {inner}
        </em>
      ) : (
        <span key={i}>{inner}</span>
      ),
    )
  })
  return <Tag className={`font-serif leading-[1.02] ${className}`}>{nodes}</Tag>
}

// Body copy with **bold** runs: "I'm an **AI Engineer** focused on..." -> the starred part renders bold.
export function RichText({ text }) {
  return text.split('**').map((part, i) =>
    i % 2 ? (
      <strong key={i} className="font-semibold text-ink">
        {part}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  )
}

export function Pill({ children }) {
  return <span className="pill">{children}</span>
}
