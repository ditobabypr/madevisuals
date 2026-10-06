import BrandLogo from './BrandLogo'
import { INSTAGRAM, LINKEDIN, YOUTUBE } from '../data/socials'
import TransitionLink from '../transitions/TransitionLink'
import { prefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import './Footer.css'

const SOCIALS = [INSTAGRAM, YOUTUBE, LINKEDIN]

export default function Footer() {
  const year = new Date().getFullYear()

  const scrollToTop = (e) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <TransitionLink to="/">
            <BrandLogo size="sm" />
          </TransitionLink>
          <span className="footer__copy">
            © {year} Madevisuals. Todos los derechos reservados.
          </span>
        </div>

        <nav className="footer__socials" aria-label="Redes sociales">
          {SOCIALS.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
              {s.label}
            </a>
          ))}
        </nav>

        <button className="footer__top" onClick={scrollToTop} aria-label="Volver arriba">
          Volver arriba
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M12 19V5M6 11l6-6 6 6" />
          </svg>
        </button>
      </div>
    </footer>
  )
}
