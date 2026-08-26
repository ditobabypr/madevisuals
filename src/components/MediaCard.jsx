import Placeholder from './Placeholder'
import './MediaCard.css'

export default function MediaCard({
  label,
  ratio = '4 / 5',
  type = 'photo',
  tag,
  title,
  meta,
  cta = 'Ver proyecto',
  size = '',
  className = '',
}) {
  return (
    <article className={`media-card ${size ? `media-card--${size}` : ''} ${className}`.trim()}>
      <div className="media-card__frame">
        <Placeholder label={label} ratio={ratio} type={type} className="media-card__placeholder" />
        <div className="media-card__overlay">
          <span className="media-card__cta">
            {cta}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </div>
      </div>

      <div className="media-card__meta">
        <div className="media-card__meta-row">
          {tag && <span className="media-card__tag">{tag}</span>}
          {meta && <span className="media-card__sub">{meta}</span>}
        </div>
        {title && <h3 className="media-card__title">{title}</h3>}
      </div>
    </article>
  )
}
