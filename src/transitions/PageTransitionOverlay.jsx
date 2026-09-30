import { useEffect, useRef } from 'react'
import './PageTransitionOverlay.css'

// Drop-in folder: save the file as public/videos/page-transition.mp4 and it
// just works, no code change needed. Only q_auto/f_auto before — no
// resize/crop — since .page-overlay__crop's offsets are calibrated to this
// exact frame; changing its dimensions would throw the eye crop off.
const TRANSITION_VIDEO_SRC = '/videos/page-transition.mp4'
// The clip opens with ~0.8s of the mark still drawing itself in (barely
// visible), then holds the fully-formed eye. Loop just that stable window so
// the eye is what's on screen whenever a transition actually fires.
const LOOP_START = 0.82
const LOOP_END = 2.6

// Stays mounted and quietly looping for the whole session (just hidden when
// idle) for two reasons: the clip is fully buffered before the first click,
// and — critically — the video keeps actively playing at all times. A
// <video> that's paused and only has its currentTime nudged doesn't reliably
// repaint in every browser; jumping the time on an already-playing element
// does, so we never depend on a fresh play() call succeeding at the exact
// moment someone clicks.
export default function PageTransitionOverlay({ phase }) {
  const videoRef = useRef(null)
  const active = phase !== 'idle'

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const ensurePlaying = () => {
      if (video.paused) video.play().catch(() => {})
    }

    const onTimeUpdate = () => {
      if (video.currentTime >= LOOP_END) video.currentTime = LOOP_START
    }
    video.addEventListener('timeupdate', onTimeUpdate)

    if (phase === 'covering') {
      video.currentTime = LOOP_START
      ensurePlaying()
    } else {
      ensurePlaying()
    }

    return () => video.removeEventListener('timeupdate', onTimeUpdate)
  }, [phase])

  return (
    <div className={`page-overlay ${active ? 'page-overlay--active' : ''}`} aria-hidden="true">
      <div className="page-overlay__logo">
        {/* The source clip is a tall 1080x1920 frame with the eye mark tiny
            and dead-center; this crop zooms into just that region (measured
            from the actual footage) so only the animated eye is visible. */}
        <div className="page-overlay__crop">
          <video
            ref={videoRef}
            className="page-overlay__video"
            src={TRANSITION_VIDEO_SRC}
            autoPlay
            muted
            playsInline
            preload="auto"
          />
        </div>
      </div>
    </div>
  )
}
