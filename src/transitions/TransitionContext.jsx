import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PageTransitionOverlay, { LOOP_START } from './PageTransitionOverlay'
import { prefersReducedMotion } from '../hooks/usePrefersReducedMotion'

// Single place that owns the "cover -> navigate -> reveal" choreography used
// for every in-app navigation. Tune COVER_MS / REVEAL_MS to change the feel
// of every page transition on the site at once.
export const COVER_MS = 500
export const REVEAL_MS = 320
// If the next page somehow never renders (e.g. its chunk fails to load on a
// dropped connection), lift the cover anyway rather than trap the visitor.
const MAX_COVER_MS = 10000

const TransitionContext = createContext(null)

export function TransitionProvider({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [phase, setPhase] = useState('idle') // idle | covering | revealing
  const pending = useRef(null)
  const origin = useRef(null)
  const videoRef = useRef(null)
  // useNavigate() returns a new function whenever the location changes —
  // reading it through a ref keeps the timers below from restarting then.
  const navigateRef = useRef(navigate)
  navigateRef.current = navigate

  const go = useCallback(
    (path) => {
      if (!path || path === location.pathname) return
      if (phase !== 'idle') return
      if (prefersReducedMotion()) {
        navigate(path)
        return
      }
      pending.current = path
      origin.current = location.pathname
      // Started here, inside the click, so no browser policy can block it.
      const video = videoRef.current
      if (video) {
        video.currentTime = LOOP_START
        video.play().catch(() => {})
      }
      setPhase('covering')
    },
    [location.pathname, phase, navigate]
  )

  useEffect(() => {
    if (phase === 'covering') {
      const t = setTimeout(() => navigateRef.current(pending.current), COVER_MS)
      const failsafe = setTimeout(() => setPhase('revealing'), MAX_COVER_MS)
      return () => {
        clearTimeout(t)
        clearTimeout(failsafe)
      }
    }
    if (phase === 'revealing') {
      const t = setTimeout(() => {
        setPhase('idle')
        pending.current = null
      }, REVEAL_MS)
      return () => clearTimeout(t)
    }
  }, [phase])

  // Only uncover once the new page has actually rendered. Navigations run as
  // React transitions, so while a page's code is still downloading the old
  // page stays committed — lifting the cover on a timer alone would briefly
  // show the page being left, then swap.
  useEffect(() => {
    if (phase === 'covering' && location.pathname !== origin.current) {
      setPhase('revealing')
    }
  }, [phase, location.pathname])

  return (
    <TransitionContext.Provider value={{ go, phase }}>
      {children}
      <PageTransitionOverlay phase={phase} videoRef={videoRef} />
    </TransitionContext.Provider>
  )
}

export function useTransition() {
  const ctx = useContext(TransitionContext)
  if (!ctx) throw new Error('useTransition must be used inside TransitionProvider')
  return ctx
}
