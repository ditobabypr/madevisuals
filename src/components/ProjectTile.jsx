import { useRef } from 'react'
import Placeholder from './Placeholder'
import TransitionLink from '../transitions/TransitionLink'
import { prefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { responsiveImage } from '../utils/responsiveImage'
import './ProjectTile.css'

export default function ProjectTile({
  label,
  ratio = '4 / 5',
  type = 'photo',
  title,
  to = '/proyectos',
  video,
  logo,
  poster,
  startAt = 0,
  logoPadding,
  logoBackground,
  sizes = '100vw',
  eager = false,
}) {
  const hasMedia = Boolean(video)
  const pendingSeekRef = useRef(null)
  const pendingRevealRef = useRef(null)
  const playingRef = useRef(false)

  // Real footage stays paused until hovered — no reason to download it
  // for everyone who scrolls past. startAt skips past any dead/static
  // lead-in so the first visible frame is an appealing one. With
  // preload="none" the video has no metadata yet on the first hover, so
  // setting currentTime immediately is silently ignored — it has to wait
  // for loadedmetadata. The poster image is its own layer (rather than the
  // <video poster> attribute) so it reliably comes back on every mouse
  // leave, not just before the very first play. The poster only hides once
  // the video's `playing` event fires — otherwise on the first-ever hover,
  // with nothing buffered yet, it uncovers a blank/black element for a beat
  // before any frame has decoded.
  const startPreview = (tile) => {
    if (!hasMedia || playingRef.current || prefersReducedMotion()) return
    playingRef.current = true
    const v = tile.querySelector('.project-tile__video')
    const logoEl = tile.querySelector('.project-tile__logo')
    const posterEl = tile.querySelector('.project-tile__poster')
    if (v) {
      const reveal = () => {
        if (posterEl) posterEl.classList.add('project-tile__poster--hidden')
      }
      pendingRevealRef.current = reveal
      v.addEventListener('playing', reveal, { once: true })
      v.play().catch(() => {})
      if (v.readyState >= 1) {
        v.currentTime = startAt
      } else {
        const seek = () => {
          v.currentTime = startAt
        }
        pendingSeekRef.current = seek
        v.addEventListener('loadedmetadata', seek, { once: true })
      }
    }
    // The slow fade only plays going in — logoEl's own transition (declared
    // in CSS) handles that. Leaving just needs it snapping back instantly.
    if (logoEl) logoEl.classList.add('project-tile__logo--hidden')
  }

  const stopPreview = (tile) => {
    if (!playingRef.current) return
    playingRef.current = false
    const v = tile.querySelector('.project-tile__video')
    const logoEl = tile.querySelector('.project-tile__logo')
    const posterEl = tile.querySelector('.project-tile__poster')
    if (v) {
      if (pendingSeekRef.current) {
        v.removeEventListener('loadedmetadata', pendingSeekRef.current)
        pendingSeekRef.current = null
      }
      if (pendingRevealRef.current) {
        v.removeEventListener('playing', pendingRevealRef.current)
        pendingRevealRef.current = null
      }
      v.pause()
      if (v.readyState >= 1) v.currentTime = startAt
    }
    if (posterEl) posterEl.classList.remove('project-tile__poster--hidden')
    if (logoEl) {
      logoEl.style.transition = 'none'
      logoEl.classList.remove('project-tile__logo--hidden')
      void logoEl.offsetWidth // flush the style change before re-enabling
      requestAnimationFrame(() => {
        logoEl.style.transition = ''
      })
    }
  }

  // Previews follow a real mouse pointer or keyboard focus only — a tap on a
  // touch screen also fires enter events, which would start downloading the
  // clip right as the tap navigates away.
  const onPointerEnter = (e) => e.pointerType === 'mouse' && startPreview(e.currentTarget)
  const onPointerLeave = (e) => e.pointerType === 'mouse' && stopPreview(e.currentTarget)
  const onFocus = (e) => e.currentTarget.matches(':focus-visible') && startPreview(e.currentTarget)
  const onBlur = (e) => stopPreview(e.currentTarget)

  const loading = eager ? undefined : 'lazy'

  return (
    <TransitionLink
      to={to}
      className="project-tile"
      aria-label={title}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {hasMedia ? (
        <div className="project-tile__media project-tile__media--video">
          <video className="project-tile__video" src={video} muted loop playsInline preload="none" />
          {poster && (
            <img
              loading={loading}
              decoding="async"
              {...responsiveImage(poster, sizes)}
              alt=""
              className="project-tile__poster"
            />
          )}
          {logo && (
            <img
              loading={loading}
              decoding="async"
              src={logo}
              alt=""
              className="project-tile__logo"
              style={{
                ...(logoPadding ? { padding: logoPadding } : null),
                ...(logoBackground ? { background: logoBackground } : null),
              }}
            />
          )}
        </div>
      ) : (
        <Placeholder label={label} ratio={ratio} type={type} className="project-tile__media" />
      )}
    </TransitionLink>
  )
}
