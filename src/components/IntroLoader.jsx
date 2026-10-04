import { useEffect, useState } from 'react'
import LogoMark from './LogoMark'
import './IntroLoader.css'

// First visit: just long enough for the logo's entrance animation (700ms)
// to land before it exits. Returning visitors have already seen it, so it
// plays as a quick blink instead of making them wait again.
const FIRST_HOLD_MS = 800
const REPEAT_HOLD_MS = 350
const EXIT_MS = 500
const SEEN_KEY = 'madevisuals:intro-seen'

function hasSeenIntro() {
  try {
    return localStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
}

function markIntroSeen() {
  try {
    localStorage.setItem(SEEN_KEY, '1')
  } catch {
    // Storage blocked (private mode etc.) — just shows the full intro again.
  }
}

export default function IntroLoader({ onDone }) {
  const [quick] = useState(hasSeenIntro)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    markIntroSeen()

    const hold = quick ? REPEAT_HOLD_MS : FIRST_HOLD_MS
    const t1 = setTimeout(() => setExiting(true), hold)
    const t2 = setTimeout(() => {
      document.body.style.overflow = prevOverflow
      onDone()
    }, hold + EXIT_MS)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      document.body.style.overflow = prevOverflow
    }
  }, [onDone, quick])

  return (
    <div
      className={`intro-loader ${quick ? 'intro-loader--quick' : ''} ${exiting ? 'intro-loader--exit' : ''}`}
      aria-hidden="true"
    >
      <div className="grain" />
      <div className="intro-loader__logo">
        <LogoMark />
      </div>
    </div>
  )
}
