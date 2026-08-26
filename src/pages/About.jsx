import Reveal from '../components/Reveal'
import Placeholder from '../components/Placeholder'
import './About.css'

const ROLES = ['Fotógrafo', 'Videógrafo', 'Editor']
const SKILLS = ['Fotografía', 'Videografía', 'Edición', 'Dirección creativa']

export default function About() {
  return (
    <div className="page about">
      <div className="container about__grid">
        <Reveal className="about__media">
          <Placeholder label="[ FOTO DEL FOTÓGRAFO ]" ratio="4 / 5" type="photo" />
        </Reveal>

        <Reveal delay={100} className="about__content">
          <p className="kicker">Sobre mí</p>
          <h1 className="about__name">Madevisuals</h1>

          <div className="about__roles">
            {ROLES.map((role) => (
              <span key={role}>{role}</span>
            ))}
          </div>

          <p className="about__quote">
            "Me gusta capturar la energía de los lugares, las personas y los
            momentos que no se pueden repetir."
          </p>

          <p className="about__text">
            Trabajo entre bodas, viajes, discotecas y eventos, adaptando mi
            estilo a cada historia sin perder una mirada cinematográfica. Para
            mí, cada proyecto es una oportunidad de traducir una experiencia
            real en imágenes que se sientan igual de intensas después del
            momento — con ritmo, energía y una estética que no pasa
            desapercibida.
          </p>

          <ul className="about__skills">
            {SKILLS.map((skill, i) => (
              <li key={skill}>
                <span className="about__skills-index">{String(i + 1).padStart(2, '0')}</span>
                <span>{skill}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </div>
  )
}
