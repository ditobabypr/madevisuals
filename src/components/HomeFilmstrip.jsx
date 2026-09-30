import { useEffect, useRef, useState } from 'react'
import TransitionLink from '../transitions/TransitionLink'
import { slugify } from '../utils/slugify'
import './HomeFilmstrip.css'

// Drop-in folder: save the file as exactly this name in public/videos/ and
// it just works, no code change needed. Same for every other *_VIDEO_URL.
const TINGLAO_VIDEO_URL = '/videos/tinglao-club.mp4'
const TINGLAO_POSTER_URL = '/projects/tinglao-club-poster.png'

const ANDRES_VIDEO_URL = '/videos/la-pizarra-de-andres.mp4'
const ANDRES_POSTER_URL = '/projects/andres-poster.png'
// Matches the poster frame — the opening black-and-white shot of the full crowd.
const ANDRES_START_AT = 0

const LIFEPRO_VIDEO_URL = '/videos/lifepro.mp4'
const LIFEPRO_POSTER_URL = '/projects/laura-marc-poster.png'
const LIFEPRO_START_AT = 33.2

const SUMMON_VIDEO_URL = '/videos/sumoon-fest.mp4'
const SUMMON_POSTER_URL = '/projects/noche-blanca-poster.png'
const SUMMON_START_AT = 1

const ROYALWEEK_VIDEO_URL = '/videos/xcape-royal-week.mp4'
const ROYALWEEK_POSTER_URL = '/projects/costa-sur-poster.png'
const ROYALWEEK_START_AT = 0

const KARTING_VIDEO_URL = '/videos/karting-del-sol.mp4'
const KARTING_POSTER_URL = '/projects/islas-griegas-poster.png'
const KARTING_START_AT = 4

const DUBS_VIDEO_URL = '/videos/dubs-burger.mp4'
const DUBS_POSTER_URL = '/projects/elenajon-poster.png'
const DUBS_START_AT = 4

const SABIKA_VIDEO_URL = '/videos/sabika.mp4'
const SABIKA_POSTER_URL = '/projects/pacha-rooftop-poster.png'
const SABIKA_START_AT = 8.3

const CORONA_VIDEO_URL = '/videos/corona-extra.mp4'
const CORONA_POSTER_URL = '/projects/sesion-privada-poster.png'
const CORONA_START_AT = 15.8

const BOSSABORA_VIDEO_URL = '/videos/bossa-bora.mp4'
const BOSSABORA_POSTER_URL = '/projects/sunrise-session-poster.png'
const BOSSABORA_START_AT = 0.3

const DARELL_VIDEO_URL = '/videos/santa-rita.mp4'
const DARELL_POSTER_URL = '/projects/marruecos-poster.png'
const DARELL_START_AT = 2

const ATRIA_VIDEO_URL = '/videos/nvoga.mp4'
const ATRIA_POSTER_URL = '/projects/apertura-aurora-poster.png'
const ATRIA_START_AT = 20.2

const CCR_VIDEO_URL = '/videos/boda.mp4'
const CCR_POSTER_URL = '/projects/rooftop-vows-poster.png'
const CCR_START_AT = 0

// Same project titles as the Work page — kept as a local list rather than
// importing from Projects.jsx so Work stays fully untouched. A project can
// carry a real `video` asset (shown with no logo here — the logo only
// appears over the tile in Work); everything else stays a placeholder.
const PROJECTS = [
  { title: 'Tinglao Club', video: TINGLAO_VIDEO_URL, poster: TINGLAO_POSTER_URL },
  { title: 'Lifepro', video: LIFEPRO_VIDEO_URL, poster: LIFEPRO_POSTER_URL, startAt: LIFEPRO_START_AT },
  { title: 'Sumoon Fest', video: SUMMON_VIDEO_URL, poster: SUMMON_POSTER_URL, startAt: SUMMON_START_AT },
  { title: 'La Pizarra de Andrés', video: ANDRES_VIDEO_URL, poster: ANDRES_POSTER_URL, startAt: ANDRES_START_AT },
  { title: 'Xcape', video: ROYALWEEK_VIDEO_URL, poster: ROYALWEEK_POSTER_URL, startAt: ROYALWEEK_START_AT },
  { title: 'Karting del Sol', video: KARTING_VIDEO_URL, poster: KARTING_POSTER_URL, startAt: KARTING_START_AT },
  { title: 'Dubs Burger', video: DUBS_VIDEO_URL, poster: DUBS_POSTER_URL, startAt: DUBS_START_AT },
  { title: 'Sabika', video: SABIKA_VIDEO_URL, poster: SABIKA_POSTER_URL, startAt: SABIKA_START_AT },
  { title: 'Corona Extra', video: CORONA_VIDEO_URL, poster: CORONA_POSTER_URL, startAt: CORONA_START_AT },
  { title: 'Bossa Bora', video: BOSSABORA_VIDEO_URL, poster: BOSSABORA_POSTER_URL, startAt: BOSSABORA_START_AT },
  { title: 'Santa Rita', video: DARELL_VIDEO_URL, poster: DARELL_POSTER_URL, startAt: DARELL_START_AT },
  { title: 'Nvoga', video: ATRIA_VIDEO_URL, poster: ATRIA_POSTER_URL, startAt: ATRIA_START_AT },
  { title: 'Boda', video: CCR_VIDEO_URL, poster: CCR_POSTER_URL, startAt: CCR_START_AT },
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
  const pendingRevealsRef = useRef({})
  useWheelToHorizontalScroll(trackRef)

  // Real footage stays muted and paused until hovered — with clips this
  // heavy, nothing should download before someone actually asks for it.
  // With preload="none" there's no metadata on the first hover, so setting
  // currentTime immediately is silently ignored — it has to wait for
  // loadedmetadata. The poster only hides once `playing` fires, so the
  // first-ever hover never uncovers a blank/black video before a frame has
  // actually decoded.
  const handleThumbEnter = (i) => (e) => {
    setActiveIndex(i)
    const video = e.currentTarget.querySelector('.home-filmstrip__video')
    const posterEl = e.currentTarget.querySelector('.home-filmstrip__poster')
    if (video) {
      const startAt = PROJECTS[i].startAt || 0
      const reveal = () => {
        if (posterEl) posterEl.classList.add('home-filmstrip__poster--hidden')
      }
      pendingRevealsRef.current[i] = reveal
      video.addEventListener('playing', reveal, { once: true })
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
  }

  const handleThumbLeave = (e, i) => {
    const video = e.currentTarget.querySelector('.home-filmstrip__video')
    const posterEl = e.currentTarget.querySelector('.home-filmstrip__poster')
    if (video) {
      if (pendingSeeksRef.current[i]) {
        video.removeEventListener('loadedmetadata', pendingSeeksRef.current[i])
        delete pendingSeeksRef.current[i]
      }
      if (pendingRevealsRef.current[i]) {
        video.removeEventListener('playing', pendingRevealsRef.current[i])
        delete pendingRevealsRef.current[i]
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
            to={`/proyectos/${slugify(project.title)}`}
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
