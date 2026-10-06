import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PageTransitionOverlay from './PageTransitionOverlay'
import { EYE_END, EYE_HOLD_END, EYE_HOLD_START, EYE_START } from './EyeClip'
import { prefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { prefetchPath } from '../routes'

// Single place that owns the "cover -> navigate -> reveal" choreography used
// for every in-app navigation. The eye draws itself in, blinks once, and
// the new page is revealed right after the blink.
// The route changes behind the cover early on (COVER_MS), so the next page
// loads and renders while the animation is still playing.
export const COVER_MS = 500
// 0 so the cover starts fading right after the blink, exactly like the intro.
export const REVEAL_MS = 0
// The clip stalled (not buffered yet, or blocked) — once the page is ready,
// don't keep the visitor staring at a frozen cover longer than this.
const STALLED_CLIP_MS = 1000
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
  const pageReady = useRef(false)
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
      // The next page's code loads in parallel with the animation.
      prefetchPath(path)
      pending.current = path
      origin.current = location.pathname
      pageReady.current = false
      // Started here, inside the click, so no browser policy can block it.
      const video = videoRef.current
      if (video) {
        video.currentTime = EYE_START
        video.play().catch(() => {})
      }
      setPhase('covering')
    },
    [location.pathname, phase, navigate]
  )

  useEffect(() => {
    if (phase === 'covering') {
      const startedAt = performance.now()
      const t = setTimeout(() => navigateRef.current(pending.current), COVER_MS)
      const failsafe = setTimeout(() => setPhase('revealing'), MAX_COVER_MS)

      // Follows the clip frame by frame: reveal right after the blink. If
      // the page isn't ready by then, hold on the open eye and wait.
      let frame = requestAnimationFrame(function tick() {
        const video = videoRef.current
        const playing = video && !video.paused && video.readyState >= 2
        if (playing && video.currentTime >= EYE_END) {
          if (pageReady.current) return setPhase('revealing')
          if (video.currentTime >= EYE_HOLD_END) video.currentTime = EYE_HOLD_START
        } else if (!playing && pageReady.current && performance.now() - startedAt > STALLED_CLIP_MS) {
          return setPhase('revealing')
        }
        frame = requestAnimationFrame(tick)
      })

      return () => {
        clearTimeout(t)
        clearTimeout(failsafe)
        cancelAnimationFrame(frame)
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

  // The new page counts as ready once it has actually rendered. Navigations
  // run as React transitions, so while a page's code is still downloading
  // the old page stays committed — revealing on the clip alone could
  // briefly show the page being left.
  useEffect(() => {
    if (phase === 'covering' && location.pathname !== origin.current) {
      pageReady.current = true
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
