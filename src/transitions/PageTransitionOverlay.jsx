import { useEffect } from 'react'
import EyeClip from './EyeClip'
import './PageTransitionOverlay.css'

// Stays mounted for the whole session (just hidden when idle) so the clip is
// fully buffered before the first click. It only plays while a transition is
// on screen — the provider starts it from inside the click itself (see
// TransitionContext's go()), so play() runs during the user gesture, and
// drives its timeline from there. This effect just stops it once idle.
export default function PageTransitionOverlay({ phase, videoRef }) {
  const active = phase !== 'idle'

  useEffect(() => {
    const video = videoRef.current
    if (!video || active) return
    // autoPlay is only there so every browser (iOS included) buffers the
    // whole clip up front — stop as soon as it has.
    if (video.readyState >= 4) {
      video.pause()
      return
    }
    const stop = () => video.pause()
    video.addEventListener('canplaythrough', stop, { once: true })
    return () => video.removeEventListener('canplaythrough', stop)
  }, [active, videoRef])

  return (
    <div className={`page-overlay ${active ? 'page-overlay--active' : ''}`} aria-hidden="true">
      <div className="page-overlay__logo">
        <EyeClip ref={videoRef} autoPlay />
      </div>
    </div>
  )
}
