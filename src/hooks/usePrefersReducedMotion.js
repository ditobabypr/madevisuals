import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.(QUERY).matches
}

// True when an element got focus from the keyboard. Safari before 15.4
// doesn't know :focus-visible and throws on it — treat that as "no".
export function isKeyboardFocus(el) {
  try {
    return el.matches(':focus-visible')
  } catch {
    return false
  }
}

// Live version for components — CSS already shortens animations on its own;
// this covers what CSS can't, like autoplaying video.
export default function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(prefersReducedMotion)

  useEffect(() => {
    const mql = window.matchMedia(QUERY)
    const onChange = () => setReduced(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return reduced
}
