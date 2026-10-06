import { forwardRef } from 'react'
import './PageTransitionOverlay.css'

// Drop-in folder: save the file as public/videos/page-transition.mp4 and it
// just works, no code change needed — but keep its dimensions: the crop
// offsets in PageTransitionOverlay.css are calibrated to this exact frame.
export const EYE_CLIP_SRC = '/videos/page-transition.mp4'

// The clip's timeline, measured frame by frame (25fps):
//   0.28s  the mark starts drawing itself in
//   1.28s  fully drawn
//   1.52s  first blink, eye open again by 1.80s
//   (then a second blink at 2.04s and a close at 3.04s — not used)
export const EYE_START = 0.26
// Cut right after the first blink.
export const EYE_END = 1.8
// Static open-eye frames between the two blinks — looped if the next page
// still isn't ready at EYE_END.
export const EYE_HOLD_START = 1.82
export const EYE_HOLD_END = 1.98

// The source clip is a tall 1080x1920 frame with the eye mark tiny and
// dead-center; the crop zooms into just that region so only the animated
// eye is visible.
const EyeClip = forwardRef(function EyeClip(props, ref) {
  return (
    <div className="page-overlay__crop">
      <video ref={ref} className="page-overlay__video" src={EYE_CLIP_SRC} muted playsInline preload="auto" {...props} />
    </div>
  )
})

export default EyeClip
