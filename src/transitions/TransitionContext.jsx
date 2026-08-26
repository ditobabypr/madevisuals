import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PageTransitionOverlay from './PageTransitionOverlay'

// Single place that owns the "cover -> navigate -> reveal" choreography used
// for every in-app navigation. Tune COVER_MS / REVEAL_MS to change the feel
// of every page transition on the site at once.
export const COVER_MS = 420
export const REVEAL_MS = 420

const TransitionContext = createContext(null)

export function TransitionProvider({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [phase, setPhase] = useState('idle') // idle | covering | revealing
  const pending = useRef(null)

  const go = useCallback(
    (path) => {
      if (!path || path === location.pathname) return
      if (phase !== 'idle') return
      pending.current = path
      setPhase('covering')
    },
    [location.pathname, phase]
  )

  useEffect(() => {
    if (phase === 'covering') {
      const t = setTimeout(() => {
        if (pending.current) navigate(pending.current)
        setPhase('revealing')
      }, COVER_MS)
      return () => clearTimeout(t)
    }
    if (phase === 'revealing') {
      const t = setTimeout(() => {
        setPhase('idle')
        pending.current = null
      }, REVEAL_MS)
      return () => clearTimeout(t)
    }
  }, [phase, navigate])

  return (
    <TransitionContext.Provider value={{ go, phase }}>
      {children}
      <PageTransitionOverlay phase={phase} />
    </TransitionContext.Provider>
  )
}

export function useTransition() {
  const ctx = useContext(TransitionContext)
  if (!ctx) throw new Error('useTransition must be used inside TransitionProvider')
  return ctx
}
