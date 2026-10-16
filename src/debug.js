// Debug switches read from the URL, e.g. http://127.0.0.1:5173/?noenv&dpr1 or ?no3d&skip=skills,dots
// They let us turn parts of the page off without editing code, which is how we bisect a problem
// down to one component. `no3d` doubles as a real escape hatch for weak GPUs.
const params = new URLSearchParams(window.location.search)

export const flags = {
  // 3D layer
  no3d: params.has('no3d'), // skip the canvas entirely
  noenv: params.has('noenv'), // no reflection environment
  nomat: params.has('nomat'), // keep the model's original materials
  noanim: params.has('noanim'), // don't play animation clips
  dpr1: params.has('dpr1'), // render at 1x device pixel ratio
  debug: params.has('debug'), // log frame timings to the console

  // DOM side
  nonet: params.has('nonet'), // no neural-network background
  nocolor: params.has('nocolor'), // no drifting colour clouds
  skip: new Set((params.get('skip') ?? '').split(',').filter(Boolean)), // section names to leave out
  noreveal: params.has('noreveal'), // render Reveal as a plain div (no scroll-in animation)
  noblur: params.has('noblur'), // drop backdrop-blur on the skill cards
  nosmooth: params.has('nosmooth'), // native instant scrolling instead of CSS smooth scrolling
}
