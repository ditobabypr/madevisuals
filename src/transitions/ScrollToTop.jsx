import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Jumps — never glides — to the top on a route change. html has
// scroll-behavior: smooth (for in-page links and "back to top"), which would
// otherwise animate the new page all the way up from wherever the old one
// was left, behind the cover: firing every scroll reveal and lazy image on
// the way, and sometimes still moving when the cover lifts. Layout effect so
// it lands before the new page's first paint.
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    } catch {
      // Older Safari rejects 'instant' — override the CSS for this one jump
      // instead (reading the style forces it to apply before scrolling).
      const root = document.documentElement
      const previous = root.style.scrollBehavior
      root.style.scrollBehavior = 'auto'
      void getComputedStyle(root).scrollBehavior
      window.scrollTo(0, 0)
      root.style.scrollBehavior = previous
    }
  }, [pathname])

  return null
}
