import { useMemo } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import Reveal from '../components/Reveal'
import Placeholder from '../components/Placeholder'
import YouTubeEmbed from '../components/YouTubeEmbed'
import TransitionLink from '../transitions/TransitionLink'
import { PROJECTS, getProjectBySlug } from '../data/projects'
import { getProjectComposition } from '../data/projectLayout'
import './ProjectDetail.css'

const PHOTO_RATIO_BY_BLOCK = {
  'photo-solo': '3 / 2',
  'photo-solo-large': '21 / 9',
  'photo-duo': '4 / 5',
  'photo-trio': '3 / 4',
}

const PHOTO_RADIUS_BY_BLOCK = {
  'photo-solo': 'lg',
  'photo-solo-large': 'xl',
  'photo-duo': 'lg',
  'photo-trio': 'md',
}

const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
)

const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

function ProjectPhoto({ src, alt, blockType }) {
  const ratio = PHOTO_RATIO_BY_BLOCK[blockType] || '4 / 5'
  const radius = PHOTO_RADIUS_BY_BLOCK[blockType] || 'lg'

  if (!src) {
    return (
      <Placeholder
        label="[ PROJECT IMAGE ]"
        ratio={ratio}
        type="photo"
        className={`project-photo project-photo--${radius}`}
      />
    )
  }

  return (
    <div className={`project-photo project-photo--${radius}`} style={{ aspectRatio: ratio }}>
      <img src={src} alt={alt} loading="lazy" />
    </div>
  )
}

export default function ProjectDetail() {
  const { slug } = useParams()
  const project = getProjectBySlug(slug)
  const composition = useMemo(() => (project ? getProjectComposition(project) : null), [project])

  if (!project) return <Navigate to="/proyectos" replace />

  const index = PROJECTS.findIndex((p) => p.slug === slug)
  const prev = PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length]
  const next = PROJECTS[(index + 1) % PROJECTS.length]

  return (
    <div className="page project-detail">
      <div className="container project-detail__top">
        <TransitionLink to="/proyectos" className="link-arrow project-detail__back">
          <ArrowLeftIcon />
          Work
        </TransitionLink>
        <h1 className="page-title project-detail__title">{project.title}</h1>
      </div>

      <div className="container project-detail__flow">
        {composition.blocks.map((block, i) => (
          <Reveal
            as="div"
            key={i}
            delay={(i % 4) * 70}
            className={`project-block project-block--${block.type}`}
          >
            {block.videoItems.map((vi) => (
              <YouTubeEmbed
                key={`v${vi}`}
                url={project.videos[vi]}
                title={`${project.title} — video ${vi + 1}`}
              />
            ))}
            {block.photoItems.map((pi) => (
              <ProjectPhoto
                key={`p${pi}`}
                src={project.images[pi]}
                alt={`${project.title} — foto ${pi + 1}`}
                blockType={block.type}
              />
            ))}
          </Reveal>
        ))}
      </div>

      <div className="container project-detail__nav">
        <TransitionLink to={`/proyectos/${prev.slug}`} className="link-arrow">
          <ArrowLeftIcon />
          Previous
        </TransitionLink>
        <TransitionLink to={`/proyectos/${next.slug}`} className="link-arrow">
          Next
          <ArrowRightIcon />
        </TransitionLink>
      </div>
    </div>
  )
}
