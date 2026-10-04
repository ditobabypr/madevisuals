import { lazy, Suspense, useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { TransitionProvider } from './transitions/TransitionContext'
import ScrollToTop from './transitions/ScrollToTop'
import IntroLoader from './components/IntroLoader'
import LogoMark from './components/LogoMark'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import { prefersReducedMotion } from './hooks/usePrefersReducedMotion'

// Home loads eagerly (it's the entry point); the rest split into their own
// chunks so a first visit only pays for the page it lands on.
const PAGE_IMPORTS = [
  () => import('./pages/Projects'),
  () => import('./pages/ProjectDetail'),
  () => import('./pages/About'),
  () => import('./pages/Contact'),
  () => import('./pages/NotFound'),
]
const [Projects, ProjectDetail, About, Contact, NotFound] = PAGE_IMPORTS.map((load) => lazy(load))

// The page chunks are small — once the browser is idle after the first
// load, fetch them all so later navigations never wait on the network.
function usePrefetchPages() {
  useEffect(() => {
    const prefetch = () => PAGE_IMPORTS.forEach((load) => load().catch(() => {}))
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(prefetch, { timeout: 4000 })
      return () => window.cancelIdleCallback(id)
    }
    const t = setTimeout(prefetch, 2500)
    return () => clearTimeout(t)
  }, [])
}

// Only seen when landing directly on a page whose code hasn't arrived yet
// (in-app navigations keep the transition cover up instead). Fades in after
// a short delay so fast connections never see it at all.
function RouteFallback() {
  return (
    <div className="route-fallback" role="status" aria-label="Cargando">
      <LogoMark className="route-fallback__mark" />
    </div>
  )
}

// Home is a single-viewport, no-scroll hero — it never shows the footer.
function AppShell() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <TransitionProvider>
      <ScrollToTop />
      <Navbar />
      <main>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/proyectos" element={<Projects />} />
            <Route path="/proyectos/:slug" element={<ProjectDetail />} />
            <Route path="/sobre-mi" element={<About />} />
            <Route path="/contacto" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      {!isHome && <Footer />}
    </TransitionProvider>
  )
}

export default function App() {
  // Purely decorative — skipped for visitors who ask for reduced motion.
  const [introActive, setIntroActive] = useState(() => !prefersReducedMotion())
  usePrefetchPages()

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppShell />
      {introActive && <IntroLoader onDone={() => setIntroActive(false)} />}
    </BrowserRouter>
  )
}
