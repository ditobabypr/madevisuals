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

  // Scroll lock only while open — restoring what was there before, so it
  // never clobbers the intro's own lock.
  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [menuOpen])

  // Keyboard: focus moves into the menu when it opens, Tab cycles between
  // the toggle and the menu links (the page behind is covered), Escape
  // closes it, and focus goes back to the toggle instead of being stranded
  // on a link that just turned invisible.
  useEffect(() => {
    if (!menuOpen) return
    const menu = menuRef.current
    menu?.querySelector('a')?.focus()

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        return
      }
      if (e.key !== 'Tab' || !menu) return
      const focusables = [toggleRef.current, ...menu.querySelectorAll('a')]
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      if (menu?.contains(document.activeElement)) toggleRef.current?.focus()
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
              aria-current={location.pathname === link.to ? 'page' : undefined}
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
            aria-current={location.pathname === link.to ? 'page' : undefined}
            // Other links close the menu under the transition cover (on the
            // route change); the current page has no navigation to wait for.
            onClick={() => link.to === location.pathname && setMenuOpen(false)}
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
