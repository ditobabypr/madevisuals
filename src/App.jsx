import { lazy, Suspense, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { TransitionProvider } from './transitions/TransitionContext'
import ScrollToTop from './transitions/ScrollToTop'
import IntroLoader from './components/IntroLoader'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'

// Home loads eagerly (it's the entry point); the rest split into their own
// chunks so a first visit only pays for the page it lands on.
const Projects = lazy(() => import('./pages/Projects'))
const Events = lazy(() => import('./pages/Events'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))

export default function App() {
  const [introActive, setIntroActive] = useState(true)

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <TransitionProvider>
        <ScrollToTop />
        <Navbar />
        <main>
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/proyectos" element={<Projects />} />
              <Route path="/eventos" element={<Events />} />
              <Route path="/sobre-mi" element={<About />} />
              <Route path="/contacto" element={<Contact />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </TransitionProvider>

      {introActive && <IntroLoader onDone={() => setIntroActive(false)} />}
    </BrowserRouter>
  )
}
