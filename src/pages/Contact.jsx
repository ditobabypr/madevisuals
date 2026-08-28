import { useState } from 'react'
import Reveal from '../components/Reveal'
import './Contact.css'

const PROJECT_TYPES = ['Boda', 'Viaje', 'Evento / Discoteca', 'Marca', 'Otro proyecto']
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mljeergv'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', projectType: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(false)

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(false)

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(e.target),
      })

      if (!res.ok) throw new Error('Formspree submission failed')
      setSubmitted(true)
    } catch {
      setError(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page contact">
      <div className="container contact__grid">
        <Reveal className="contact__intro">
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
              <a href="mailto:madevcreative@gmail.com">madevcreative@gmail.com</a>
            </li>
            <li>
              <span className="contact__details-label">Teléfono</span>
              <a href="tel:+34652525871">+34 652 525 871</a>
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
                  name="name"
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
                  name="email"
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
                  name="projectType"
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
                  name="message"
                  required
                  rows={4}
                  placeholder="Cuéntame sobre tu proyecto..."
                  value={form.message}
                  onChange={handleChange('message')}
                />
              </div>

              {error && (
                <p className="contact__form-error">
                  No se pudo enviar el mensaje. Inténtalo de nuevo o escribe a{' '}
                  <a href="mailto:madevcreative@gmail.com">madevcreative@gmail.com</a>.
                </p>
              )}

              <button type="submit" className="btn btn--accent contact__submit" disabled={submitting}>
                {submitting ? 'Enviando...' : 'Enviar →'}
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </div>
  )
}
