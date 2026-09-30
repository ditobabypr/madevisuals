import HomeFilmstrip from '../components/HomeFilmstrip'
import './Home.css'

// Drop-in folder: save the file as public/videos/hero-header.mp4 and it
// just works, no code change needed.
const HERO_VIDEO_URL = '/videos/hero-header.mp4'

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero__media">
          {HERO_VIDEO_URL && (
            <video
              className="hero__video"
              src={HERO_VIDEO_URL}
              autoPlay
              muted
              loop
              playsInline
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
