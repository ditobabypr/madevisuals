import { useEffect, useRef, useState } from 'react'
import TransitionLink from '../transitions/TransitionLink'
import './HomeFilmstrip.css'

const TINGLAO_VIDEO_URL =
  'https://res.cloudinary.com/xawdx2ki/video/upload/q_auto,f_auto/v1787933486/tinglao-club_1.mp4'
const TINGLAO_POSTER_URL =
  'https://res.cloudinary.com/xawdx2ki/image/upload/v1787932073/tinglao-club-poster.png'

const ANDRES_VIDEO_URL =
  'https://res.cloudinary.com/xawdx2ki/video/upload/q_auto,f_auto,w_1920/v1787934852/VIDEO_ANDRES_CON_CAMBIOS.mp4'
const ANDRES_POSTER_URL = '/projects/andres-poster.png'
// Matches the poster frame — the opening black-and-white shot of the full crowd.
const ANDRES_START_AT = 0

// Same project titles as the Work page — kept as a local list rather than
// importing from Projects.jsx so Work stays fully untouched. A project can
// carry a real `video` asset (shown with no logo here — the logo only
// appears over the tile in Work); everything else stays a placeholder.
const PROJECTS = [
  { title: 'Tinglao Club', video: TINGLAO_VIDEO_URL, poster: TINGLAO_POSTER_URL },
  { title: 'Laura & Marc' },
  { title: 'Noche Blanca Club' },
  { title: 'La Pizarra de Andrés', video: ANDRES_VIDEO_URL, poster: ANDRES_POSTER_URL, startAt: ANDRES_START_AT },
  { title: 'Festival Costa Sur' },
  { title: 'Islas Griegas' },
  { title: 'Elena & Jon' },
  { title: 'Pacha Rooftop' },
  { title: 'Sesión Privada Rooftop' },
  { title: 'Sunrise Session' },
  { title: 'Marruecos' },
  { title: 'Apertura Club Aurora' },
  { title: 'Rooftop Vows' },
]

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 7l8 5-8 5z" />
  </svg>
)

// Converts vertical mouse-wheel input into horizontal scroll so desktop
// users can browse the strip without a trackpad or shift+scroll — only
// matters on narrow viewports where the strip is allowed to overflow.
function useWheelToHorizontalScroll(ref) {
  useEffect(() => {
    const node = ref.current
    if (!node) return

    const onWheel = (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
      e.preventDefault()
      node.scrollLeft += e.deltaY
    }

    node.addEventListener('wheel', onWheel, { passive: false })
    return () => node.removeEventListener('wheel', onWheel)
  }, [ref])
}

export default function HomeFilmstrip() {
  const [activeIndex, setActiveIndex] = useState(null)
  const trackRef = useRef(null)
  const pendingSeeksRef = useRef({})
  useWheelToHorizontalScroll(trackRef)

  // Real footage stays muted and paused until hovered — with clips this
  // heavy, nothing should download before someone actually asks for it.
  // With preload="none" there's no metadata on the first hover, so setting
  // currentTime immediately is silently ignored — it has to wait for
  // loadedmetadata.
  const handleThumbEnter = (i) => (e) => {
    setActiveIndex(i)
    const video = e.currentTarget.querySelector('.home-filmstrip__video')
    const posterEl = e.currentTarget.querySelector('.home-filmstrip__poster')
    if (video) {
      const startAt = PROJECTS[i].startAt || 0
      // play() is what actually kicks off the fetch on a preload="none"
      // video — call it unconditionally, then correct the position once
      // metadata says seeking will actually stick.
      video.play().catch(() => {})
      if (video.readyState >= 1) {
        video.currentTime = startAt
      } else {
        const seek = () => {
          video.currentTime = startAt
        }
        pendingSeeksRef.current[i] = seek
        video.addEventListener('loadedmetadata', seek, { once: true })
      }
    }
    if (posterEl) posterEl.classList.add('home-filmstrip__poster--hidden')
  }

  const handleThumbLeave = (e, i) => {
    const video = e.currentTarget.querySelector('.home-filmstrip__video')
    const posterEl = e.currentTarget.querySelector('.home-filmstrip__poster')
    if (video) {
      if (pendingSeeksRef.current[i]) {
        video.removeEventListener('loadedmetadata', pendingSeeksRef.current[i])
        delete pendingSeeksRef.current[i]
      }
      video.pause()
      if (video.readyState >= 1) video.currentTime = PROJECTS[i].startAt || 0
    }
    if (posterEl) posterEl.classList.remove('home-filmstrip__poster--hidden')
  }

  return (
    <div className="home-filmstrip">
      <div
        className="home-filmstrip__track"
        ref={trackRef}
        onMouseLeave={() => setActiveIndex(null)}
      >
        {PROJECTS.map((project, i) => (
          <TransitionLink
            key={project.title}
            to="/proyectos"
            className={`home-filmstrip__item ${activeIndex === i ? 'home-filmstrip__item--active' : ''}`}
            onMouseEnter={handleThumbEnter(i)}
            onMouseLeave={(e) => handleThumbLeave(e, i)}
            onFocus={handleThumbEnter(i)}
          >
            <span className="home-filmstrip__title">{project.title}</span>
            <span className="home-filmstrip__thumb">
              {project.video ? (
                <>
                  <video
                    className="home-filmstrip__video"
                    src={project.video}
                    muted
                    loop
                    playsInline
                    preload="none"
                  />
                  {project.poster && (
                    <img src={project.poster} alt="" className="home-filmstrip__poster" />
                  )}
                </>
              ) : (
                <span className="home-filmstrip__play" aria-hidden="true">
                  <PlayIcon />
                </span>
              )}
            </span>
          </TransitionLink>
        ))}
      </div>
    </div>
  )
}
