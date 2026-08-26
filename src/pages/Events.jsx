import Reveal from '../components/Reveal'
import MediaCard from '../components/MediaCard'
import './Events.css'

const EVENTS = [
  { name: 'Festival Costa Sur', category: 'Festival', year: '2025', type: 'video' },
  { name: 'Lanzamiento Marca XYZ', category: 'Marca / Producto', year: '2025', type: 'photo' },
  { name: 'Noche Blanca Club', category: 'Discoteca', year: '2024', type: 'video' },
  { name: 'Sesión Privada Rooftop', category: 'Evento privado', year: '2024', type: 'photo' },
  { name: 'Neon Nights Tour', category: 'Discoteca', year: '2024', type: 'video' },
  { name: 'Activación Streetwear Co.', category: 'Marca', year: '2023', type: 'photo' },
  { name: 'Fiesta Blanca Ibiza', category: 'Fiesta', year: '2023', type: 'video' },
  { name: 'Apertura Club Aurora', category: 'Discoteca', year: '2023', type: 'photo' },
]

export default function Events() {
  return (
    <div className="page events">
      <div className="container">
        <Reveal className="section-head">
          <p className="kicker">Trabajos audiovisuales</p>
          <h1 className="page-title">Eventos</h1>
          <p className="section-lede">
            Colaboro con marcas, clubs y organizadores creando contenido
            audiovisual a medida para fiestas, experiencias y eventos privados.
          </p>
        </Reveal>

        <div className="events__grid">
          {EVENTS.map((ev, i) => (
            <Reveal as="div" key={ev.name} delay={(i % 4) * 70}>
              <MediaCard
                label="[ EVENTO ]"
                ratio="4 / 5"
                type={ev.type}
                tag={ev.category}
                meta={ev.year}
                title={ev.name}
                cta="Ver evento"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  )
}
