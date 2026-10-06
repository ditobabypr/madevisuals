import Placeholder from './Placeholder'
import TransitionLink from '../transitions/TransitionLink'
import useVideoPreview from '../hooks/useVideoPreview'
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
  // Real footage stays unloaded until previewed (hover, keyboard focus, or
  // press & hold on touch) — see useVideoPreview. startAt skips any dead
  // lead-in so the first visible frame is an appealing one. The poster is
  // its own layer (not the <video poster> attribute) so it reliably comes
  // back after every preview, and CSS only fades it once a frame is
  // actually playing (data-preview="playing").
  const { hostRef, videoRef, handlers } = useVideoPreview({ src: video, startAt })

  const loading = eager ? undefined : 'lazy'

  return (
    <TransitionLink
      ref={hostRef}
      to={to}
      className="project-tile"
      aria-label={title}
      {...(hasMedia ? handlers : null)}
    >
      {hasMedia ? (
        <div className="project-tile__media project-tile__media--video">
          <video ref={videoRef} className="project-tile__video" muted loop playsInline preload="none" aria-hidden="true" />
          {poster && (
            <img
              loading={loading}
              decoding="async"
              {...responsiveImage(poster, sizes)}
              alt=""
              draggable="false"
              className="project-tile__poster"
            />
          )}
          {logo && (
            <img
              loading={loading}
              decoding="async"
              src={logo}
              alt=""
              draggable="false"
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
