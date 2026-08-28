import HomeFilmstrip from '../components/HomeFilmstrip'
import './Home.css'

// q_auto/f_auto let Cloudinary pick the best codec/quality per browser;
// w_1920 caps the delivered resolution since the source is 4K but this
// only ever renders as a background video.
const HERO_VIDEO_URL =
  'https://res.cloudinary.com/xawdx2ki/video/upload/q_auto,f_auto,w_1920/v1787931099/COLOR.mp4'

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
