import { flags } from '../debug'

// Five large, blurred colour clouds that drift slowly behind the page (styles in index.css: .aurora).
// Pure CSS transforms, so the GPU composites them; nothing is repainted per frame.
export default function Aurora() {
  if (flags.nocolor) return null
  return (
    <div className="aurora" aria-hidden>
      <span />
      <span />
      <span />
      <span />
      <span />
    </div>
  )
}
