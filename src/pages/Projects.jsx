import Reveal from '../components/Reveal'
import ProjectTile from '../components/ProjectTile'
import Marquee from '../components/Marquee'
import { slugify } from '../utils/slugify'
import './Projects.css'

const CATEGORIES = ['Travel', 'Weddings', 'Nightlife', 'Afterparties', 'Events']

// Blurred/darkened band behind the page title — was pointing at a local
// /public/highlights.mp4 that's gitignored (too heavy for the repo), so it
// never actually existed on deploy. Reusing the Home hero reel here instead
// keeps this on a real, already-hosted asset; swap for a dedicated highlight
// reel later if one gets made.
const HEADER_VIDEO_URL =
  'https://res.cloudinary.com/xawdx2ki/video/upload/q_auto,f_auto,w_1920/v1787931099/COLOR.mp4'

const TINGLAO_VIDEO_URL =
  'https://res.cloudinary.com/xawdx2ki/video/upload/q_auto,f_auto/v1787933486/tinglao-club_1.mp4'
const TINGLAO_POSTER_URL =
  'https://res.cloudinary.com/xawdx2ki/image/upload/v1787932073/tinglao-club-poster.png'
const TINGLAO_LOGO_URL =
  'https://res.cloudinary.com/xawdx2ki/image/upload/v1787932072/tinglao-club-logo.png'

const ANDRES_VIDEO_URL =
  'https://res.cloudinary.com/xawdx2ki/video/upload/q_auto,f_auto,w_1920/v1787934852/VIDEO_ANDRES_CON_CAMBIOS.mp4'
const ANDRES_LOGO_URL =
  'https://res.cloudinary.com/xawdx2ki/image/upload/f_auto,q_auto/v1787935764/LAPIZARRA.png'
const ANDRES_POSTER_URL = '/projects/andres-poster.png'
// Matches the poster frame — the opening black-and-white shot of the full crowd.
const ANDRES_START_AT = 0
// The logo is a very wide wordmark (≈3.7:1) — less horizontal padding than
// the default lets it read at a reasonable size instead of shrinking to fit.
const ANDRES_LOGO_PADDING = '20% 2%'

const DUBS_VIDEO_URL =
  'https://res.cloudinary.com/xawdx2ki/video/upload/q_auto,f_auto,w_1920/v1788017903/DUBS_REELS.mp4'
const DUBS_LOGO_URL =
  'https://res.cloudinary.com/xawdx2ki/image/upload/e_trim/f_auto,q_auto/v1788049333/dubs2.png'
const DUBS_POSTER_URL = '/projects/elenajon-poster.png'
const DUBS_START_AT = 4
const DUBS_LOGO_PADDING = '38% 40%'

const LIFEPRO_VIDEO_URL =
  'https://res.cloudinary.com/xawdx2ki/video/upload/q_auto,f_auto,w_1920/v1788020405/LIFE_PRO_CORREGIDO_1.mp4'
const LIFEPRO_LOGO_URL =
  'https://res.cloudinary.com/xawdx2ki/image/upload/f_auto,q_auto/v1788020795/100.png'
const LIFEPRO_POSTER_URL = '/projects/laura-marc-poster.png'
const LIFEPRO_START_AT = 33.2
const LIFEPRO_LOGO_PADDING = '30% 4%'

const ROYALWEEK_VIDEO_URL =
  'https://res.cloudinary.com/xawdx2ki/video/upload/q_auto,f_auto,w_1920/v1788017583/AFTERMOVIE_ROYAL_WEEK_VOL_2_1.mp4'
const ROYALWEEK_LOGO_URL =
  'https://res.cloudinary.com/xawdx2ki/image/upload/f_auto,q_auto/v1788019320/Logo-Xcape-blanco.png'
const ROYALWEEK_POSTER_URL = '/projects/costa-sur-poster.png'
// True first frame of the file, before the "Royal Week" title text fades in.
const ROYALWEEK_START_AT = 0
const ROYALWEEK_LOGO_PADDING = '22% 6%'

const KARTING_VIDEO_URL =
  'https://res.cloudinary.com/xawdx2ki/video/upload/q_auto,f_auto,w_1920/v1788021039/karting_tu_sabes.mp4'
const KARTING_POSTER_URL = '/projects/islas-griegas-poster.png'
const KARTING_START_AT = 4
// No logo for this one — the client didn't provide one.

const SABIKA_VIDEO_URL =
  'https://res.cloudinary.com/xawdx2ki/video/upload/q_auto,f_auto,w_1920/v1788017301/SABIKA_MALAGA_1.mp4'
// Hosted locally instead of on Cloudinary — ruled out every code-side cause
// for the previous version not showing, so this removes any CDN/cache/
// network variable between the browser and the asset entirely.
const SABIKA_LOGO_URL = '/projects/sabika-logo-2.png'
const SABIKA_POSTER_URL = '/projects/pacha-rooftop-poster.png'
const SABIKA_START_AT = 8.3
const SABIKA_LOGO_PADDING = '18% 36%'

const CORONA_VIDEO_URL =
  'https://res.cloudinary.com/xawdx2ki/video/upload/q_auto,f_auto,w_1920/v1788016975/CORONA_X_BORAZ_1.mp4'
const CORONA_LOGO_URL =
  'https://res.cloudinary.com/xawdx2ki/image/upload/f_auto,q_auto/v1788047703/corona-extra-1-logo-png-transparent.png'
const CORONA_POSTER_URL = '/projects/sesion-privada-poster.png'
const CORONA_START_AT = 15.8
// This asset already has a lot of transparent margin baked in — light
// padding here compensates so the mark still reads at a good size.
const CORONA_LOGO_PADDING = '13% 10%'

const BOSSABORA_VIDEO_URL =
  'https://res.cloudinary.com/xawdx2ki/video/upload/q_auto,f_auto,w_1920/v1788018089/BOSSA_BORA_RECAP_2026.mp4'
const BOSSABORA_LOGO_URL =
  'https://res.cloudinary.com/xawdx2ki/image/upload/f_auto,q_auto/v1788047612/BossaBora_-_Logo.png'
const BOSSABORA_POSTER_URL = '/projects/sunrise-session-poster.png'
// First frame of real content — the clip opens straight into the crowd,
// no dead lead-in.
const BOSSABORA_START_AT = 0.3
const BOSSABORA_LOGO_PADDING = '18% 10%'

const SUMMON_VIDEO_URL =
  'https://res.cloudinary.com/xawdx2ki/video/upload/q_auto,f_auto,w_1920/v1788021717/SUMMON_REEL_GENERAL.mp4'
const SUMMON_LOGO_URL =
  'https://res.cloudinary.com/xawdx2ki/image/upload/f_auto,q_auto/v1788021875/summonfest.png'
const SUMMON_POSTER_URL = '/projects/noche-blanca-poster.png'
// Much closer to the start — less to seek/buffer to on hover, and this
// early frame (arm raised, sunlit crowd) is just as good as the later pick.
const SUMMON_START_AT = 1
const SUMMON_LOGO_PADDING = '42% 16%'

const DARELL_VIDEO_URL =
  'https://res.cloudinary.com/xawdx2ki/video/upload/q_auto,f_auto,w_1920/v1788016821/DARELL_SANTA_RITA_1.mp4'
// e_trim strips the huge transparent margin baked into the source file (the
// real wordmark is only 628×106 inside a 1200×630 canvas) — without it,
// padding tweaks were maxed out while the visible mark stayed tiny.
const DARELL_LOGO_URL =
  'https://res.cloudinary.com/xawdx2ki/image/upload/e_trim/f_auto,q_auto/v1788022208/Logo-Santa-Rita.png'
const DARELL_POSTER_URL = '/projects/marruecos-poster.png'
const DARELL_START_AT = 2
const DARELL_LOGO_PADDING = '38% 14%'

const ATRIA_VIDEO_URL =
  'https://res.cloudinary.com/xawdx2ki/video/upload/q_auto,f_auto,w_1920/v1788017102/ATRIA_X_NVOGA_-_VILLA_CASIA_1.mp4'
const ATRIA_LOGO_URL =
  'https://res.cloudinary.com/xawdx2ki/image/upload/f_auto,q_auto/v1788019488/nvoga_1.png'
const ATRIA_POSTER_URL = '/projects/apertura-aurora-poster.png'
const ATRIA_START_AT = 20.2
const ATRIA_LOGO_PADDING = '18% 22%'
// The wordmark itself is a very light, semi-transparent white — needs a
// darker backing than the other logos or it disappears into the footage.
const ATRIA_LOGO_BACKGROUND = 'rgba(6, 6, 7, 0.82)'

const CCR_VIDEO_URL =
  'https://res.cloudinary.com/xawdx2ki/video/upload/q_auto,f_auto,w_1920/v1788051253/BODA_26-7-11_1.mp4'
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
    title: 'Rooftop Vows',
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

function chunkPairs(items) {
  const rows = []
  for (let i = 0; i < items.length; i += 2) {
    rows.push(items.slice(i, i + 2))
  }
  return rows
}

export default function Projects() {
  return (
    <div className="page projects">
      <div className="projects__header">
        <video
          className="projects__header-media"
          src={HEADER_VIDEO_URL}
          autoPlay
          muted
          loop
          playsInline
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

      <Marquee items={CATEGORIES} speed={22} />

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
