import { useCallback, useEffect, useRef } from 'react'
import { isKeyboardFocus, prefersReducedMotion } from './usePrefersReducedMotion'

// Shared hover/focus/touch preview for the muted clips on Work tiles and the
// Home filmstrip. Nothing is fetched until someone actually asks for a clip:
// the <video> has no src at all until the first preview, and lets go of it
// again once it's scrolled away or the page is left.
//
//   mouse     hover → play, leave → poster
//   keyboard  focus → play, blur → poster
//   touch     press & hold → play, lift → poster (no navigation)
//             quick tap → navigates as usual, nothing downloaded
//             scroll/swipe → nothing (the browser cancels the pointer)
//
// State is written to the host element as data-preview="loading|playing",
// so CSS drives the poster/logo swap without a React re-render.

// Delay before a resting finger counts as "press & hold" rather than a tap
// or the start of a scroll.
const HOLD_DELAY_MS = 140
// A press released before this is still a (slow) tap and navigates.
const TAP_MAX_MS = 450
// Finger travel that turns a press into a scroll gesture.
const MOVE_TOLERANCE_PX = 10
// Touching the screen to stop a momentum scroll isn't asking for a preview.
const SCROLL_QUIET_MS = 120
// How long after a long press its trailing click (if any) is swallowed.
const SUPPRESS_CLICK_MS = 700

let lastScrollAt = 0
if (typeof window !== 'undefined') {
  // Capture also catches scrolls inside the filmstrip track.
  window.addEventListener('scroll', () => (lastScrollAt = performance.now()), { passive: true, capture: true })
}

// Only one clip plays at a time across the page.
let active = null

export default function useVideoPreview({ src, startAt = 0, onActiveChange, autoplay = false } = {}) {
  const hostRef = useRef(null)
  const videoRef = useRef(null)
  const reasons = useRef(new Set())
  const touch = useRef(null)
  const suppressClickUntil = useRef(0)
  const releaseObserver = useRef(null)
  const onActiveChangeRef = useRef(onActiveChange)
  onActiveChangeRef.current = onActiveChange

  // The #t fragment makes the browser request bytes from startAt directly
  // instead of downloading from the top of the file and then seeking.
  const srcWithStart = src && startAt ? `${src}#t=${startAt}` : src

  const setState = (state) => {
    const host = hostRef.current
    if (!host) return
    if (state) host.dataset.preview = state
    else delete host.dataset.preview
  }

  const release = useCallback(() => {
    releaseObserver.current?.disconnect()
    releaseObserver.current = null
    const v = videoRef.current
    if (!v || !v.hasAttribute('src')) return
    v.pause()
    v.removeAttribute('src')
    v.load() // aborts any download and frees the decoder
  }, [])

  const stop = useCallback(() => {
    reasons.current.clear()
    clearTimeout(touch.current?.timer)
    touch.current = null
    if (active?.reasons === reasons.current) active = null
    setState(null)
    onActiveChangeRef.current?.(false)

    const v = videoRef.current
    if (!v || !v.hasAttribute('src')) return
    v.pause()
    if (v.readyState >= 1) v.currentTime = startAt
    // Keep the clip for a quick re-hover, but drop it once it's well out of
    // view so it can't keep buffering in the background.
    if (!releaseObserver.current && hostRef.current && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting && !reasons.current.size) release()
        },
        { rootMargin: '50%' }
      )
      io.observe(hostRef.current)
      releaseObserver.current = io
    }
  }, [startAt, release])

  const start = useCallback(() => {
    if (active && active.reasons !== reasons.current) active.stop()
    active = { reasons: reasons.current, stop }
    // Highlight states (e.g. the filmstrip's title) still follow the
    // pointer for reduced-motion visitors — only the clip is skipped.
    onActiveChangeRef.current?.(true)
    const v = videoRef.current
    if (!v || !srcWithStart || prefersReducedMotion()) return
    setState('loading')

    // iOS only lets a clip start outside a direct tap (the hold timer isn't
    // one) if it's muted as an *attribute* — React only sets the property.
    v.muted = true
    v.defaultMuted = true
    v.setAttribute('muted', '')
    if (!v.hasAttribute('src')) v.src = srcWithStart
    // The poster only lifts once a frame is actually on screen — never onto
    // a blank element while the first bytes arrive.
    v.addEventListener('playing', () => reasons.current.size && setState('playing'), { once: true })
    const seek = () => {
      if (Math.abs(v.currentTime - startAt) > 0.3) v.currentTime = startAt
    }
    if (v.readyState >= 1) seek()
    else v.addEventListener('loadedmetadata', seek, { once: true })
    v.play().catch(() => {})
  }, [srcWithStart, startAt, stop])

  const add = (reason) => {
    const wasIdle = reasons.current.size === 0
    reasons.current.add(reason)
    if (wasIdle) start()
  }
  const remove = (reason) => {
    if (reasons.current.delete(reason) && reasons.current.size === 0) stop()
  }

  const cancelTouch = () => {
    if (!touch.current) return
    clearTimeout(touch.current.timer)
    touch.current = null
    remove('touch')
  }

  // Externally driven preview (the phone filmstrip's centre slot).
  useEffect(() => {
    if (autoplay) add('auto')
    else remove('auto')
  }, [autoplay])

  // Leaving the page mid-preview: abort the download right away instead of
  // waiting for garbage collection.
  useEffect(() => {
    const v = videoRef.current
    const reasonSet = reasons.current
    return () => {
      clearTimeout(touch.current?.timer)
      releaseObserver.current?.disconnect()
      if (active?.reasons === reasonSet) active = null
      if (v?.hasAttribute('src')) {
        v.pause()
        v.removeAttribute('src')
        v.load()
      }
    }
  }, [])

  const handlers = {
    onPointerEnter: (e) => e.pointerType === 'mouse' && add('hover'),
    onPointerLeave: (e) => e.pointerType === 'mouse' && remove('hover'),
    onFocus: (e) => isKeyboardFocus(e.currentTarget) && add('focus'),
    onBlur: () => remove('focus'),

    // Touch uses touch events rather than pointer events: browsers fire
    // pointercancel as soon as they *might* turn a press into a gesture
    // (Android does on long presses), which killed the preview mid-hold.
    // Touch events keep reporting until the finger actually lifts.
    onTouchStart: (e) => {
      cancelTouch()
      if (e.touches.length !== 1) return
      if (performance.now() - lastScrollAt < SCROLL_QUIET_MS) return
      const { clientX, clientY } = e.touches[0]
      const t = { x: clientX, y: clientY, at: performance.now(), held: false }
      t.timer = setTimeout(() => {
        // The page started moving under the finger — that's a scroll.
        if (lastScrollAt > t.at) return
        t.held = true
        add('touch')
      }, HOLD_DELAY_MS)
      touch.current = t
    },
    onTouchMove: (e) => {
      const t = touch.current
      const p = e.touches[0]
      if (t && p && Math.hypot(p.clientX - t.x, p.clientY - t.y) > MOVE_TOLERANCE_PX) cancelTouch()
    },
    onTouchEnd: (e) => {
      const t = touch.current
      if (!t) return
      // A long press was a preview — lifting the finger shouldn't also open
      // the project. Cancelling touchend stops the click being synthesised;
      // the click guard below covers browsers that send it anyway.
      if (t.held && performance.now() - t.at >= TAP_MAX_MS) {
        if (e.cancelable) e.preventDefault()
        suppressClickUntil.current = performance.now() + SUPPRESS_CLICK_MS
      }
      cancelTouch()
    },
    onTouchCancel: cancelTouch,
    // Long-pressing a link opens the system link menu on Android.
    onContextMenu: (e) => {
      if (touch.current?.held) e.preventDefault()
    },
    // Runs before TransitionLink's onClick, which bails on defaultPrevented.
    onClickCapture: (e) => {
      if (performance.now() < suppressClickUntil.current) {
        suppressClickUntil.current = 0
        e.preventDefault()
      }
    },
  }

  return { hostRef, videoRef, handlers }
}
