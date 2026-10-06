import { useEffect } from 'react'

const RETRY_EVENTS = ['pointerdown', 'touchstart', 'keydown', 'scroll']

// Makes a decorative background video start reliably in Safari. The
// autoPlay attribute alone isn't enough there: React sets `muted` only as a
// property (Safari wants the attribute before it allows autoplay), and iOS
// Low Power Mode blocks autoplay outright — in that case it retries on the
// visitor's first touch/scroll, which counts as a user gesture.
//
// It also pauses the clip while it's scrolled out of view (e.g. Work's
// blurred header once you're down in the grid) — decoding and filtering
// frames nobody can see only costs battery and smoothness on phones.
export default function useAutoplay(ref, enabled = true) {
  useEffect(() => {
    const video = ref.current
    if (!video || !enabled) return

    video.muted = true
    video.defaultMuted = true
    video.setAttribute('muted', '')

    let onScreen = true
    const tryPlay = () => {
      if (onScreen && video.paused) video.play().catch(() => {})
    }
    const onGesture = () => {
      tryPlay()
      RETRY_EVENTS.forEach((type) => window.removeEventListener(type, onGesture))
    }

    tryPlay()
    video.addEventListener('canplay', tryPlay)
    RETRY_EVENTS.forEach((type) => window.addEventListener(type, onGesture, { passive: true }))

    let observer
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting
        if (onScreen) tryPlay()
        else video.pause()
      })
      observer.observe(video)
    }

    return () => {
      video.removeEventListener('canplay', tryPlay)
      RETRY_EVENTS.forEach((type) => window.removeEventListener(type, onGesture))
      observer?.disconnect()
    }
  }, [ref, enabled])
}
