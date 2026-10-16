// Renders the brand images from their HTML sources with a headless Chromium browser:
//   brand/og.html      -> public/og.png            (1200x630, link preview card: LinkedIn, Slack, iMessage...)
//   brand/banner.html  -> brand/linkedin-banner.png (1584x396, LinkedIn profile background)
// Run after changing the wording in those HTML files:  npm run brand
// Uses the same browser detection as scripts/smoke.mjs; set BROWSER=<path> to override.
import { spawnSync } from 'node:child_process'
import { existsSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

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

const jobs = [
  { source: 'brand/og.html', output: 'public/og.png', size: '1200,630' },
  { source: 'brand/banner.html', output: 'brand/linkedin-banner.png', size: '1584,396' },
]

const profile = resolve('brand/.browser-profile')
for (const job of jobs) {
  const result = spawnSync(browser, [
    '--headless=new', '--hide-scrollbars', '--no-first-run', `--user-data-dir=${profile}`,
    `--window-size=${job.size}`, '--force-device-scale-factor=1',
    '--virtual-time-budget=8000', // lets the Google Fonts finish loading before the capture
    `--screenshot=${resolve(job.output)}`, pathToFileURL(resolve(job.source)).href,
  ], { stdio: 'ignore', timeout: 90000 })
  console.log(`${result.status === 0 ? 'ok  ' : 'FAIL'} ${job.source} -> ${job.output} (${job.size})`)
}
try { rmSync(profile, { recursive: true, force: true }) } catch { /* locked: harmless */ }
