import Reveal from '../components/Reveal'
import ProjectTile from '../components/ProjectTile'
import Marquee from '../components/Marquee'
import './Projects.css'

const CATEGORIES = ['Travel', 'Weddings', 'Nightlife', 'Afterparties', 'Events']

// Format alternates within each pair, and which format leads flips every
// row — wide-left/narrow-right, then narrow-left/wide-right, and so on —
// so the grid zigzags instead of settling into one fixed rhythm.
const PROJECTS = [
  { category: 'Travel', title: 'Sudeste Asiático', label: '[ TRAVEL ]', type: 'video', year: '2024', format: 'horizontal' },
  { category: 'Weddings', title: 'Laura & Marc', label: '[ WEDDING ]', type: 'photo', year: '2025', format: 'vertical' },
  { category: 'Nightlife', title: 'Noche Blanca Club', label: '[ NIGHTLIFE ]', type: 'video', year: '2025', format: 'vertical' },
  { category: 'Afterparties', title: 'After Costa Sur', label: '[ AFTERPARTY ]', type: 'photo', year: '2024', format: 'horizontal' },
  { category: 'Events', title: 'Festival Costa Sur', label: '[ EVENT ]', type: 'video', year: '2025', format: 'horizontal' },
  { category: 'Travel', title: 'Islas Griegas', label: '[ TRAVEL ]', type: 'photo', year: '2024', format: 'vertical' },
  { category: 'Weddings', title: 'Elena & Jon', label: '[ WEDDING ]', type: 'video', year: '2024', format: 'vertical' },
  { category: 'Nightlife', title: 'Pacha Rooftop', label: '[ NIGHTLIFE ]', type: 'photo', year: '2024', format: 'horizontal' },
  { category: 'Events', title: 'Sesión Privada Rooftop', label: '[ EVENT ]', type: 'photo', year: '2024', format: 'horizontal' },
  { category: 'Afterparties', title: 'Sunrise Session', label: '[ AFTERPARTY ]', type: 'video', year: '2024', format: 'vertical' },
  { category: 'Travel', title: 'Marruecos', label: '[ TRAVEL ]', type: 'photo', year: '2023', format: 'vertical' },
  { category: 'Events', title: 'Apertura Club Aurora', label: '[ EVENT ]', type: 'photo', year: '2023', format: 'horizontal' },
  { category: 'Weddings', title: 'Rooftop Vows', label: '[ WEDDING ]', type: 'photo', year: '2023', format: 'horizontal' },
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
        {/* Behind-the-title band — swap by replacing /public/highlights.mp4 */}
        <video
          className="projects__header-media"
          src="/highlights.mp4"
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
                    label={p.label}
                    ratio={RATIO_BY_FORMAT[p.format]}
                    type={p.type}
                    category={p.category}
                    title={p.title}
                    year={p.year}
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
