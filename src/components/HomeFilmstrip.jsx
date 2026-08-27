import { useEffect, useRef, useState } from 'react'
import TransitionLink from '../transitions/TransitionLink'
import './HomeFilmstrip.css'

// Same project titles as the Work page — kept as a local list rather than
// importing from Projects.jsx so Work stays fully untouched. Every slot is
// a video reel, so no photo/video distinction is needed here.
const PROJECTS = [
  'Sudeste Asiático',
  'Laura & Marc',
  'Noche Blanca Club',
  'After Costa Sur',
  'Festival Costa Sur',
  'Islas Griegas',
  'Elena & Jon',
  'Pacha Rooftop',
  'Sesión Privada Rooftop',
  'Sunrise Session',
  'Marruecos',
  'Apertura Club Aurora',
  'Rooftop Vows',
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

  return (
    <div className="home-filmstrip">
      <div
        className="home-filmstrip__track"
        ref={trackRef}
        onMouseLeave={() => setActiveIndex(null)}
      >
        {PROJECTS.map((title, i) => (
          <TransitionLink
            key={title}
            to="/proyectos"
            className={`home-filmstrip__item ${activeIndex === i ? 'home-filmstrip__item--active' : ''}`}
            onMouseEnter={() => setActiveIndex(i)}
            onFocus={() => setActiveIndex(i)}
          >
            <span className="home-filmstrip__title">{title}</span>
            <span className="home-filmstrip__thumb">
              <span className="home-filmstrip__play" aria-hidden="true">
                <PlayIcon />
              </span>
            </span>
          </TransitionLink>
        ))}
      </div>
    </div>
  )
}
