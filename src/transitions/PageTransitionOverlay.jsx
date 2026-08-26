import BrandLogo from '../components/BrandLogo'
import './PageTransitionOverlay.css'

export default function PageTransitionOverlay({ phase }) {
  if (phase === 'idle') return null

  return (
    <div className={`page-overlay page-overlay--${phase}`} aria-hidden="true">
      <div className="grain" />
      <div className="page-overlay__logo">
        <BrandLogo size="lg" />
      </div>
    </div>
  )
}
