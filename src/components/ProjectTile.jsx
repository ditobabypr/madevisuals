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
}) {
  const hasMedia = Boolean(video && logo)

  // Real footage stays paused until hovered — no reason to download it
  // for everyone who scrolls past.
  const handleEnter = (e) => {
    if (!hasMedia) return
    const v = e.currentTarget.querySelector('.project-tile__video')
    const logoEl = e.currentTarget.querySelector('.project-tile__logo')
    if (v) {
      v.currentTime = 0
      v.play().catch(() => {})
    }
    // The slow fade only plays going in — logoEl's own transition (declared
    // in CSS) handles that. Leaving just needs it snapping back instantly.
    if (logoEl) logoEl.classList.add('project-tile__logo--hidden')
  }

  const handleLeave = (e) => {
    if (!hasMedia) return
    const v = e.currentTarget.querySelector('.project-tile__video')
    const logoEl = e.currentTarget.querySelector('.project-tile__logo')
    if (v) {
      v.pause()
      v.currentTime = 0
    }
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
          <video
            className="project-tile__video"
            src={video}
            poster={poster}
            muted
            loop
            playsInline
            preload="none"
          />
          <img src={logo} alt={title} className="project-tile__logo" />
        </div>
      ) : (
        <Placeholder label={label} ratio={ratio} type={type} className="project-tile__media" />
      )}
    </TransitionLink>
  )
}
