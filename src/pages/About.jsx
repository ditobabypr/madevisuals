import Reveal from '../components/Reveal'
import Placeholder from '../components/Placeholder'
import TransitionLink from '../transitions/TransitionLink'
import './About.css'

const PROFILE_PHOTO = '/projects/perfil.jpg'

// La sección "How I work" de la página About pinta una tarjeta por cada
// objeto de esta lista, en orden. Para cambiar el texto, edita `title` y
// `text` aquí abajo. Para añadir o quitar una tarjeta, copia/borra un bloque
// entero de estos ({ index, title, text }) — el resto de la página se ajusta
// solo, no hay que tocar nada más.
const PHILOSOPHY = [
  {
    index: '01',
    title: 'see',
    text: 'Antes de crear, hay que observar. Entender el espacio, las personas, la energía y aquello que hace diferente a cada proyecto. La imagen empieza mucho antes de encender la cámara.',
  },
  {
    index: '02',
    title: 'Connect',
    text: 'La confianza cambia la imagen. Crear un vínculo real permite que las personas se olviden de la cámara y que los momentos sucedan sin sentirse construidos.',
  },
  {
    index: '03',
    title: 'make',
    text: 'Cada imagen tiene una intención. El momento, el encuadre, el movimiento y la luz se combinan para construir algo que no solo se vea bien, sino que tenga identidad propia.',
  },
  {
    index: '04',
    title: 'Edit',
    text: 'Después de grabar empieza otra parte de la historia. El montaje encuentra el ritmo, une imágenes, sonido y color y convierte todo lo capturado en una pieza con sentido.',
  },
]

const DISCIPLINES = [
  { label: 'Working', kicker: '01 — En acción', ratio: '4 / 5', type: 'photo', ph: '[ WORKING ]', image: '/projects/about-working.jpg' },
  { label: 'Editing', kicker: '02 — Edición', ratio: '4 / 5', type: 'photo', ph: '[ EDITING ]', image: '/projects/about-editing.jpg' },
]

const STATS = [
  { number: '+500', label: 'Videos enviados' },
  { number: '+20', label: 'Ubicaciones' },
  { number: '4', label: 'Años de experiencia' },
]

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export default function About() {
  return (
    <div className="page about">
      {/* ---------- hero ---------- */}
      <section className="about-hero">
        <div className="container about-hero__grid">
          <Reveal className="about-hero__media">
            <img src={PROFILE_PHOTO} alt="Retrato del creador" className="about-hero__photo" />
            <div className="about-hero__photo-overlay" />
            <span className="about-hero__photo-name">Luis Meda</span>
          </Reveal>

          <Reveal delay={100} className="about-hero__content">
            <h1 className="page-title about-hero__title">
              Behind
              <br />
              the eye
            </h1>
            <p className="about-hero__intro">
              Un enfoque creativo basado en el trabajo, el criterio y la atención al detalle. Luis, dentro de Made, desarrolla proyectos audiovisuales de principio a fin, combinando planificación, producción y edición para conseguir un resultado sólido, cuidado y fiel a la identidad de cada propuesta. Porque detrás de cada proyecto hay una persona que confía en el trabajo, y esa confianza merece estar a la altura del resultado.
            </p>

            <div className="about-hero__stats">
              {STATS.map((stat) => (
                <div className="about-hero__stat" key={stat.label}>
                  <span className="about-hero__stat-number">{stat.number}</span>
                  <span className="about-hero__stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- philosophy ---------- */}
      <section className="section section--alt about-philosophy">
        <div className="container">
          <Reveal className="section-head">
            <h2 className="section-title">How I work</h2>
          </Reveal>

          <div className="about-philosophy__list">
            {PHILOSOPHY.map((item, i) => (
              <Reveal as="div" key={item.index} delay={i * 70} className="about-philosophy__item">
                <span className="about-philosophy__index">{item.index}</span>
                <h3 className="about-philosophy__title">{item.title}</h3>
                <p className="about-philosophy__text">{item.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- disciplines ---------- */}
      <section className="section about-disciplines">
        <div className="container">
          <Reveal className="section-head">
            <h2 className="section-title">Working &amp; editing</h2>
          </Reveal>

          <div className="about-disciplines__list">
            {DISCIPLINES.map((item, i) => (
              <Reveal
                as="div"
                key={item.label}
                delay={i * 80}
                className={`about-discipline ${i % 2 === 1 ? 'about-discipline--reverse' : ''}`}
              >
                <div className="about-discipline__media">
                  {item.image ? (
                    <img src={item.image} alt={item.label} className="about-discipline__photo" />
                  ) : (
                    <Placeholder label={item.ph} ratio={item.ratio} type={item.type} />
                  )}
                </div>
                <div className="about-discipline__content">
                  <span className="about-discipline__kicker">{item.kicker}</span>
                  <h3 className="about-discipline__label">{item.label}</h3>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- closing cta ---------- */}
      <section className="section about-closing">
        <div className="container">
          <Reveal className="about-closing__cta">
            <h2 className="section-title">
              made with intention
              <br />
              made to be felt
            </h2>
            <TransitionLink to="/contacto" className="link-arrow">
              Contact
              <ArrowIcon />
            </TransitionLink>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
