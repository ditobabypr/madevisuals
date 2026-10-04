import Reveal from '../components/Reveal'
import TransitionLink from '../transitions/TransitionLink'
import './NotFound.css'

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export default function NotFound() {
  return (
    <div className="page not-found">
      <Reveal className="container not-found__inner">
        <span className="kicker">Página no encontrada</span>
        <h1 className="page-title">404</h1>
        <p className="section-lede">La página que buscas no existe o ha cambiado de dirección.</p>
        <TransitionLink to="/" className="link-arrow">
          Volver a Home
          <ArrowIcon />
        </TransitionLink>
      </Reveal>
    </div>
  )
}
