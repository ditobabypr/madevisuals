import { useMemo, useState } from 'react'
import Reveal from '../components/Reveal'
import MediaCard from '../components/MediaCard'
import './Projects.css'

const FILTERS = ['Todos', 'Viajes', 'Bodas', 'Discotecas', 'Afterparties']

const PROJECTS = [
  { category: 'Viajes', title: 'Sudeste Asiático', label: '[ VIAJES — SUDESTE ASIÁTICO ]', type: 'video', ratio: '4 / 5', size: 'tall' },
  { category: 'Bodas', title: 'Laura & Marc', label: '[ BODA — LAURA & MARC ]', type: 'photo', ratio: '4 / 3', size: 'wide' },
  { category: 'Discotecas', title: 'Noche Blanca Club', label: '[ DISCOTECA — NOCHE BLANCA ]', type: 'video', ratio: '1 / 1', size: '' },
  { category: 'Afterparties', title: 'After Costa Sur', label: '[ AFTERPARTY — COSTA SUR ]', type: 'photo', ratio: '4 / 5', size: 'tall' },
  { category: 'Viajes', title: 'Islas Griegas', label: '[ VIAJES — ISLAS GRIEGAS ]', type: 'photo', ratio: '4 / 3', size: 'wide' },
  { category: 'Bodas', title: 'Elena & Jon', label: '[ BODA — ELENA & JON ]', type: 'video', ratio: '4 / 5', size: 'tall' },
  { category: 'Discotecas', title: 'Pacha Rooftop', label: '[ DISCOTECA — PACHA ROOFTOP ]', type: 'photo', ratio: '1 / 1', size: '' },
  { category: 'Afterparties', title: 'Sunrise Session', label: '[ AFTERPARTY — SUNRISE SESSION ]', type: 'video', ratio: '4 / 3', size: 'wide' },
  { category: 'Viajes', title: 'Marruecos', label: '[ VIAJES — MARRUECOS ]', type: 'photo', ratio: '4 / 5', size: 'tall' },
  { category: 'Bodas', title: 'Rooftop Vows', label: '[ BODA — ROOFTOP VOWS ]', type: 'photo', ratio: '4 / 3', size: 'wide' },
]

export default function Projects() {
  const [active, setActive] = useState('Todos')

  const visible = useMemo(
    () => (active === 'Todos' ? PROJECTS : PROJECTS.filter((p) => p.category === active)),
    [active]
  )

  return (
    <div className="page projects">
      <div className="container">
        <Reveal className="section-head">
          <p className="kicker">Portfolio</p>
          <h1 className="page-title">Proyectos</h1>
          <p className="section-lede">
            Cuatro áreas de trabajo, un mismo enfoque: contar la historia real
            de cada momento con una estética limpia y cinematográfica.
          </p>
        </Reveal>

        <div className="projects__filters" role="tablist" aria-label="Filtrar proyectos por categoría">
          {FILTERS.map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={active === f}
              className={`projects__filter ${active === f ? 'projects__filter--active' : ''}`}
              onClick={() => setActive(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="projects__grid">
          {visible.map((p) => (
            <Reveal as="div" key={p.title} className={`projects__item ${p.size ? `media-card--${p.size}` : ''}`}>
              <MediaCard
                label={p.label}
                ratio={p.ratio}
                type={p.type}
                tag={p.category}
                title={p.title}
                cta="Ver proyecto"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  )
}
