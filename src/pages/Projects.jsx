import Reveal from '../components/Reveal'
import ProjectTile from '../components/ProjectTile'
import Marquee from '../components/Marquee'
import './Projects.css'

const CATEGORIES = ['Travel', 'Weddings', 'Nightlife', 'Afterparties', 'Events']

const PROJECTS = [
  { category: 'Travel', title: 'Sudeste Asiático', label: '[ TRAVEL ]', type: 'video', ratio: '4 / 5', year: '2024', size: 'tall' },
  { category: 'Weddings', title: 'Laura & Marc', label: '[ WEDDING ]', type: 'photo', ratio: '4 / 3', year: '2025', size: 'wide' },
  { category: 'Nightlife', title: 'Noche Blanca Club', label: '[ NIGHTLIFE ]', type: 'video', ratio: '1 / 1', year: '2025', size: '' },
  { category: 'Afterparties', title: 'After Costa Sur', label: '[ AFTERPARTY ]', type: 'photo', ratio: '4 / 5', year: '2024', size: 'tall' },
  { category: 'Events', title: 'Festival Costa Sur', label: '[ EVENT ]', type: 'video', ratio: '4 / 3', year: '2025', size: 'wide' },
  { category: 'Travel', title: 'Islas Griegas', label: '[ TRAVEL ]', type: 'photo', ratio: '4 / 3', year: '2024', size: '' },
  { category: 'Weddings', title: 'Elena & Jon', label: '[ WEDDING ]', type: 'video', ratio: '4 / 5', year: '2024', size: 'tall' },
  { category: 'Nightlife', title: 'Pacha Rooftop', label: '[ NIGHTLIFE ]', type: 'photo', ratio: '1 / 1', year: '2024', size: '' },
  { category: 'Events', title: 'Sesión Privada Rooftop', label: '[ EVENT ]', type: 'photo', ratio: '4 / 5', year: '2024', size: 'tall' },
  { category: 'Afterparties', title: 'Sunrise Session', label: '[ AFTERPARTY ]', type: 'video', ratio: '4 / 3', year: '2024', size: 'wide' },
  { category: 'Travel', title: 'Marruecos', label: '[ TRAVEL ]', type: 'photo', ratio: '4 / 5', year: '2023', size: 'tall' },
  { category: 'Events', title: 'Apertura Club Aurora', label: '[ EVENT ]', type: 'photo', ratio: '1 / 1', year: '2023', size: '' },
  { category: 'Weddings', title: 'Rooftop Vows', label: '[ WEDDING ]', type: 'photo', ratio: '4 / 3', year: '2023', size: 'wide' },
]

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
          {PROJECTS.map((p, i) => (
            <Reveal
              as="div"
              key={`${p.category}-${p.title}`}
              delay={(i % 6) * 60}
              className={`projects__cell ${p.size ? `project-tile--${p.size}` : ''}`}
            >
              <ProjectTile
                label={p.label}
                ratio={p.ratio}
                type={p.type}
                category={p.category}
                title={p.title}
                year={p.year}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  )
}
