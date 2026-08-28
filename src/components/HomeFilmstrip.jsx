import { useEffect, useRef, useState } from 'react'
import TransitionLink from '../transitions/TransitionLink'
import './HomeFilmstrip.css'

// Same project titles as the Work page — kept as a local list rather than
// importing from Projects.jsx so Work stays fully untouched. A project can
// carry a real `video` asset (shown with no logo here — the logo only
// appears over the tile in Work); everything else stays a placeholder.
const PROJECTS = [
  { title: 'Tinglao Club', video: '/projects/tinglao-club.mp4', poster: '/projects/tinglao-club-poster.png' },
  { title: 'Laura & Marc' },
  { title: 'Noche Blanca Club' },
  { title: 'After Costa Sur' },
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
  useWheelToHorizontalScroll(trackRef)

  // Real footage stays muted and paused until hovered — with a 150MB+ clip
  // in the mix, nothing should download before someone actually asks for it.
  const handleThumbEnter = (i) => (e) => {
    setActiveIndex(i)
    const video = e.currentTarget.querySelector('.home-filmstrip__video')
    if (video) {
      video.currentTime = 0
      video.play().catch(() => {})
    }
  }

  const handleThumbLeave = (e) => {
    const video = e.currentTarget.querySelector('.home-filmstrip__video')
    if (video) {
      video.pause()
      video.currentTime = 0
    }
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
            onMouseLeave={handleThumbLeave}
            onFocus={handleThumbEnter(i)}
          >
            <span className="home-filmstrip__title">{project.title}</span>
            <span className="home-filmstrip__thumb">
              {project.video ? (
                <video
                  className="home-filmstrip__video"
                  src={project.video}
                  poster={project.poster}
                  muted
                  loop
                  playsInline
                  preload="none"
                />
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
