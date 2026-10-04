import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import BrandLogo from './BrandLogo'
import TransitionLink from '../transitions/TransitionLink'
import './Navbar.css'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/proyectos', label: 'Work' },
  { to: '/sobre-mi', label: 'About me' },
  { to: '/contacto', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const toggleRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
  }, [menuOpen])

  // Keyboard: focus moves into the menu when it opens, Escape closes it, and
  // focus goes back to the toggle instead of being stranded on a link that
  // just turned invisible.
  useEffect(() => {
    if (!menuOpen) return
    menuRef.current?.querySelector('a')?.focus()

    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      if (menuRef.current?.contains(document.activeElement)) toggleRef.current?.focus()
    }
  }, [menuOpen])

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        <TransitionLink to="/" className="navbar__brand">
          <BrandLogo />
        </TransitionLink>

        <TransitionLink to="/" className="navbar__center">
          MADEVISUALS
        </TransitionLink>

        <nav className="navbar__links" aria-label="Navegación principal">
          {LINKS.map((link) => (
            <TransitionLink
              key={link.to}
              to={link.to}
              className={`navbar__link ${location.pathname === link.to ? 'navbar__link--active' : ''}`}
            >
              {link.label}
            </TransitionLink>
          ))}
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className={`navbar__toggle ${menuOpen ? 'navbar__toggle--open' : ''}`}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>

      <nav
        id="mobile-menu"
        ref={menuRef}
        aria-label="Menú"
        className={`navbar__mobile ${menuOpen ? 'navbar__mobile--open' : ''}`}
      >
        {LINKS.map((link, i) => (
          <TransitionLink
            key={link.to}
            to={link.to}
            className={`navbar__mobile-link ${location.pathname === link.to ? 'navbar__link--active' : ''}`}
            style={{ transitionDelay: `${menuOpen ? i * 60 + 80 : 0}ms` }}
          >
            <span className="navbar__mobile-index">{String(i + 1).padStart(2, '0')}</span>
            {link.label}
          </TransitionLink>
        ))}

        <div className="navbar__mobile-footer">
          <span>@madevisuals</span>
          <span>madevcreative@gmail.com</span>
        </div>
      </nav>
    </header>
  )
}
