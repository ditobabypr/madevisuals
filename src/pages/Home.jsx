import HomeFilmstrip from '../components/HomeFilmstrip'
import './Home.css'

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero__media">
          {/* Highlights showreel — swap by replacing /public/highlights.mp4 */}
          <video
            className="hero__video"
            src="/highlights.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
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
