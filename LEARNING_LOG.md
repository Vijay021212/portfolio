# Portfolio site: Learning Log

A record of what we built, why we built it that way, what went wrong, and what we
learned. One section per phase, newest last.

---

## Phase 0: Studying the reference

**Goal:** understand what makes the reference portfolio look premium, so we can build our
own version with the same feel but our own content and assets.

### What we found

- **Design tokens** (read straight from the live page's computed styles):

  | Token | Value | Used for |
  |---|---|---|
  | Background | `oklch(0.04 0 0)` (near black) | whole page |
  | Text | `oklch(0.94 0.005 80)` (warm off-white) | body copy |
  | Accent | `oklch(0.82 0.16 75)` (amber) | italic words in headings, labels, buttons |
  | Headings | Instrument Serif, 400, italic for the emphasised word | h1/h2 |
  | Body | Inter | paragraphs |
  | Labels | monospace, 10px, wide letter-spacing, uppercase | `01 / ABOUT`, `SCROLL ↓` |

- **Sections, top to bottom:** loader → fixed nav → hero → skills ticker → about → skills
  grid → experience + education → projects → second ticker → achievements → contact → footer,
  plus a dot navigation on the right.
- **The 3D figure** is a Tesla Optimus model that moves as you scroll. That asset belongs to
  Tesla, so we needed our own character.

### Decisions

- **Character:** Mixamo's "X Bot" mannequin, taken from the three.js examples folder
  (`https://threejs.org/examples/models/gltf/Xbot.glb`, 2.9 MB). It ships with
  `idle`, `walk`, `run`, `agree`, `headShake`, `sad_pose`, `sneak_pose` clips. Mixamo's terms
  allow using its characters in your own projects; you can't resell the file itself.
  The alternative was "RobotExpressive" (CC0, 464 KB, cartoony). Rejected for tone, not quality.
- **Status badge:** none. The reference shows "Open to work"; we show location and title only.
- **Hosting:** Vercel (free, redeploys on every GitHub push).

---

## Phase 1: Project setup

**Goal:** a React project with the four libraries the design needs.

### What each dependency does

| Package | Role |
|---|---|
| `vite` | Dev server with instant reload, and the production bundler (`npm run build` → `dist/`) |
| `react`, `react-dom` | UI library. Each section of the page is a component |
| `tailwindcss` + `@tailwindcss/vite` | Utility CSS. Version 4 is configured in CSS (`@theme { ... }` in `src/index.css`), not in a JS config file |
| `motion` | Animations: fade-in on scroll, the loader's exit, the hero's staggered entrance. (This is the package formerly called Framer Motion) |
| `three` | The WebGL 3D engine |
| `@react-three/fiber` | Lets us write the three.js scene as React components (`<Canvas>`, `<spotLight>`) |
| `@react-three/drei` | Helpers on top of fiber: `useGLTF` (load the model), `useAnimations` (play clips), `useProgress` (loading %), `Environment` (reflections) |

We did **not** use `npm create vite` because its interactive prompts don't work in a
non-interactive terminal; we wrote `package.json`, `vite.config.js` and `index.html` by hand.
`lucide-react` was installed for icons, then removed: five inline SVGs were simpler than a dependency.

### Folder structure

```
portfolio/
├── index.html              page shell, fonts, meta tags
├── vite.config.js          React + Tailwind plugins
├── public/
│   ├── favicon.svg
│   └── models/xbot.glb     the 3D character
└── src/
    ├── main.jsx            mounts <App/>
    ├── index.css           Tailwind import + design tokens + 3 small utility classes
    ├── App.jsx             composition root: stacks every section in order
    ├── data/content.js     EVERY word on the site. Edit this, not the components
    ├── components/         reusable pieces (Nav, Loader, Ticker, Reveal, ui, Icons, SectionDots, Footer)
    │   └── three/          the 3D layer (RobotScene, Robot, scrollState)
    └── sections/           one file per page section (Hero, About, Skills, ...)
```

---

## Phase 2: Architecture of the page

### Content lives in one file

`src/data/content.js` is the single source of truth. Components only know the *shape* of the
data (a role has a period, title, company, bullets). Changing a bullet, adding a project or a
degree is a data edit, never a layout edit. Headings use a tiny markup: `*word*` renders the
word in italic amber, `\n` breaks the line.

### How the robot follows the scroll

1. `SectionDots.jsx` runs an **IntersectionObserver** with `rootMargin: -45% 0px -45% 0px`.
   That shrinks the "viewport" to a thin band across the middle of the screen, so whichever
   section crosses the middle is the active one. It updates React state (for the dot nav) and
   writes `scrollState.section` (for the robot).
2. `scrollState` is a **plain object, not React state**. The 3D frame loop reads it 60 times
   per second; using React state would re-render components 60 times per second for nothing.
3. `Robot.jsx` runs `useFrame` every frame: it looks up the pose for the active section in
   `POSES`, then eases position and rotation toward it with
   `k = 1 - exp(-dt * 2.4)`. This is a frame-rate independent damping: the same smoothness at
   30 fps and 144 fps. It also crossfades animation clips (`fadeIn`/`fadeOut`) and plays
   `walk` while the page is actually moving.
4. The `<Canvas>` is `position: fixed`, full-screen, `z-index: 0`, `pointer-events: none`.
   The page content sits in `<main class="relative z-10">` above it with transparent
   backgrounds, so the robot shows through.

### World units, briefly

The model is 1.8 units tall with its origin at the feet; think of units as metres. The camera
sits at `(0, 0.4, 5.5)` with a 35° field of view, so at `z = 0` the visible height is about
3.5 units. A pose with `y = -1.6` puts the feet near the bottom edge. Moving the robot to
`z = 2.4` brings it 2.4 units closer to the camera, which is how the "head close-up" in the
experience section works.

### Re-skinning the model

The Mixamo file has two meshes, one with material `Beta_Joints_MAT`. `Robot.jsx` walks the
model and replaces materials by name: anything with "joint" in the name becomes dark graphite,
the rest becomes a light clear-coated surface. `frustumCulled = false` is set on skinned
meshes because their bounding box is computed from the rest pose; once they animate out of it,
three.js may wrongly decide they're off-screen and hide them.

### Other small mechanisms

- **Loader:** `useProgress` from drei reports the model download. The curtain stays up for at
  least 1.1 s (no flash) and at most 6 s (slow networks never block the page).
- **Ticker:** the list is rendered twice and animated with `translateX(-50%)`. Because the
  second copy is identical, the jump back to 0 is invisible.
- **Reveal:** every section body is wrapped in `motion.div` with `whileInView`, so it fades
  and rises once when it first scrolls into view.
- **Contact form:** no backend. Submitting builds a `mailto:` link with the message prefilled.
  Upgrade path: Formspree or an API route on Vercel.

---

## Phase 3: Seeing it run, and the bugs that only show up on screen

### A browser you can't freeze: `npm run smoke`

Screenshots through the Claude-in-Chrome extension kept timing out, and the symptom looked exactly like
a frozen page. Rather than guess, we wrote `scripts/smoke.mjs`: it launches headless Edge/Chrome with
`--remote-debugging-port`, talks to it over the **Chrome DevTools Protocol** (a WebSocket where you send
`{id, method, params}` and get `{id, result}` back), scrolls the page in steps, measures
`requestAnimationFrame` cadence, saves a screenshot per stop, and collects console errors. Every call
has a timeout, so a broken page can never hang the script. It is the same mechanism Puppeteer and
Playwright use, without installing either.

What it showed: the page runs at a steady 16.7 ms/frame (60 fps) on this laptop's Radeon 860M, with
the 3D scene on, at desktop and phone sizes. The "freezes" were the tooling: `requestAnimationFrame`
pauses in a tab that isn't visible, and screenshot capture waits for a frame that never comes.

### Bugs found by looking

| Bug | Cause | Fix |
|---|---|---|
| Robot stuck in a T-pose, no animation | drei's `useAnimations` creates each action lazily the first time it is read, and only once the group ref is attached. We read them during the first render (ref still `null`) and cached the empty result in `useMemo` | Look actions up inside the frame loop, at call time; cache only the lower-case → real clip name map |
| Loader curtain re-appeared mid-page | `done` was derived from `loaded >= total`, so any later load (even an HMR reload) flipped it back | `done` is now latched React state: once true, it never goes back |
| Robot invisible behind the skills grid | Cards were 85 % opaque | 70 % opacity + backdrop blur; the robot shows through as a soft silhouette |
| "Head close-up" showed the whole body | `z = 2.4` only brought the camera to 3.1 units away | `z = 4.2`, `y = -1.2`: head and shoulders fill the right half, like the reference |
| A failed model download blanked the whole site | react-three-fiber re-throws scene errors to the nearest React error boundary; without one, React unmounts the root | `SceneBoundary` around the canvas: on error, the canvas disappears and the page stays |
| Phone: robot sat behind the hero paragraph | Same pose as desktop, centred | On narrow screens: 15 % lower, 85 % scale, 40 % opacity, never the close-up |

### Other problems & fixes

| Problem | Fix |
|---|---|
| `uv` not found from Git Bash, `pypdf` not installed for Python | Read the LinkedIn/GitHub URLs out of the resume PDF with a regex over the raw bytes (`/URI (...)`); no package needed |
| Khronos glTF sample README returned 404 on every path tried | Confirmed the license on the three.js example page instead ("Model by Tomás Laulhé, CC0") |
| Poly Pizza blocks automated fetches (HTTP 403) | Used models hosted in the three.js examples folder, which has no bot protection |
| `THREE.Clock ... deprecated` warning in the console | Comes from drei's `useAnimations`, not our code. Harmless; will disappear when drei updates |
| `X4122: sum ... cannot be represented accurately` shader warnings | Windows compiles WebGL shaders through Direct3D (ANGLE); these are precision notes, not errors |
| Headless Edge reloads the page once at startup, aborting the model fetch ("Failed to fetch") | Harmless in the smoke test (the second load succeeds), but it is what revealed the missing error boundary |
| "Download my resume" saved an `.htm` file | The PDF wasn't in `public/` yet. A single-page app's dev server answers *every* unknown path with the page itself (so client-side routes work), and the browser saved that HTML under the `.pdf` name. Fix: put the file in `public/`; static files there win over the fallback |
| Publishing the resume would publish the phone number | Made a phone-free copy: edit `word/document.xml` inside a copy of the `.docx` (a `.docx` is a zip of XML), export the copy to PDF with Word's COM automation (`ExportAsFixedFormat(path, 17)`), keep the originals untouched |

---

## Phase 4: First feedback round

Two changes after the first look at v1:

1. **Light theme.** "A mix of gold and white" instead of the near-black page. Because every colour is
   a token, the swap is mostly `src/index.css`: `paper` (ivory) is now the background and `ink`
   (warm near-black) the text, which is what those words should have meant from the start; the accent
   is a deeper gold that stays readable on a light page, with `gold-soft` for tints and for the two
   fixed radial glows behind the page (`body::before`). The hard-coded `bg-white/[0.02]` tints became
   real white cards (`bg-white/50`…`/70`) over the ivory. The robot changed with it: a white robot
   on an ivory page disappears, so it became graphite with gold joints, lit by white panels and a
   gold rim. Both re-skins live in `Robot.jsx` as named presets (`LOOK = 'graphite' | 'ivory'`), so
   flipping back is a one-word edit.
2. **Connect, not contact.** The mail form is gone. The last section is the heading, a
   "Download my resume" button (an `<a download>` pointing at a PDF in `public/`, served as a plain
   file) and the email / GitHub / LinkedIn links; the robot stands on the right so it never sits
   behind the text. The published PDF is a copy without the phone number: the site shows an email,
   never a phone.
3. **Hero copy.** The name sits on one line, and the one-line pitch became a lead sentence plus a
   short paragraph written by the user.
4. **No tickers.** The two scrolling marquees were removed (the user found the movement distracting),
   along with the `Ticker` component, its content and the `marquee` keyframes, so no dead code is left.
5. **Colour clouds ("aurora").** After trying a solid gold page, the user asked for "colourful" without
   a specific picture in mind. `Aurora.jsx` + the `.aurora` styles render five big blurred discs
   (gold, peach, lavender, mint, sky) on a cream page, each drifting on its own slow `transform`
   animation. Transforms are composited on the GPU, so nothing repaints per frame; the blur filter is
   the only real cost, so phones get fewer, softer discs, and `prefers-reduced-motion` stops the drift.
   Colours were picked in OKLCH at the same lightness (~0.85) so no cloud shouts over another.
6. **Neural-network background.** The page felt plain, so `NeuralBackground.jsx` draws a soft
   net on a fixed 2D canvas under the robot. How it works:
   - ~110 nodes (45 on phones) drift slowly; each frame every pair closer than 150 px gets an edge
     whose opacity fades with distance and whose width comes from the lighter node's "weight".
     That pair check is O(n²), but 110 nodes is only ~6,000 distance checks, trivial for a CPU.
   - Each node has a `depth`; its on-screen y is `y − scrollY × 0.12 × depth`, so deeper nodes move
     further as you scroll (parallax) and the net visibly flows with the page. Fast scrolling adds a
     short-lived speed boost.
   - Up to 8 "pulses" travel along random edges with a sine-shaped brightness, reading as signals.
   - Device pixel ratio is capped at 1.5, drawing pauses when the tab is hidden, and users with
     `prefers-reduced-motion` get a single static frame.

---

## Phase 5: Content review and trims

A content pass from a hiring manager's point of view. The Genzeon story was told four times
(hero, About, Experience, Receipts); the fix is to give each section a different job:

| Section | Before | After |
|---|---|---|
| Hero | positioning statement | unchanged: the pitch the user wrote |
| About | a second job description | the one human paragraph: web apps → master's → agentic AI, and what I care about |
| Experience | 7 long bullets | 5 one-breath bullets, every number kept, first person |
| Skills | ~60 pills | ~40, only what you'd defend in an interview |
| Receipts | the same achievements as sentences | four stat tiles (label + big number), "Certifications & recognition" |
| Projects | a card for the site itself | a one-line "also open source" footnote |

Stat tiles follow the usual figure contract: label in sentence case above a large sans-serif
value, no decoration, no hover layer (a bare number has nothing to reveal). The number *is* the
chart, which beats a one-bar bar chart every time.

Lesson: name colour tokens by *role* (background, text, accent), never by the colour they happen to
be on day one.

---

## Phase 6: Publishing

**Goal:** a public link for LinkedIn. Three parties, each with one job:

| Party | Job |
|---|---|
| **git** (local) | history of every change, on the laptop |
| **GitHub** (`github.com/Vijay021212/portfolio`) | the public copy of that history; also what Vercel reads from |
| **Vercel** (`vijaybolle.vercel.app`) | builds `main` with `npm run build` and serves `dist/` from a CDN; rebuilds on every push |

### What happened, and what we learned

- **Git identity matters before the first push.** The machine's global git config carried the work
  email (`@genzeon.com`). Commits are public on GitHub, and GitHub links a commit to your profile
  only through an email registered on the account, so the repo got a local override
  (`git config user.email mail4vijaybolle@gmail.com`) and the first commit was re-stamped with
  `git commit --amend --reset-author` before anything was pushed.
- **`.gitattributes` with `* text=auto eol=lf`** stops Windows' CRLF warnings and keeps the repo's
  line endings consistent for anyone cloning on macOS or Linux. Binary files (`.glb`, `.pdf`) are
  marked so git never tries to "fix" them.
- **GitHub app vs. password.** Vercel never sees a GitHub password: it is installed as a GitHub
  App with access to only the `portfolio` repository ("only select repositories"), which the account
  owner approves once. Likewise the push used Git Credential Manager, so no token was typed anywhere.
- **Project name = URL.** On Vercel the project name becomes `<name>.vercel.app`; naming it
  `vijaybolle` at import time gave a clean address with no rename later.
- **The deploy pipeline is now:** edit → `git commit` → `git push` → Vercel builds (~1 min) → live.
  Nothing else to do, ever, for a content change.

### Link previews and the LinkedIn banner

When a link is pasted into LinkedIn, Slack or a chat app, the preview card comes from the page's
**Open Graph** tags (`og:title`, `og:description`, `og:image`). Without `og:image`, LinkedIn's Featured
dialog asks for a thumbnail by hand. The fix was a 1200×630 card (`brand/og.html`) rendered to
`public/og.png` with a headless browser and referenced from `index.html`. LinkedIn caches previews, so
after adding the image the URL was run through LinkedIn's **Post Inspector**, which refreshes the cache;
the existing Featured item then picked the picture up by itself.

The profile banner went through three versions in one evening, which is its own lesson: a text-heavy
card in the site's tokens (rejected: the user wanted no name or words), a hand-drawn SVG of the agentic
stack (rejected: too diagrammatic), and finally an AI-generated illustration in the painterly style of a
banner the user liked — a figure raising a light toward a colossal AI presence, sunrise on one side and
a machine city on the other. Generated with Canva's image model at 2:1, placed on a 1584×396 Canva page
and exported, because Canva's full-size media URLs are signed and can't be fetched directly. Lesson:
when someone says "something good", ask for a reference image before drawing anything.

A detail worth remembering: LinkedIn's upload controls open the browser's native file picker, which
automation can't see; the workaround was to intercept the picker so the hidden `<input type="file">`
could be filled directly.

---

## Running it (PowerShell)

```powershell
Set-Location "C:\Users\VBolle\Documents\Personal Projects\portfolio"
npm run dev        # http://127.0.0.1:5173
npm run build      # production bundle in dist/
npm run preview    # serve the production bundle locally
npm run smoke      # with the dev server running: screenshots + frame times per section into smoke/
npm run smoke -- --mobile
```
