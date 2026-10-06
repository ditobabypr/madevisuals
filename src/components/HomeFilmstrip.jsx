import { useEffect, useRef, useState } from 'react'
import TransitionLink from '../transitions/TransitionLink'
import useVideoPreview from '../hooks/useVideoPreview'
import { InstagramIcon, LinkedInIcon, YouTubeIcon } from './SocialIcons'
import { INSTAGRAM, LINKEDIN, YOUTUBE } from '../data/socials'
import { slugify } from '../utils/slugify'
import { responsiveImage } from '../utils/responsiveImage'
import './HomeFilmstrip.css'

// Thumbs render ≈ 1/13 of the viewport (fixed 92–110px when the strip
// scrolls on phones).
const THUMB_SIZES = '(max-width: 620px) 110px, 13vw'

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

// Desktop only — on phones the same links live in the menu.
const SOCIALS = [
  { ...INSTAGRAM, Icon: InstagramIcon },
  { ...YOUTUBE, Icon: YouTubeIcon },
  { ...LINKEDIN, Icon: LinkedInIcon },
]

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 7l8 5-8 5z" />
  </svg>
)

// Converts vertical mouse-wheel input into horizontal scroll so desktop
// users can browse the strip without a trackpad or shift+scroll — only
// when the strip actually overflows (narrow viewports).
function useWheelToHorizontalScroll(ref) {
  useEffect(() => {
    const node = ref.current
    if (!node) return

    const onWheel = (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
      if (node.scrollWidth <= node.clientWidth) return
      e.preventDefault()
      node.scrollLeft += e.deltaY
    }

    node.addEventListener('wheel', onWheel, { passive: false })
    return () => node.removeEventListener('wheel', onWheel)
  }, [ref])
}

// Phones: the strip scrolls sideways past a fixed centre slot (see CSS).
const CENTER_MODE_QUERY = '(max-width: 620px)'
// A thumb has to rest in the centre this long before its clip starts, so a
// quick swipe across the strip doesn't start (and download) every clip.
const CENTER_SETTLE_MS = 260

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])
  return matches
}

// Which thumb sits under the strip's centre line, and which one has stayed
// there long enough to play. Clips only start once the visitor has actually
// moved the strip — landing on Home doesn't start downloading one.
function useCenteredItem(trackRef, enabled) {
  const [centerIndex, setCenterIndex] = useState(enabled ? 0 : null)
  const [playIndex, setPlayIndex] = useState(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track || !enabled) {
      setCenterIndex(null)
      setPlayIndex(null)
      return
    }

    let frame = 0
    let settle = 0
    let current = -1
    let touched = false

    const measure = () => {
      frame = 0
      const items = track.querySelectorAll('.home-filmstrip__item')
      const middle = track.scrollLeft + track.clientWidth / 2
      let best = 0
      let bestDistance = Infinity
      items.forEach((item, i) => {
        const distance = Math.abs(item.offsetLeft + item.offsetWidth / 2 - middle)
        if (distance < bestDistance) {
          bestDistance = distance
          best = i
        }
      })
      if (best === current) return
      current = best
      setCenterIndex(best)
      setPlayIndex(null)
      clearTimeout(settle)
      if (touched) settle = setTimeout(() => setPlayIndex(best), CENTER_SETTLE_MS)
    }

    const onScroll = () => {
      if (!touched) {
        touched = true
        current = -1 // re-arm the settle timer for wherever it is now
      }
      if (!frame) frame = requestAnimationFrame(measure)
    }

    measure()
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      track.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
      clearTimeout(settle)
    }
  }, [trackRef, enabled])

  return [centerIndex, playIndex]
}

// Real footage stays unloaded until someone asks for it — mouse hover or
// keyboard focus on desktop, resting in the centre slot on phones (see
// useVideoPreview). A plain tap still opens the project.
function FilmstripItem({ project, active, autoplay, centerMode, onActiveChange }) {
  const { hostRef, videoRef, handlers } = useVideoPreview({
    src: project.video,
    startAt: project.startAt || 0,
    // In centre mode the strip's position alone decides what's active.
    onActiveChange: centerMode ? undefined : onActiveChange,
    autoplay,
  })

  // The centre slot replaces press & hold on phones.
  const itemHandlers = centerMode
    ? Object.fromEntries(Object.entries(handlers).filter(([name]) => !/^onTouch|^onContextMenu/.test(name)))
    : handlers

  return (
    <TransitionLink
      ref={hostRef}
      to={`/proyectos/${slugify(project.title)}`}
      className={`home-filmstrip__item ${active ? 'home-filmstrip__item--active' : ''}`}
      {...itemHandlers}
    >
      <span className="home-filmstrip__title">{project.title}</span>
      <span className="home-filmstrip__thumb">
        {project.video ? (
          <>
            <video ref={videoRef} className="home-filmstrip__video" muted loop playsInline preload="none" aria-hidden="true" />
            {project.poster && (
              <img
                decoding="async"
                {...responsiveImage(project.poster, THUMB_SIZES)}
                alt=""
                draggable="false"
                className="home-filmstrip__poster"
              />
            )}
          </>
        ) : (
          <span className="home-filmstrip__play" aria-hidden="true">
            <PlayIcon />
          </span>
        )}
      </span>
    </TransitionLink>
  )
}

export default function HomeFilmstrip() {
  const [hoverIndex, setHoverIndex] = useState(null)
  const trackRef = useRef(null)
  const centerMode = useMediaQuery(CENTER_MODE_QUERY)
  const [centerIndex, playIndex] = useCenteredItem(trackRef, centerMode)
  useWheelToHorizontalScroll(trackRef)

  const activeIndex = centerMode ? centerIndex : hoverIndex

  return (
    <div className="home-filmstrip">
      <nav className="home-filmstrip__socials" aria-label="Redes sociales">
        {SOCIALS.map(({ label, href, Icon }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}>
            <Icon />
          </a>
        ))}
      </nav>
      <div className="home-filmstrip__track" ref={trackRef}>
        {PROJECTS.map((project, i) => (
          <FilmstripItem
            key={project.title}
            project={project}
            active={activeIndex === i}
            autoplay={centerMode && playIndex === i}
            centerMode={centerMode}
            onActiveChange={(on) => setHoverIndex((current) => (on ? i : current === i ? null : current))}
          />
        ))}
      </div>
    </div>
  )
}
