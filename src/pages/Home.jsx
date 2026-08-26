import Reveal from '../components/Reveal'
import Marquee from '../components/Marquee'
import MediaCard from '../components/MediaCard'
import TransitionLink from '../transitions/TransitionLink'
import './Home.css'

const CATEGORIES = [
  { to: '/proyectos', label: 'Viajes', sub: 'Documental', img: '[ VIAJES ]', type: 'photo' },
  { to: '/proyectos', label: 'Bodas', sub: 'Fotografía · Vídeo', img: '[ BODAS ]', type: 'photo' },
  { to: '/proyectos', label: 'Discotecas', sub: 'Nightlife', img: '[ DISCOTECAS ]', type: 'video' },
  { to: '/proyectos', label: 'Afterparties', sub: 'Contenido de marca', img: '[ AFTERPARTIES ]', type: 'video' },
]

const MARQUEE_ITEMS = [
  'Fotografía',
  'Vídeo',
  'Edición',
  'Bodas',
  'Viajes',
  'Discotecas',
  'Afterparties',
]

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero__media">
          {/* Temporary demo clip to preview the video treatment — swap for the real reel/footage later. */}
          <video
            className="hero__video"
            src="/hero-demo.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="hero__overlay" />
          <div className="grain" />
        </div>

        <div className="hero__frame container">
          <span className="hero__brand-line">Madevisuals</span>
          <span className="hero__brand-line hero__brand-line--stack">
            Fotografía <span className="hero__dash">/</span> Vídeo <span className="hero__dash">/</span> Edición
          </span>
        </div>

        <div className="hero__content container">
          <h1 className="hero__title">
            VISUALS THAT
            <br />
            MAKE YOU
            <br />
            FEEL <span className="hero__title-accent">SOMETHING.</span>
          </h1>

          <p className="hero__subtitle">
            Fotografía y vídeo para bodas, viajes, discotecas y afterparties.
            Historias reales, contadas con ritmo y una mirada cinematográfica.
          </p>

          <div className="hero__actions">
            <TransitionLink to="/proyectos" className="btn btn--accent">
              Ver proyectos →
            </TransitionLink>
          </div>
        </div>

        <div className="hero__scroll">
          <span>Scroll</span>
          <span className="hero__scroll-line" />
        </div>
      </section>

      <Marquee items={MARQUEE_ITEMS} />

      <section className="section home-categories">
        <div className="container">
          <Reveal className="section-head">
            <p className="kicker">Explora el trabajo</p>
            <h2 className="section-title">
              Cuatro mundos,
              <br />
              una misma mirada.
            </h2>
          </Reveal>

          <div className="home-categories__grid">
            {CATEGORIES.map((cat, i) => (
              <Reveal as="div" key={cat.label} delay={i * 80}>
                <TransitionLink to={cat.to} className="home-categories__link">
                  <MediaCard
                    label={cat.img}
                    ratio="4 / 5"
                    type={cat.type}
                    tag={cat.sub}
                    title={cat.label}
                    cta="Ver proyectos"
                  />
                </TransitionLink>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
