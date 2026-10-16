// Smoke test: drive a headless Chromium browser (Edge or Chrome, whichever is installed) over the
// DevTools protocol, scroll through the page, measure frame time at each stop, and save a screenshot
// per stop into smoke/<desktop|mobile>/. Every protocol call has a timeout, so a broken page can
// never hang the script.
//
//   npm run smoke                      # desktop viewport against http://127.0.0.1:5173/
//   npm run smoke -- --mobile          # 390x844 viewport
//   npm run smoke -- http://localhost:4173/ --mobile
//
// Requires Node 22+ (built-in fetch and WebSocket). Set BROWSER=<path to chrome.exe/msedge.exe> to override detection.
import { spawn } from 'node:child_process'
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const argv = process.argv.slice(2)
const mobile = argv.includes('--mobile')
const url = argv.find((a) => a.startsWith('http')) ?? 'http://127.0.0.1:5173/'
const outDir = `smoke/${mobile ? 'mobile' : 'desktop'}`
const size = mobile ? '390,844' : '1568,783'

const candidates = [
  process.env.BROWSER,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  `${process.env.LOCALAPPDATA}/Google/Chrome/Application/chrome.exe`,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean)
const browser = candidates.find((p) => existsSync(p))
if (!browser) {
  console.error('No Chrome/Edge found. Set BROWSER=<path to the executable>.')
  process.exit(1)
}

mkdirSync(outDir, { recursive: true })
const port = 9333 + Math.floor(Math.random() * 1000)
const proc = spawn(browser, [
  // Chromium silently refuses a relative profile path, so resolve it.
  '--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${resolve(outDir, 'profile')}`, `--window-size=${size}`,
  '--no-first-run', '--enable-unsafe-swiftshader', '--hide-scrollbars', 'about:blank',
], { stdio: 'ignore' })
const watchdog = setTimeout(() => { console.log('watchdog: giving up after 120s'); proc.kill(); process.exit(2) }, 120000)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// Wait for the browser to expose its page target.
let page
for (let i = 0; i < 120 && !page; i++) {
  try { page = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page') } catch { /* not up yet */ }
  if (!page) await sleep(250)
}
if (!page) { console.error('browser did not start'); proc.kill(); process.exit(1) }

// Minimal DevTools protocol client: numbered requests, timeouts, console capture.
const ws = new WebSocket(page.webSocketDebuggerUrl)
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej })
let nextId = 0
const pending = new Map()
const logs = []
ws.onmessage = (ev) => {
  const m = JSON.parse(ev.data)
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) }
  else if (m.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(m.params.type)) logs.push(`${m.params.type}: ${m.params.args.map((a) => a.value ?? a.description ?? '').join(' ').slice(0, 200)}`)
  else if (m.method === 'Runtime.exceptionThrown') logs.push(`exception: ${(m.params.exceptionDetails.exception?.description ?? m.params.exceptionDetails.text).slice(0, 200)}`)
}
const send = (method, params = {}, timeout = 8000) => new Promise((resolve) => {
  const id = ++nextId
  const timer = setTimeout(() => { pending.delete(id); resolve({ timeout: true }) }, timeout)
  pending.set(id, (m) => { clearTimeout(timer); resolve(m.result ?? { error: m.error }) })
  ws.send(JSON.stringify({ id, method, params }))
})
const evaluate = async (expression, timeout = 8000) => {
  const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }, timeout)
  return r.timeout ? 'timeout' : (r.result?.value ?? r.exceptionDetails?.text ?? JSON.stringify(r.error))
}

await send('Page.enable')
await send('Runtime.enable')
await send('Page.navigate', { url })
// Wait for the loader curtain to lift (it locks body scrolling while the model downloads), up to ~12s.
for (let i = 0; i < 48; i++) {
  await sleep(250)
  const ready = await evaluate(`document.readyState === 'complete' && document.body.style.overflow !== 'hidden' && document.documentElement.scrollHeight > innerHeight`, 3000)
  if (ready === true) break
}
await sleep(1000)
console.log(`browser: ${browser}`)
console.log(`gpu: ${await evaluate(`(() => { const gl = document.createElement('canvas').getContext('webgl2'); const i = gl?.getExtension('WEBGL_debug_renderer_info'); return i ? gl.getParameter(i.UNMASKED_RENDERER_WEBGL) : 'none' })()`)}`)

// Average ms per animation frame over 20 frames; 16.7 means a steady 60 fps.
const frameTime = `new Promise(r => { const t0 = performance.now(); let n = 0; const tick = () => { if (++n < 20) requestAnimationFrame(tick); else r(+((performance.now() - t0) / n).toFixed(1)) }; requestAnimationFrame(tick) })`
const pageHeight = await evaluate('document.documentElement.scrollHeight - innerHeight')
console.log(`url: ${url}  scrollable: ${pageHeight}px  out: ${outDir}/`)
// Every 900px, plus the very bottom so the last section is always captured.
const stops = []
for (let y = 0; y < pageHeight; y += 900) stops.push(y)
stops.push(pageHeight)
for (const y of stops) {
  await evaluate(`window.scrollTo({ top: ${y}, behavior: 'instant' })`)
  await sleep(1200)
  const ms = await evaluate(frameTime, 6000)
  const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 70 }, 10000)
  let file = 'timeout'
  if (!shot.timeout && shot.data) { file = `y${String(y).padStart(5, '0')}.jpg`; writeFileSync(`${outDir}/${file}`, Buffer.from(shot.data, 'base64')) }
  // Headless browsers pause animation frames after ~20s; that shows up as a timeout, not a page problem.
  console.log(`  y=${String(y).padStart(5)}  ${String(ms === 'timeout' ? 'paused' : ms).padStart(7)} ms/frame  ${file}`)
}
if (logs.length) { console.log('console errors/warnings:'); for (const l of logs.slice(0, 20)) console.log(`  ${l}`) }
clearTimeout(watchdog)
proc.kill()
// The throw-away browser profile is tens of MB; remove it once the browser has let go of its files.
await sleep(1500)
try { rmSync(resolve(outDir, 'profile'), { recursive: true, force: true }) } catch { /* still locked: harmless, it is gitignored */ }
process.exit(0)
