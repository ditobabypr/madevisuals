import './Placeholder.css'

const CameraIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1">
    <path d="M4 8h3l1.6-2.2h6.8L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
    <circle cx="12" cy="13.2" r="3.4" />
  </svg>
)

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1">
    <circle cx="12" cy="12" r="10" />
    <path d="M10 8.3l6.2 3.7-6.2 3.7z" fill="currentColor" stroke="none" />
  </svg>
)

export default function Placeholder({
  label,
  sublabel,
  ratio = '4 / 5',
  type = 'photo',
  className = '',
}) {
  return (
    <div className={`media-placeholder ${className}`.trim()} style={{ '--ratio': ratio }}>
      <div className="media-placeholder__content">
        <span className="media-placeholder__icon" aria-hidden="true">
          {type === 'video' ? <PlayIcon /> : <CameraIcon />}
        </span>
        <span className="media-placeholder__label">{label}</span>
        {sublabel && <span className="media-placeholder__sublabel">{sublabel}</span>}
      </div>
    </div>
  )
}
