import { useMemo } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import Reveal from '../components/Reveal'
import Placeholder from '../components/Placeholder'
import YouTubeEmbed from '../components/YouTubeEmbed'
import ReelsCarousel from '../components/ReelsCarousel'
import TetrisCollage from '../components/TetrisCollage'
import MosaicCollage from '../components/MosaicCollage'
import TransitionLink from '../transitions/TransitionLink'
import { PROJECTS, getProjectBySlug } from '../data/projects'
import { getVideoCount } from '../data/projectLayout'
import './ProjectDetail.css'

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

export default function ProjectDetail() {
  const { slug } = useParams()
  const project = getProjectBySlug(slug)
  const videoCount = useMemo(() => (project ? getVideoCount(project) : 0), [project])

  if (!project) return <Navigate to="/proyectos" replace />

  const index = PROJECTS.findIndex((p) => p.slug === slug)
  const prev = PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length]
  const next = PROJECTS[(index + 1) % PROJECTS.length]

  return (
    <div className="page project-detail">
      {/* Same cover art (poster + logo) shown on the Work tile — this is the
          "capture of the Work cover" band, stretched to fill. */}
      <div className="project-detail__banner">
        <img src={project.poster} alt="" className="project-detail__banner-image" />
      </div>

      <div className="container project-detail__body">
        <div className={`project-detail__intro ${project.sections.length === 0 ? 'project-detail__intro--split' : ''}`}>
          <div className="project-detail__intro-main">
            <Reveal as="h1" className="page-title project-detail__title">
              {project.title}
            </Reveal>
            {project.text ? (
              <Reveal as="p" delay={60} className="project-detail__text">
                {project.text}
              </Reveal>
            ) : (
              <Reveal as="div" delay={60} className="project-detail__text-placeholder">
                [ PROJECT TEXT ]
              </Reveal>
            )}
          </div>

          {project.sections.length === 0 && (
            <Reveal delay={100} className="project-detail__intro-image-wrap">
              {project.introMedia === 'video' ? (
                <YouTubeEmbed
                  url={project.images[0]}
                  title={project.title}
                  ratio="9 / 16"
                  className="project-detail__intro-image"
                />
              ) : project.images[0] ? (
                <img
                  src={project.images[0]}
                  alt={project.title}
                  className="project-detail__intro-image"
                  style={{ aspectRatio: '3 / 4', objectFit: 'cover' }}
                />
              ) : (
                <Placeholder
                  label="[ PROJECT IMAGE ]"
                  ratio="3 / 4"
                  type="photo"
                  className="project-detail__intro-image"
                />
              )}
            </Reveal>
          )}
        </div>

        {project.sections.length > 0 ? (
          <div className="project-detail__stories">
            {project.sections.map((section, i) => (
              <Reveal as="section" key={section.label} delay={i * 40} className="project-story">
                <div className="project-story__head">
                  <span className="project-story__kicker">{String(i + 1).padStart(2, '0')} — Xcape</span>
                  <h2 className="project-story__title">{section.label}</h2>
                </div>

                <div className="project-story__hero">
                  <YouTubeEmbed url={section.video} title={`${project.title} — ${section.label}`} />
                </div>

                <TetrisCollage items={section.collage} variant={i} />

                <ReelsCarousel reels={section.reels} label={section.label} />
              </Reveal>
            ))}
          </div>
        ) : (
          <>
            {!project.noReels && (
              <Reveal as="div" delay={160} className="project-detail__video-section">
                {project.format === 'vertical' ? (
                  <div className="project-detail__reels">
                    {Array.from({ length: videoCount }).map((_, i) => (
                      <YouTubeEmbed
                        key={i}
                        url={project.videos[i]}
                        title={`${project.title} — video ${i + 1}`}
                        ratio="9 / 16"
                        className="project-detail__reel"
                      />
                    ))}
                  </div>
                ) : (
                  <YouTubeEmbed url={project.videos[0]} title={project.title} />
                )}
              </Reveal>
            )}

            <ReelsCarousel
              reels={project.reelsCarousel}
              label={project.title}
              ratio={project.reelsCarouselRatio}
              cardWidth={project.reelsCarouselWidth}
            />

            {project.sideImages.length > 0 && (
              <Reveal as="div" delay={170} className="project-detail__mini-gallery">
                {project.sideImages.map((url, i) =>
                  url ? (
                    <img key={i} src={url} alt="" className="project-detail__mini-photo" />
                  ) : (
                    <Placeholder key={i} label="[ IMAGE ]" ratio="4 / 3" type="photo" className="project-detail__mini-photo" />
                  )
                )}
              </Reveal>
            )}

            {project.photoCollage.length > 0 && (
              <Reveal as="div" delay={180} className="project-detail__collage">
                {project.photoCollageShape === 'mosaic' ? (
                  <MosaicCollage items={project.photoCollage} />
                ) : (
                  <TetrisCollage items={project.photoCollage} variant={0} ratio={project.photoCollageRatio} />
                )}
              </Reveal>
            )}

            {project.reels.length > 0 && (
              <Reveal as="div" delay={200} className="project-detail__reels-extra">
                <div className="project-detail__reels">
                  {project.reels.map((url, i) => (
                    <YouTubeEmbed
                      key={i}
                      url={url}
                      title={`${project.title} — reel ${i + 1}`}
                      ratio="9 / 16"
                      className="project-detail__reel"
                    />
                  ))}
                </div>
              </Reveal>
            )}
          </>
        )}
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
