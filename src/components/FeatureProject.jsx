import Placeholder from './Placeholder'
import TransitionLink from '../transitions/TransitionLink'
import './FeatureProject.css'

export default function FeatureProject({
  index,
  label,
  ratio = '16 / 9',
  type = 'photo',
  category,
  title,
  year,
  to = '/proyectos',
}) {
  return (
    <TransitionLink to={to} className="feature-project">
      <span className="feature-project__index">{index}</span>

      <div className="feature-project__frame">
        <Placeholder label={label} ratio={ratio} type={type} className="feature-project__placeholder" />
        <div className="feature-project__overlay">
          <span className="feature-project__cta">
            Ver proyecto
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </div>
      </div>

      <div className="feature-project__meta">
        <h3 className="feature-project__title">{title}</h3>
        <div className="feature-project__row">
          <span>{category}</span>
          <span>{year}</span>
        </div>
      </div>
    </TransitionLink>
  )
}
