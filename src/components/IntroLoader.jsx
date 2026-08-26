import { useEffect, useState } from 'react'
import BrandLogo from './BrandLogo'
import './IntroLoader.css'

const HOLD_MS = 1150
const EXIT_MS = 500

export default function IntroLoader({ onDone }) {
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const t1 = setTimeout(() => setExiting(true), HOLD_MS)
    const t2 = setTimeout(() => {
      document.body.style.overflow = prevOverflow
      onDone()
    }, HOLD_MS + EXIT_MS)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      document.body.style.overflow = prevOverflow
    }
  }, [onDone])

  return (
    <div className={`intro-loader ${exiting ? 'intro-loader--exit' : ''}`} aria-hidden="true">
      <div className="grain" />
      <div className="intro-loader__logo">
        <BrandLogo size="lg" />
      </div>
    </div>
  )
}
