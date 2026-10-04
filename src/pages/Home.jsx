import HomeFilmstrip from '../components/HomeFilmstrip'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import './Home.css'

// Drop-in folder: save the file as public/videos/hero-header.mp4 and it
// just works, no code change needed.
const HERO_VIDEO_URL = '/videos/hero-header.mp4'
// Same clip cropped to the centre 3:4 at 1440x1920 (~half the weight, and no
// 4K decode on a phone). Narrow portrait screens only see that centre band
// of the 16:9 file anyway (object-fit: cover), so the framing is identical.
// Re-export it whenever hero-header.mp4 changes.
const HERO_MOBILE_VIDEO_URL = '/videos/hero-header-mobile.mp4'
const HERO_MOBILE_MEDIA = '(max-width: 900px) and (max-aspect-ratio: 3/4)'
// First frame of the clip — shown while the video buffers instead of black.
const HERO_POSTER_URL = '/videos/hero-poster.webp'

export default function Home() {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <div className="home">
      <section className="hero">
        <div className="hero__media">
          {HERO_VIDEO_URL && (
            <video
              className="hero__video"
              poster={HERO_POSTER_URL}
              autoPlay={!reducedMotion}
              preload={reducedMotion ? 'none' : 'auto'}
              muted
              loop
              playsInline
              aria-hidden="true"
            >
              <source src={HERO_MOBILE_VIDEO_URL} type="video/mp4" media={HERO_MOBILE_MEDIA} />
              <source src={HERO_VIDEO_URL} type="video/mp4" />
            </video>
          )}
          <div className="hero__overlay" />
          <div className="grain" />
        </div>

        <div className="hero__statement">
          <p className="hero__statement-line">
            Made <span className="hero__statement-line--thin">to create</span>
          </p>
          <p className="hero__statement-line">
            <span className="hero__statement-line--thin">made to</span> inspire
          </p>
        </div>

        <HomeFilmstrip />
      </section>
    </div>
  )
}
