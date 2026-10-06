import { useRef } from 'react'
import Reveal from '../components/Reveal'
import ProjectTile from '../components/ProjectTile'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import useAutoplay from '../hooks/useAutoplay'
import { slugify } from '../utils/slugify'
import './Projects.css'

// Blurred/darkened band behind the page title — the same clip as Home's
// hero reel, exported at 640x360 (~1.8 MB instead of 14 MB): under the 7px
// blur the extra resolution was invisible. Re-export it from
// public/videos/hero-header.mp4 whenever that changes.
const HEADER_VIDEO_URL = '/videos/hero-header-blur.mp4'
const HEADER_POSTER_URL = '/videos/hero-poster-blur.jpg'

// Downloaded locally from the client's own YouTube upload after Cloudinary
// disabled the account (out of bandwidth) — see public/videos/.
const TINGLAO_VIDEO_URL = '/videos/tinglao-club.mp4'
const TINGLAO_POSTER_URL = '/projects/tinglao-club-poster.png'
// Drop-in folder: save the file as exactly this name in public/logos/ and it
// just works, no code change needed. Same for every other *_LOGO_URL below.
const TINGLAO_LOGO_URL = '/logos/tinglao-club.png'

const ANDRES_VIDEO_URL = '/videos/la-pizarra-de-andres.mp4'
const ANDRES_LOGO_URL = '/logos/la-pizarra-de-andres.png'
const ANDRES_POSTER_URL = '/projects/andres-poster.png'
// Matches the poster frame — the opening black-and-white shot of the full crowd.
const ANDRES_START_AT = 0
// The logo is a very wide wordmark (≈3.7:1) — less horizontal padding than
// the default lets it read at a reasonable size instead of shrinking to fit.
const ANDRES_LOGO_PADDING = '18% 4%'

// Drop-in folder: save the file as exactly this name in public/videos/ and
// it just works, no code change needed.
const DUBS_VIDEO_URL = '/videos/dubs-burger.mp4'
const DUBS_LOGO_URL = '/logos/dubs-burger.png'
const DUBS_POSTER_URL = '/projects/elenajon-poster.png'
const DUBS_START_AT = 4
const DUBS_LOGO_PADDING = '26% 28%'

const LIFEPRO_VIDEO_URL = '/videos/lifepro.mp4'
const LIFEPRO_LOGO_URL = '/logos/lifepro.png'
const LIFEPRO_POSTER_URL = '/projects/laura-marc-poster.png'
const LIFEPRO_START_AT = 33.2
const LIFEPRO_LOGO_PADDING = '30% 4%'

const ROYALWEEK_VIDEO_URL = '/videos/xcape-royal-week.mp4'
const ROYALWEEK_LOGO_URL = '/logos/xcape.png'
const ROYALWEEK_POSTER_URL = '/projects/costa-sur-poster.png'
// True first frame of the file, before the "Royal Week" title text fades in.
const ROYALWEEK_START_AT = 0
const ROYALWEEK_LOGO_PADDING = '19% 8%'

const KARTING_VIDEO_URL = '/videos/karting-del-sol.mp4'
const KARTING_POSTER_URL = '/projects/islas-griegas-poster.png'
const KARTING_START_AT = 4
// No logo for this one — the client didn't provide one.

const SABIKA_VIDEO_URL = '/videos/sabika.mp4'
// Hosted locally instead of on Cloudinary — ruled out every code-side cause
// for the previous version not showing, so this removes any CDN/cache/
// network variable between the browser and the asset entirely.
const SABIKA_LOGO_URL = '/projects/sabika-logo-2.png'
const SABIKA_POSTER_URL = '/projects/pacha-rooftop-poster.png'
const SABIKA_START_AT = 8.3
const SABIKA_LOGO_PADDING = '18% 36%'

const CORONA_VIDEO_URL = '/videos/corona-extra.mp4'
const CORONA_LOGO_URL = '/logos/corona-extra.png'
const CORONA_POSTER_URL = '/projects/sesion-privada-poster.png'
const CORONA_START_AT = 15.8
// This asset already has a lot of transparent margin baked in — light
// padding here compensates so the mark still reads at a good size.
const CORONA_LOGO_PADDING = '10% 7%'

const BOSSABORA_VIDEO_URL = '/videos/bossa-bora.mp4'
const BOSSABORA_LOGO_URL = '/logos/bossa-bora.png'
const BOSSABORA_POSTER_URL = '/projects/sunrise-session-poster.png'
// First frame of real content — the clip opens straight into the crowd,
// no dead lead-in.
const BOSSABORA_START_AT = 0.3
const BOSSABORA_LOGO_PADDING = '18% 10%'

const SUMMON_VIDEO_URL = '/videos/sumoon-fest.mp4'
const SUMMON_LOGO_URL = '/logos/sumoon-fest.png'
const SUMMON_POSTER_URL = '/projects/noche-blanca-poster.png'
// Much closer to the start — less to seek/buffer to on hover, and this
// early frame (arm raised, sunlit crowd) is just as good as the later pick.
const SUMMON_START_AT = 1
const SUMMON_LOGO_PADDING = '36% 13%'

const DARELL_VIDEO_URL = '/videos/santa-rita.mp4'
// Cloudinary used to auto-trim this (e_trim) — the real wordmark is only
// 628×106, now cropped tight to that same size, so the padding below still
// applies as before.
const DARELL_LOGO_URL = '/logos/santa-rita.png'
const DARELL_POSTER_URL = '/projects/marruecos-poster.png'
const DARELL_START_AT = 2
const DARELL_LOGO_PADDING = '38% 14%'

const ATRIA_VIDEO_URL = '/videos/nvoga.mp4'
const ATRIA_LOGO_URL = '/logos/nvoga.png'
const ATRIA_POSTER_URL = '/projects/apertura-aurora-poster.png'
const ATRIA_START_AT = 20.2
// Bumped up from '18% 22%' — the local file is now cropped tight to the
// mark (no transparent margin like the old Cloudinary asset had), so it
// needs more padding to render at the same size as before.
const ATRIA_LOGO_PADDING = '19% 21%'
// The wordmark itself is a very light, semi-transparent white — needs a
// darker backing than the other logos or it disappears into the footage.
const ATRIA_LOGO_BACKGROUND = 'rgba(6, 6, 7, 0.82)'

const CCR_VIDEO_URL = '/videos/boda.mp4'
const CCR_POSTER_URL = '/projects/rooftop-vows-poster.png'
// True first frame of the file — no dead/black lead-in to skip.
const CCR_START_AT = 0
// No logo for this one — the client didn't provide one.

// Format alternates within each pair, and which format leads flips every
// row — wide-left/narrow-right, then narrow-left/wide-right, and so on —
// so the grid zigzags instead of settling into one fixed rhythm.
const PROJECTS = [
  {
    category: 'Nightlife',
    title: 'Tinglao Club',
    label: '[ NIGHTLIFE ]',
    type: 'video',
    year: '',
    format: 'horizontal',
    video: TINGLAO_VIDEO_URL,
    logo: TINGLAO_LOGO_URL,
    poster: TINGLAO_POSTER_URL,
  },
  {
    category: 'Weddings',
    title: 'Lifepro',
    label: '[ WEDDING ]',
    type: 'video',
    year: '2025',
    format: 'vertical',
    video: LIFEPRO_VIDEO_URL,
    logo: LIFEPRO_LOGO_URL,
    poster: LIFEPRO_POSTER_URL,
    startAt: LIFEPRO_START_AT,
    logoPadding: LIFEPRO_LOGO_PADDING,
  },
  {
    category: 'Nightlife',
    title: 'Sumoon Fest',
    label: '[ NIGHTLIFE ]',
    type: 'video',
    year: '2025',
    format: 'vertical',
    video: SUMMON_VIDEO_URL,
    logo: SUMMON_LOGO_URL,
    poster: SUMMON_POSTER_URL,
    startAt: SUMMON_START_AT,
    logoPadding: SUMMON_LOGO_PADDING,
  },
  {
    category: 'Events',
    title: 'La Pizarra de Andrés',
    label: '[ EVENT ]',
    type: 'video',
    year: '',
    format: 'horizontal',
    video: ANDRES_VIDEO_URL,
    logo: ANDRES_LOGO_URL,
    poster: ANDRES_POSTER_URL,
    startAt: ANDRES_START_AT,
    logoPadding: ANDRES_LOGO_PADDING,
  },
  {
    category: 'Events',
    title: 'Xcape',
    label: '[ EVENT ]',
    type: 'video',
    year: '2025',
    format: 'horizontal',
    video: ROYALWEEK_VIDEO_URL,
    logo: ROYALWEEK_LOGO_URL,
    poster: ROYALWEEK_POSTER_URL,
    startAt: ROYALWEEK_START_AT,
    logoPadding: ROYALWEEK_LOGO_PADDING,
  },
  {
    category: 'Travel',
    title: 'Karting del Sol',
    label: '[ TRAVEL ]',
    type: 'video',
    year: '2024',
    format: 'vertical',
    video: KARTING_VIDEO_URL,
    poster: KARTING_POSTER_URL,
    startAt: KARTING_START_AT,
  },
  {
    category: 'Weddings',
    title: 'Dubs Burger',
    label: '[ WEDDING ]',
    type: 'video',
    year: '2024',
    format: 'vertical',
    video: DUBS_VIDEO_URL,
    logo: DUBS_LOGO_URL,
    poster: DUBS_POSTER_URL,
    startAt: DUBS_START_AT,
    logoPadding: DUBS_LOGO_PADDING,
  },
  {
    category: 'Nightlife',
    title: 'Sabika',
    label: '[ NIGHTLIFE ]',
    type: 'video',
    year: '2024',
    format: 'horizontal',
    video: SABIKA_VIDEO_URL,
    logo: SABIKA_LOGO_URL,
    poster: SABIKA_POSTER_URL,
    startAt: SABIKA_START_AT,
    logoPadding: SABIKA_LOGO_PADDING,
  },
  {
    category: 'Events',
    title: 'Corona Extra',
    label: '[ EVENT ]',
    type: 'video',
    year: '2024',
    format: 'horizontal',
    video: CORONA_VIDEO_URL,
    logo: CORONA_LOGO_URL,
    poster: CORONA_POSTER_URL,
    startAt: CORONA_START_AT,
    logoPadding: CORONA_LOGO_PADDING,
  },
  {
    category: 'Afterparties',
    title: 'Bossa Bora',
    label: '[ AFTERPARTY ]',
    type: 'video',
    year: '2024',
    format: 'vertical',
    video: BOSSABORA_VIDEO_URL,
    logo: BOSSABORA_LOGO_URL,
    poster: BOSSABORA_POSTER_URL,
    startAt: BOSSABORA_START_AT,
    logoPadding: BOSSABORA_LOGO_PADDING,
  },
  {
    category: 'Travel',
    title: 'Santa Rita',
    label: '[ TRAVEL ]',
    type: 'video',
    year: '2023',
    format: 'vertical',
    video: DARELL_VIDEO_URL,
    logo: DARELL_LOGO_URL,
    poster: DARELL_POSTER_URL,
    startAt: DARELL_START_AT,
    logoPadding: DARELL_LOGO_PADDING,
  },
  {
    category: 'Events',
    title: 'Nvoga',
    label: '[ EVENT ]',
    type: 'video',
    year: '2023',
    format: 'horizontal',
    video: ATRIA_VIDEO_URL,
    logo: ATRIA_LOGO_URL,
    poster: ATRIA_POSTER_URL,
    startAt: ATRIA_START_AT,
    logoPadding: ATRIA_LOGO_PADDING,
    logoBackground: ATRIA_LOGO_BACKGROUND,
  },
  {
    category: 'Weddings',
    title: 'Boda',
    label: '[ WEDDING ]',
    type: 'video',
    year: '2023',
    format: 'horizontal',
    video: CCR_VIDEO_URL,
    poster: CCR_POSTER_URL,
    startAt: CCR_START_AT,
  },
]

const RATIO_BY_FORMAT = { horizontal: '3 / 2', vertical: '4 / 5' }
// Rendered width of each tile: a row splits 2.2 : 1 between the formats,
// and stacks to full width on phones.
const SIZES_BY_FORMAT = {
  horizontal: '(max-width: 620px) 100vw, 66vw',
  vertical: '(max-width: 620px) 100vw, 32vw',
}

function chunkPairs(items) {
  const rows = []
  for (let i = 0; i < items.length; i += 2) {
    rows.push(items.slice(i, i + 2))
  }
  return rows
}

export default function Projects() {
  const reducedMotion = usePrefersReducedMotion()
  const headerVideoRef = useRef(null)
  useAutoplay(headerVideoRef, !reducedMotion)

  return (
    <div className="page projects">
      <div className="projects__header">
        <video
          ref={headerVideoRef}
          className="projects__header-media"
          src={HEADER_VIDEO_URL}
          poster={HEADER_POSTER_URL}
          autoPlay={!reducedMotion}
          preload={reducedMotion ? 'none' : 'auto'}
          muted
          loop
          playsInline
          aria-hidden="true"
        />
        <div className="projects__header-overlay" />

        <div className="container projects__header-inner">
          <Reveal as="div" className="projects__title-block">
            <h1 className="page-title projects__title">Work</h1>
          </Reveal>

          <Reveal as="div" delay={100} className="projects__intro">
            <p className="section-lede">
              Una mezcla de proyectos, un mismo enfoque: contar la historia real
              de cada momento con una estética limpia y cinematográfica.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="container">
        <div className="projects__grid">
          {chunkPairs(PROJECTS).map((row, rowIndex) => (
            <div className="projects__row" key={rowIndex}>
              {row.map((p, i) => (
                <Reveal
                  as="div"
                  key={`${p.category}-${p.title}`}
                  delay={((rowIndex * 2 + i) % 6) * 60}
                  className={`projects__cell projects__cell--${p.format}`}
                >
                  <ProjectTile
                    to={`/proyectos/${slugify(p.title)}`}
                    label={p.label}
                    ratio={RATIO_BY_FORMAT[p.format]}
                    type={p.type}
                    category={p.category}
                    title={p.title}
                    year={p.year}
                    video={p.video}
                    logo={p.logo}
                    poster={p.poster}
                    startAt={p.startAt}
                    logoPadding={p.logoPadding}
                    logoBackground={p.logoBackground}
                    sizes={SIZES_BY_FORMAT[p.format]}
                    eager={rowIndex === 0}
                  />
                </Reveal>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
