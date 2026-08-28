import { useRef } from 'react'
import Placeholder from './Placeholder'
import TransitionLink from '../transitions/TransitionLink'
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
}) {
  const hasMedia = Boolean(video && logo)
  const pendingSeekRef = useRef(null)

  // Real footage stays paused until hovered — no reason to download it
  // for everyone who scrolls past. startAt skips past any dead/static
  // lead-in so the first visible frame is an appealing one. With
  // preload="none" the video has no metadata yet on the first hover, so
  // setting currentTime immediately is silently ignored — it has to wait
  // for loadedmetadata. The poster image is its own layer (rather than the
  // <video poster> attribute) so it reliably comes back on every mouse
  // leave, not just before the very first play.
  const handleEnter = (e) => {
    if (!hasMedia) return
    const v = e.currentTarget.querySelector('.project-tile__video')
    const logoEl = e.currentTarget.querySelector('.project-tile__logo')
    const posterEl = e.currentTarget.querySelector('.project-tile__poster')
    if (v) {
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
    if (posterEl) posterEl.classList.add('project-tile__poster--hidden')
    // The slow fade only plays going in — logoEl's own transition (declared
    // in CSS) handles that. Leaving just needs it snapping back instantly.
    if (logoEl) logoEl.classList.add('project-tile__logo--hidden')
  }

  const handleLeave = (e) => {
    if (!hasMedia) return
    const v = e.currentTarget.querySelector('.project-tile__video')
    const logoEl = e.currentTarget.querySelector('.project-tile__logo')
    const posterEl = e.currentTarget.querySelector('.project-tile__poster')
    if (v) {
      if (pendingSeekRef.current) {
        v.removeEventListener('loadedmetadata', pendingSeekRef.current)
        pendingSeekRef.current = null
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

  return (
    <TransitionLink to={to} className="project-tile" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      {hasMedia ? (
        <div className="project-tile__media project-tile__media--video">
          <video className="project-tile__video" src={video} muted loop playsInline preload="none" />
          {poster && <img src={poster} alt="" className="project-tile__poster" />}
          <img
            src={logo}
            alt={title}
            className="project-tile__logo"
            style={logoPadding ? { padding: logoPadding } : undefined}
          />
        </div>
      ) : (
        <Placeholder label={label} ratio={ratio} type={type} className="project-tile__media" />
      )}
    </TransitionLink>
  )
}
