import { useEffect } from 'react'
import './PageTransitionOverlay.css'

// Drop-in folder: save the file as public/videos/page-transition.mp4 and it
// just works, no code change needed. Only q_auto/f_auto before — no
// resize/crop — since .page-overlay__crop's offsets are calibrated to this
// exact frame; changing its dimensions would throw the eye crop off.
const TRANSITION_VIDEO_SRC = '/videos/page-transition.mp4'
// The clip opens with ~0.8s of the mark still drawing itself in (barely
// visible), then holds the fully-formed eye. Loop just that stable window so
// the eye is what's on screen whenever a transition actually fires.
export const LOOP_START = 0.82
const LOOP_END = 2.6

// Stays mounted for the whole session (just hidden when idle) so the clip is
// fully buffered before the first click. It only plays while a transition
// is on screen — decoding it nonstop behind an invisible overlay cost
// battery on phones for nothing. The provider starts it from inside the
// click itself (see TransitionContext's go()), so play() runs during the
// user gesture and repaints reliably; this effect just keeps it looping
// while visible and stops it afterwards.
export default function PageTransitionOverlay({ phase, videoRef }) {
  const active = phase !== 'idle'

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (!active) {
      // autoPlay is only there so every browser (iOS included) buffers the
      // whole clip up front — stop as soon as it has.
      if (video.readyState >= 4) {
        video.pause()
        return
      }
      const stop = () => video.pause()
      video.addEventListener('canplaythrough', stop, { once: true })
      return () => video.removeEventListener('canplaythrough', stop)
    }

    const onTimeUpdate = () => {
      if (video.currentTime >= LOOP_END) video.currentTime = LOOP_START
    }
    video.addEventListener('timeupdate', onTimeUpdate)
    if (video.paused) video.play().catch(() => {})

    return () => video.removeEventListener('timeupdate', onTimeUpdate)
  }, [active, videoRef])

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
