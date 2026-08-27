import Placeholder from './Placeholder'
import TransitionLink from '../transitions/TransitionLink'
import './ProjectTile.css'

export default function ProjectTile({
  label,
  ratio = '4 / 5',
  type = 'photo',
  category,
  title,
  year,
  size = '',
  to = '/proyectos',
}) {
  return (
    <TransitionLink to={to} className={`project-tile ${size ? `project-tile--${size}` : ''}`}>
      <Placeholder label={label} ratio={ratio} type={type} className="project-tile__media" />

      <div className="project-tile__overlay">
        <span className="project-tile__title">{title}</span>
        <span className="project-tile__meta">
          {category} <span className="project-tile__dot">·</span> {year}
        </span>
      </div>
    </TransitionLink>
  )
}
