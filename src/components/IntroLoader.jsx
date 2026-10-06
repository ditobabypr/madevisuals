import { useEffect, useRef, useState } from 'react'
import LogoMark from './LogoMark'
import EyeClip, { EYE_CLIP_SRC, EYE_END, EYE_START } from '../transitions/EyeClip'
import './IntroLoader.css'

// Plays the eye animation — it draws itself in, blinks once, and the intro
// fades out right after the blink. The page underneath renders (and the hero video
// buffers) the whole time.
// Same ~2s as a page transition: the clip from EYE_START to EYE_END plus
// this fade.
const EXIT_MS = 320
// If the clip hasn't started by then (slow network, or iOS Low Power Mode
// blocking autoplay), fall back to the still logo with its own short
// entrance instead of holding a black screen.
const CLIP_WAIT_MS = 1200
const FALLBACK_HOLD_MS = 800
// Never longer than this, whatever the clip does.
const MAX_INTRO_MS = 5000

export default function IntroLoader({ onDone }) {
  const [exiting, setExiting] = useState(false)
  const [fallback, setFallback] = useState(false)
  const videoRef = useRef(null)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const timers = []
    let frame = 0
    let exited = false

    // Once the fade-out starts, hand the page back: scroll and taps work
    // immediately instead of after the fade finishes.
    const exit = () => {
      if (exited) return
      exited = true
      cancelAnimationFrame(frame)
      document.body.style.overflow = prevOverflow
      setExiting(true)
      timers.push(setTimeout(() => onDoneRef.current(), EXIT_MS))
    }

    const video = videoRef.current
    let started = false
    if (video) {
      // Safari only autoplays when muted is an attribute, not just the
      // property React sets.
      video.muted = true
      video.setAttribute('muted', '')
      video.play().then(() => (started = true), () => {})
      frame = requestAnimationFrame(function tick() {
        if (video.currentTime >= EYE_END) return exit()
        frame = requestAnimationFrame(tick)
      })
    }

    timers.push(
      setTimeout(() => {
        if (started && !video.paused) return
        cancelAnimationFrame(frame)
        setFallback(true)
        timers.push(setTimeout(exit, FALLBACK_HOLD_MS))
      }, CLIP_WAIT_MS)
    )
    timers.push(setTimeout(exit, MAX_INTRO_MS))

    return () => {
      timers.forEach(clearTimeout)
      cancelAnimationFrame(frame)
      document.body.style.overflow = prevOverflow
    }
  }, [])

  return (
    <div className={`intro-loader ${exiting ? 'intro-loader--exit' : ''}`} aria-hidden="true">
      <div className="grain" />
      {fallback ? (
        <div className="intro-loader__logo intro-loader__logo--still">
          <LogoMark />
        </div>
      ) : (
        <div className="intro-loader__logo">
          {/* #t skips the clip's black lead-in even before it's buffered. */}
          <EyeClip ref={videoRef} src={`${EYE_CLIP_SRC}#t=${EYE_START}`} />
        </div>
      )}
    </div>
  )
}
