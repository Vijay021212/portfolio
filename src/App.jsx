import Loader from './components/Loader'
import Nav from './components/Nav'
import SectionDots from './components/SectionDots'
import Footer from './components/Footer'
import Aurora from './components/Aurora'
import NeuralBackground from './components/NeuralBackground'
import RobotScene from './components/three/RobotScene'
import Hero from './sections/Hero'
import About from './sections/About'
import Skills from './sections/Skills'
import Experience from './sections/Experience'
import Projects from './sections/Projects'
import Achievements from './sections/Achievements'
import Contact from './sections/Contact'
import { flags } from './debug'

// Composition root: every piece of the page, in order. `show('x')` is false only when the URL says ?skip=x.
export default function App() {
  const show = (name) => !flags.skip.has(name)
  return (
    <>
      {show('loader') && <Loader />}
      {/* Fixed full-screen layers behind the page, in paint order: colour clouds, the neural net, then the robot. */}
      <Aurora />
      <NeuralBackground />
      <RobotScene />
      {show('nav') && <Nav />}
      {show('dots') && <SectionDots />}
      <main className="relative z-10">
        {show('hero') && <Hero />}
        {show('about') && <About />}
        {show('skills') && <Skills />}
        {show('experience') && <Experience />}
        {show('projects') && <Projects />}
        {show('achievements') && <Achievements />}
        {show('contact') && <Contact />}
        {show('footer') && <Footer />}
      </main>
    </>
  )
}
