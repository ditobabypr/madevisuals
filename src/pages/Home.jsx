import { useEffect, useRef } from 'react'
import Reveal from '../components/Reveal'
import Marquee from '../components/Marquee'
import FeatureProject from '../components/FeatureProject'
import TransitionLink from '../transitions/TransitionLink'
import './Home.css'

const MARQUEE_ITEMS = [
  'Fotografía',
  'Vídeo',
  'Edición',
  'Bodas',
  'Viajes',
  'Discotecas',
  'Afterparties',
]

const FEATURED = [
  { index: '01', label: '[ NIGHTLIFE ]', ratio: '16 / 9', type: 'video', title: 'Noche Blanca Club', category: 'Discotecas', year: '2025' },
  { index: '02', label: '[ WEDDING ]', ratio: '4 / 5', type: 'photo', title: 'Laura & Marc', category: 'Bodas', year: '2025' },
  { index: '03', label: '[ TRAVEL ]', ratio: '1 / 1', type: 'photo', title: 'Sudeste Asiático', category: 'Viajes', year: '2024' },
  { index: '04', label: '[ AFTERPARTY ]', ratio: '16 / 9', type: 'video', title: 'After Costa Sur', category: 'Afterparties', year: '2024' },
]

// Subtle scroll-linked scale/fade on the hero video — the footage stays
// present as the user leaves the hero instead of cutting away abruptly.
function useHeroScrollEffect(ref) {
  useEffect(() => {
    const node = ref.current
    if (!node) return

    let ticking = false
    const heroHeight = () => node.parentElement?.offsetHeight || window.innerHeight

    const update = () => {
      const progress = Math.min(window.scrollY / heroHeight(), 1)
      const scale = 1 - progress * 0.06
      const opacity = 1 - progress * 0.35
      node.style.transform = `scale(${scale})`
      node.style.opacity = opacity
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update)
        ticking = true
      }
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [ref])
}

export default function Home() {
  const videoWrapRef = useRef(null)
  useHeroScrollEffect(videoWrapRef)

  return (
    <div className="home">
      <section className="hero">
        <div className="hero__media" ref={videoWrapRef}>
          {/* Highlights showreel — swap by replacing /public/highlights.mp4 */}
          <video
            className="hero__video"
            src="/highlights.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="hero__overlay" />
          <div className="grain" />
        </div>

        <div className="hero__content container">
          <div className="hero__identity">
            <span className="hero__brand">Madevisuals</span>
            <span className="hero__roles">Photography · Video · Editing</span>
          </div>

          <TransitionLink to="/proyectos" className="hero__cta">
            Ver proyectos
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </TransitionLink>
        </div>

        <div className="hero__scroll">
          <span className="hero__scroll-line" />
        </div>
      </section>

      <Marquee items={MARQUEE_ITEMS} />

      <section className="section home-selected">
        <div className="container">
          <Reveal className="home-selected__head">
            <p className="kicker">Selected work</p>
            <h2 className="section-title">Proyectos destacados</h2>
          </Reveal>

          <div className="home-selected__list">
            {FEATURED.map((item, i) => (
              <Reveal as="div" key={item.title} delay={i * 60}>
                <FeatureProject {...item} />
              </Reveal>
            ))}
          </div>

          <Reveal className="home-selected__more">
            <TransitionLink to="/proyectos" className="link-arrow">
              Ver todos los proyectos
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </TransitionLink>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
