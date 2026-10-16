# Vijay Bolle — portfolio

Personal portfolio site: a single scrolling page with a 3D character that follows you from section to
section. Built with React, react-three-fiber and Motion; deployed on Vercel.

> Live: **https://vijaybolle.vercel.app** · Source: https://github.com/Vijay021212/portfolio

## What's on the page

Hero → About → Skills → Experience & education → Projects → Achievements → Connect
(resume download, email, GitHub, LinkedIn). The resume is `public/Vijay-Bolle-Resume.pdf`. A fixed WebGL canvas sits behind the content; the character re-positions and
changes animation as each section crosses the middle of the viewport. Light theme: ivory with gold glows
and a graphite-and-gold character (`LOOK` in `src/components/three/Robot.jsx` switches to the ivory re-skin).

## Stack

| Layer | Choice | Why |
|---|---|---|
| Build / dev server | Vite 8 | instant reload, tiny config, Vercel auto-detects it |
| UI | React 19 | one component per section |
| Styling | Tailwind CSS 4 | design tokens live in `src/index.css` (`@theme`), no config file |
| Motion | `motion` 14 | scroll-in reveals, loader exit, hero entrance |
| 3D | three.js + `@react-three/fiber` + `@react-three/drei` | model loading, animation clips, lighting |

## Run it locally

```powershell
npm install
npm run dev        # http://127.0.0.1:5173
npm run build      # production bundle in dist/
npm run preview    # serve the production bundle
```

## Change the words

Everything written on the page lives in **`src/data/content.js`**: name, links, the about paragraph,
skill groups, roles and bullets, education, projects, achievements, certifications. Components only know
the shape of that data, so adding a project or a degree is a data edit, not a layout edit. In headings,
wrap a word in `*asterisks*` to render it in italic amber; `\n` breaks the line.

## How the 3D layer works

- `src/components/three/RobotScene.jsx` renders a fixed, click-through `<Canvas>` behind the page.
- `src/components/SectionDots.jsx` watches which section crosses the middle of the viewport
  (IntersectionObserver) and writes it to a shared plain object, `scrollState`.
- `src/components/three/Robot.jsx` reads `scrollState` every frame, eases the character towards the pose
  defined for that section in `scrollState.js` (`POSES`), and cross-fades animation clips.

Behind the robot, `src/components/NeuralBackground.jsx` draws a soft network of nodes and edges on a 2D
canvas; nodes sit at different depths so the net moves in parallax with the scroll.

Debug switches can be added to the URL: `?no3d` (no canvas), `?nonet` (no network), `?noenv`, `?nomat`, `?noanim`, `?dpr1`,
`?debug` (frame timings in the console), `?skip=skills,dots`, `?noreveal`, `?noblur`, `?nosmooth`.

A longer explanation of every decision, including what went wrong, is in [`LEARNING_LOG.md`](LEARNING_LOG.md).

## Deploy

Push to GitHub, import the repo at vercel.com, keep the defaults (framework: Vite, build `npm run build`,
output `dist`). Every push to `main` redeploys.

## Credits

- Character: "X Bot" by Mixamo (Adobe), taken from the three.js examples. Used under Mixamo's terms
  (free to use in your own projects; the file itself may not be redistributed as an asset).
- Fonts: Instrument Serif, Inter and JetBrains Mono via Google Fonts.
- Icons: Feather-style inline SVGs (MIT).
