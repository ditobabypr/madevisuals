import { useRef } from 'react'
import HomeFilmstrip from '../components/HomeFilmstrip'
import useAutoplay from '../hooks/useAutoplay'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import './Home.css'

// Drop-in folder: save the file as public/videos/hero-header.mp4 and it
// just works, no code change needed. Keep it H.264 at 1920x1080 (level
// 4.0): 4K or VP9/AV1 files fail or stutter on many laptops and phones.
const HERO_VIDEO_URL = '/videos/hero-header.mp4'
// First frame of the clip — shown while the video buffers instead of black.
// JPEG rather than WebP so older Safari (macOS before Big Sur) shows it too.
const HERO_POSTER_URL = '/videos/hero-poster.jpg'

export default function Home() {
  const reducedMotion = usePrefersReducedMotion()
  const videoRef = useRef(null)
  useAutoplay(videoRef, !reducedMotion)

  return (
    <div className="home">
      <section className="hero">
        <div className="hero__media">
          {HERO_VIDEO_URL && (
            <video
              ref={videoRef}
              className="hero__video"
              src={HERO_VIDEO_URL}
              poster={HERO_POSTER_URL}
              autoPlay={!reducedMotion}
              preload={reducedMotion ? 'none' : 'auto'}
              muted
              loop
              playsInline
              aria-hidden="true"
            />
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
