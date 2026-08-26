import { useState } from 'react'
import Reveal from '../components/Reveal'
import './Contact.css'

const PROJECT_TYPES = ['Boda', 'Viaje', 'Evento / Discoteca', 'Marca', 'Otro proyecto']

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', projectType: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="page contact">
      <div className="container contact__grid">
        <Reveal className="contact__intro">
          <p className="kicker">Contacto</p>
          <h1 className="page-title">
            ¿Tienes un
            <br />
            proyecto?
            <br />
            <span className="contact__title-accent">Hablemos.</span>
          </h1>

          <ul className="contact__details">
            <li>
              <span className="contact__details-label">Instagram</span>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">@madevisuals</a>
            </li>
            <li>
              <span className="contact__details-label">Email</span>
              <a href="mailto:hola@madevisuals.com">hola@madevisuals.com</a>
            </li>
            <li>
              <span className="contact__details-label">Teléfono</span>
              <a href="tel:+34600000000">+34 600 000 000</a>
            </li>
          </ul>
        </Reveal>

        <Reveal delay={100} className="contact__form-wrap">
          {submitted ? (
            <div className="contact__success">
              <span className="contact__success-icon">✓</span>
              <h3>Mensaje enviado</h3>
              <p>Gracias por escribir. Te responderé lo antes posible.</p>
              <button className="link-arrow" onClick={() => setSubmitted(false)}>
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form className="contact__form" onSubmit={handleSubmit}>
              <div className="contact__field">
                <label htmlFor="name">Nombre</label>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="Tu nombre"
                  value={form.name}
                  onChange={handleChange('name')}
                />
              </div>

              <div className="contact__field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="tu@email.com"
                  value={form.email}
                  onChange={handleChange('email')}
                />
              </div>

              <div className="contact__field">
                <label htmlFor="projectType">Tipo de proyecto</label>
                <select
                  id="projectType"
                  required
                  value={form.projectType}
                  onChange={handleChange('projectType')}
                >
                  <option value="" disabled>
                    Selecciona una opción
                  </option>
                  {PROJECT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="contact__field">
                <label htmlFor="message">Mensaje</label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  placeholder="Cuéntame sobre tu proyecto..."
                  value={form.message}
                  onChange={handleChange('message')}
                />
              </div>

              <button type="submit" className="btn btn--accent contact__submit">
                Enviar →
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </div>
  )
}
